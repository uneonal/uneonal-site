// Squeeze: PDF compression engine. Everything runs in the visitor's browser; nothing is uploaded.
//
// Two modes:
//   "keep"    Keep text selectable. Re-compresses the photos and scans inside the PDF and tidies the file structure.
//   "flatten" Smallest size. Turns every page into a compressed image (text is no longer selectable).
//
// Needs pdf-lib (global PDFLib). pdf.js is loaded on demand for "flatten".
(function () {
  "use strict";

  var SCRIPT_URL = document.currentScript ? document.currentScript.src : location.href;

  var LEVELS = {
    keep: {
      light:    { q: 0.82, scale: 1,    cap: 3200 },
      balanced: { q: 0.70, scale: 0.75, cap: 2400 },
      strong:   { q: 0.55, scale: 0.55, cap: 1800 }
    },
    flatten: {
      light:    { dpi: 150, q: 0.80 },
      balanced: { dpi: 110, q: 0.65 },
      strong:   { dpi: 80,  q: 0.50 }
    }
  };

  // ---------- small helpers ----------
  function yieldToUi() { return new Promise(function (r) { setTimeout(r, 0); }); }
  function abortCheck(signal) {
    if (signal && signal.aborted) { var e = new Error("Cancelled"); e.name = "AbortError"; throw e; }
  }
  function makeCanvas(w, h) {
    if (typeof OffscreenCanvas !== "undefined") return new OffscreenCanvas(w, h);
    var c = document.createElement("canvas"); c.width = w; c.height = h; return c;
  }
  function canvasToJpeg(canvas, q) {
    if (canvas.convertToBlob) return canvas.convertToBlob({ type: "image/jpeg", quality: q });
    return new Promise(function (res, rej) {
      canvas.toBlob(function (b) { b ? res(b) : rej(new Error("Could not encode the image.")); }, "image/jpeg", q);
    });
  }
  function blobBytes(blob) { return blob.arrayBuffer().then(function (b) { return new Uint8Array(b); }); }
  function nm(v) { return v && v.toString ? v.toString().replace(/^\//, "") : ""; }
  function getNum(ctx, dict, key) {
    var v = ctx.lookup(dict.get(PDFLib.PDFName.of(key)));
    return v && v.asNumber ? v.asNumber() : undefined;
  }

  async function inflate(bytes) {
    if (typeof DecompressionStream === "undefined") throw new Error("Inflate not supported");
    var stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate"));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  }

  // Undo the PNG-style row filters that PDF "Flate" images often use.
  function unpredictPng(data, columns, colors, height) {
    var bpp = Math.max(1, colors);            // 8 bits per component
    var rowBytes = columns * colors;
    if (data.length < (rowBytes + 1) * height) return null;
    var out = new Uint8Array(rowBytes * height);
    var prev = new Uint8Array(rowBytes), pos = 0, y, i;
    for (y = 0; y < height; y++) {
      var ft = data[pos++];
      var row = out.subarray(y * rowBytes, (y + 1) * rowBytes);
      for (i = 0; i < rowBytes; i++) {
        var x = data[pos + i], a = i >= bpp ? row[i - bpp] : 0, b = prev[i], c = i >= bpp ? prev[i - bpp] : 0, v;
        switch (ft) {
          case 0: v = x; break;
          case 1: v = x + a; break;
          case 2: v = x + b; break;
          case 3: v = x + ((a + b) >> 1); break;
          case 4:
            var p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
            v = x + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c);
            break;
          default: v = x;
        }
        row[i] = v & 255;
      }
      pos += rowBytes;
      prev = row;
    }
    return out;
  }

  // Number of colour components (1 or 3) for colour spaces we can safely re-encode, otherwise 0.
  function colorComponents(ctx, dict) {
    var P = PDFLib, cs = ctx.lookup(dict.get(P.PDFName.of("ColorSpace")));
    if (!cs) return 0;
    if (cs instanceof P.PDFName) { var n = nm(cs); return n === "DeviceRGB" ? 3 : n === "DeviceGray" ? 1 : 0; }
    if (cs instanceof P.PDFArray && cs.size() > 0) {
      var kind = nm(ctx.lookup(cs.get(0)));
      if (kind === "CalRGB") return 3;
      if (kind === "CalGray") return 1;
      if (kind === "ICCBased") {
        var st = ctx.lookup(cs.get(1));
        if (!st || !st.dict) return 0;
        var N = getNum(ctx, st.dict, "N");
        return N === 3 ? 3 : N === 1 ? 1 : 0;
      }
    }
    return 0;
  }

  function singleFilter(ctx, dict) {
    var P = PDFLib, f = ctx.lookup(dict.get(P.PDFName.of("Filter")));
    if (f instanceof P.PDFArray) { if (f.size() !== 1) return ""; f = ctx.lookup(f.get(0)); }
    return nm(f);
  }
  function decodeParms(ctx, dict) {
    var P = PDFLib, d = ctx.lookup(dict.get(P.PDFName.of("DecodeParms")));
    if (d instanceof P.PDFArray) d = d.size() ? ctx.lookup(d.get(0)) : null;
    return d && d.get ? d : null;
  }

  // ---------- keep-text mode: recompress images inside the PDF ----------
  async function recompressImage(ctx, obj, p) {
    var P = PDFLib, dict = obj.dict;
    var w = getNum(ctx, dict, "Width"), h = getNum(ctx, dict, "Height");
    if (!w || !h || w * h > 60e6) return null;
    if (dict.has(P.PDFName.of("Mask")) || dict.has(P.PDFName.of("Decode"))) return null;
    var im = ctx.lookup(dict.get(P.PDFName.of("ImageMask")));
    if (im && im.asBoolean && im.asBoolean()) return null;
    var comps = colorComponents(ctx, dict);
    if (!comps) return null;
    if (getNum(ctx, dict, "BitsPerComponent") !== 8) return null;

    var oldBytes = obj.getContents(), oldSize = oldBytes.length;
    if (oldSize < 30000) return null;                       // not worth touching small images
    var filter = singleFilter(ctx, dict);
    if (filter !== "DCTDecode" && filter !== "FlateDecode") return null;
    if (filter === "FlateDecode" && oldSize < 120000) return null;

    var scale = Math.min(p.scale, p.cap / Math.max(w, h), 1);
    var nw = Math.max(1, Math.round(w * scale)), nh = Math.max(1, Math.round(h * scale));
    var canvas = makeCanvas(nw, nh), c2 = canvas.getContext("2d");
    c2.fillStyle = "#ffffff"; c2.fillRect(0, 0, nw, nh);
    c2.imageSmoothingQuality = "high";

    if (filter === "DCTDecode") {
      var blob = new Blob([oldBytes], { type: "image/jpeg" }), bmp;
      try { bmp = await createImageBitmap(blob, { imageOrientation: "none" }); }
      catch (e) { bmp = await createImageBitmap(blob); }
      c2.drawImage(bmp, 0, 0, nw, nh);
      if (bmp.close) bmp.close();
    } else {
      var raw = await inflate(oldBytes);
      var parms = decodeParms(ctx, dict), pred = parms ? (getNum(ctx, parms, "Predictor") || 1) : 1;
      if (pred === 2) return null;
      if (pred >= 10) {
        raw = unpredictPng(raw, (parms && getNum(ctx, parms, "Columns")) || w, (parms && getNum(ctx, parms, "Colors")) || comps, h);
        if (!raw) return null;
      }
      if (raw.length < w * h * comps) return null;
      var rgba = new Uint8ClampedArray(w * h * 4), i, j = 0;
      for (i = 0; i < w * h; i++) {
        if (comps === 3) { rgba[j++] = raw[i * 3]; rgba[j++] = raw[i * 3 + 1]; rgba[j++] = raw[i * 3 + 2]; }
        else { var g = raw[i]; rgba[j++] = g; rgba[j++] = g; rgba[j++] = g; }
        rgba[j++] = 255;
      }
      var tmp = makeCanvas(w, h);
      tmp.getContext("2d").putImageData(new ImageData(rgba, w, h), 0, 0);
      c2.drawImage(tmp, 0, 0, nw, nh);
    }

    var out = await blobBytes(await canvasToJpeg(canvas, p.q));
    if (out.length > oldSize * 0.9) return null;            // keep the original unless it is clearly smaller
    return { bytes: out, w: nw, h: nh };
  }

  function replaceImage(ctx, ref, oldObj, r) {
    var P = PDFLib;
    var dict = ctx.obj({
      Type: "XObject", Subtype: "Image", Width: r.w, Height: r.h,
      ColorSpace: "DeviceRGB", BitsPerComponent: 8, Filter: "DCTDecode", Length: r.bytes.length
    });
    var smask = oldObj.dict.get(P.PDFName.of("SMask"));
    if (smask) dict.set(P.PDFName.of("SMask"), smask);
    ctx.assign(ref, P.PDFRawStream.of(dict, r.bytes));
  }

  async function compressKeep(bytes, level, onProgress, signal) {
    var P = PDFLib, p = LEVELS.keep[level];
    onProgress({ stage: "Reading the PDF", done: 0, total: 1 });
    await yieldToUi();
    var doc;
    try { doc = await P.PDFDocument.load(bytes, { updateMetadata: false, throwOnInvalidObject: false }); }
    catch (e) {
      if (/encrypt/i.test(String(e && e.message))) throw new Error("This PDF is password-protected. Remove the password first, then try again.");
      throw new Error("This PDF could not be read in \"keep text\" mode. Try the \"Smallest size\" option instead.");
    }
    var ctx = doc.context, pages = doc.getPageCount();
    var images = ctx.enumerateIndirectObjects().filter(function (e) {
      var o = e[1];
      return o instanceof P.PDFRawStream && nm(o.dict.get(P.PDFName.of("Subtype"))) === "Image";
    });

    var shrunk = 0, i;
    for (i = 0; i < images.length; i++) {
      abortCheck(signal);
      onProgress({ stage: "Compressing images", done: i, total: images.length });
      await yieldToUi();
      try {
        var r = await recompressImage(ctx, images[i][1], p);
        if (r) { replaceImage(ctx, images[i][0], images[i][1], r); shrunk++; }
      } catch (e) { /* leave this image untouched */ }
    }
    abortCheck(signal);
    onProgress({ stage: "Saving", done: images.length, total: images.length });
    await yieldToUi();
    var out = await doc.save({ useObjectStreams: true });
    return { bytes: out, pages: pages, images: images.length, imagesShrunk: shrunk };
  }

  // ---------- flatten mode: render each page to a JPEG ----------
  var pdfjsPromise = null;
  function loadPdfJs() {
    if (!pdfjsPromise) {
      pdfjsPromise = import(new URL("../vendor/pdf.min.mjs", SCRIPT_URL).href).then(function (m) {
        m.GlobalWorkerOptions.workerSrc = new URL("../vendor/pdf.worker.min.mjs", SCRIPT_URL).href;
        return m;
      });
    }
    return pdfjsPromise;
  }

  async function compressFlatten(bytes, level, onProgress, signal) {
    var P = PDFLib, p = LEVELS.flatten[level];
    onProgress({ stage: "Getting ready", done: 0, total: 1 });
    await yieldToUi();
    var pdfjs;
    try { pdfjs = await loadPdfJs(); }
    catch (e) { throw new Error("This browser is too old for the \"Smallest size\" option. Please update it, or use \"Keep text selectable\"."); }

    var task = pdfjs.getDocument({ data: bytes.slice(), isEvalSupported: false });
    var pdf;
    try { pdf = await task.promise; }
    catch (e) {
      if (e && e.name === "PasswordException") throw new Error("This PDF is password-protected. Remove the password first, then try again.");
      throw new Error("This PDF could not be read.");
    }
    var total = pdf.numPages, out = await P.PDFDocument.create();
    var k = p.dpi / 72, n;
    try {
      for (n = 1; n <= total; n++) {
        abortCheck(signal);
        onProgress({ stage: "Compressing pages", done: n - 1, total: total });
        await yieldToUi();
        var page = await pdf.getPage(n);
        var base = page.getViewport({ scale: 1 });
        var scale = k, maxSide = 6000;
        if (base.width * scale > maxSide || base.height * scale > maxSide) scale = Math.min(maxSide / base.width, maxSide / base.height);
        var vp = page.getViewport({ scale: scale });
        var cw = Math.max(1, Math.ceil(vp.width)), ch = Math.max(1, Math.ceil(vp.height));
        var canvas = document.createElement("canvas");
        canvas.width = cw; canvas.height = ch;
        var c2 = canvas.getContext("2d");
        c2.fillStyle = "#ffffff"; c2.fillRect(0, 0, cw, ch);
        await page.render({ canvasContext: c2, viewport: vp }).promise;
        var jpg = await blobBytes(await canvasToJpeg(canvas, p.q));
        var img = await out.embedJpg(jpg);
        var pg = out.addPage([base.width, base.height]);
        pg.drawImage(img, { x: 0, y: 0, width: base.width, height: base.height });
        canvas.width = canvas.height = 0;
        page.cleanup();
      }
    } finally {
      try { await pdf.destroy(); } catch (e) {}
    }
    abortCheck(signal);
    onProgress({ stage: "Saving", done: total, total: total });
    await yieldToUi();
    var saved = await out.save({ useObjectStreams: true });
    return { bytes: saved, pages: total, images: total, imagesShrunk: total };
  }

  // ---------- public API ----------
  async function compress(buffer, opts, onProgress, signal) {
    onProgress = onProgress || function () {};
    var bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    var head = String.fromCharCode.apply(null, bytes.subarray(0, 5));
    if (head.indexOf("%PDF") !== 0) throw new Error("That file does not look like a PDF.");
    var mode = opts && opts.mode === "flatten" ? "flatten" : "keep";
    var level = opts && LEVELS[mode][opts.level] ? opts.level : "balanced";

    var res = mode === "flatten"
      ? await compressFlatten(bytes, level, onProgress, signal)
      : await compressKeep(bytes, level, onProgress, signal);

    var smaller = res.bytes.length < bytes.length;
    return {
      bytes: smaller ? res.bytes : bytes,
      smaller: smaller,
      stats: {
        mode: mode, level: level,
        originalSize: bytes.length,
        newSize: smaller ? res.bytes.length : bytes.length,
        triedSize: res.bytes.length,
        pages: res.pages, images: res.images, imagesShrunk: res.imagesShrunk
      }
    };
  }

  window.SqueezeCore = { compress: compress, LEVELS: LEVELS };
})();
