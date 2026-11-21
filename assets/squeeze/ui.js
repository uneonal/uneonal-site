// Squeeze: page interface. All processing happens locally in the browser.
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var drop = $("drop"), fileInput = $("file"), dropTitle = $("dropTitle"), dropSub = $("dropSub");
  var goBtn = $("go"), cancelBtn = $("cancel"), prog = $("prog"), bar = $("bar"), statusEl = $("status");
  var errEl = $("err"), result = $("result");

  var MAX_BYTES = 500 * 1024 * 1024, WARN_BYTES = 150 * 1024 * 1024;
  var file = null, running = false, controller = null, downloadUrl = null;

  var year = $("year"); if (year) year.textContent = new Date().getFullYear();

  function fmtSize(n) {
    if (n < 1024) return n + " B";
    if (n < 1024 * 1024) return (n / 1024).toFixed(n < 10240 ? 1 : 0) + " KB";
    if (n < 1024 * 1024 * 1024) return (n / 1024 / 1024).toFixed(n < 10 * 1024 * 1024 ? 2 : 1) + " MB";
    return (n / 1024 / 1024 / 1024).toFixed(2) + " GB";
  }
  function radio(name) { var r = document.querySelector('input[name="' + name + '"]:checked'); return r ? r.value : null; }

  function showError(msg) { errEl.textContent = msg; errEl.hidden = !msg; }
  function clearResult() {
    result.hidden = true;
    if (downloadUrl) { URL.revokeObjectURL(downloadUrl); downloadUrl = null; }
  }
  function setBusy(b) {
    running = b;
    goBtn.disabled = b || !file;
    cancelBtn.hidden = !b;
    prog.hidden = !b;
    fileInput.disabled = b;
    Array.prototype.forEach.call(document.querySelectorAll(".sq-opts input"), function (i) { i.disabled = b; });
    drop.classList.toggle("is-busy", b);
  }

  function setFile(f) {
    showError("");
    clearResult();
    if (!f) return;
    var isPdf = f.type === "application/pdf" || /\.pdf$/i.test(f.name);
    if (!isPdf) { file = null; goBtn.disabled = true; showError("Please choose a PDF file."); return; }
    if (f.size > MAX_BYTES) { file = null; goBtn.disabled = true; showError("That file is larger than 500 MB, which is too big to compress in a browser."); return; }
    file = f;
    drop.classList.add("has-file");
    dropTitle.textContent = f.name;
    dropSub.textContent = fmtSize(f.size) + (f.size > WARN_BYTES ? " · large file, this may take a while" : "") + " · click to choose a different file";
    goBtn.disabled = false;
  }

  fileInput.addEventListener("change", function () { setFile(fileInput.files && fileInput.files[0]); });

  ["dragenter", "dragover"].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); if (!running) drop.classList.add("is-over"); });
  });
  ["dragleave", "drop"].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove("is-over"); });
  });
  drop.addEventListener("drop", function (e) {
    if (running) return;
    var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) setFile(f);
  });

  cancelBtn.addEventListener("click", function () { if (controller) controller.abort(); });

  goBtn.addEventListener("click", async function () {
    if (!file || running) return;
    showError(""); clearResult();
    controller = new AbortController();
    setBusy(true);
    bar.value = 0; statusEl.textContent = "Reading your file…";
    try {
      var buffer = await file.arrayBuffer();
      var res = await window.SqueezeCore.compress(buffer, { mode: radio("mode"), level: radio("level") }, function (p) {
        var pct = p.total ? Math.round((p.done / p.total) * 100) : 0;
        bar.value = pct;
        statusEl.textContent = p.stage + (p.total > 1 ? " (" + Math.min(p.done + 1, p.total) + " of " + p.total + ")" : "") + "…";
      }, controller.signal);
      showResult(res);
    } catch (e) {
      if (e && e.name === "AbortError") showError("Cancelled. Nothing was changed.");
      else showError((e && e.message) || "Something went wrong while compressing this PDF.");
    } finally {
      setBusy(false);
      controller = null;
    }
  });

  function showResult(res) {
    var s = res.stats, mode = s.mode;
    $("rBefore").textContent = fmtSize(s.originalSize);
    $("mBefore").style.width = "100%";
    var dl = $("dl"), title = $("rTitle"), note = $("rNote");
    if (res.smaller) {
      var saved = Math.round(100 - (100 * s.newSize) / s.originalSize);
      title.textContent = "Saved " + saved + "%";
      $("rAfter").textContent = fmtSize(s.newSize);
      $("mAfter").style.width = Math.max(2, Math.round((100 * s.newSize) / s.originalSize)) + "%";
      var bits = [];
      if (mode === "flatten") bits.push("Each page was converted to an image, so the text can no longer be selected or searched.");
      else if (s.images === 0) bits.push("Text, links and forms were kept as they were.");
      else bits.push("Compressed " + s.imagesShrunk + " of " + s.images + " image" + (s.images === 1 ? "" : "s") + ". Text, links and forms were kept.");
      note.textContent = bits.join(" ");
      downloadUrl = URL.createObjectURL(new Blob([res.bytes], { type: "application/pdf" }));
      dl.href = downloadUrl;
      dl.download = file.name.replace(/\.pdf$/i, "") + "-squeezed.pdf";
      dl.hidden = false;
    } else {
      title.textContent = "This PDF is already compact";
      $("rAfter").textContent = fmtSize(s.originalSize);
      $("mAfter").style.width = "100%";
      note.textContent = mode === "keep"
        ? "We couldn't make it smaller without changing it. Try the Strong level, or the “Smallest size” method if you don't need selectable text."
        : "Turning the pages into images would not make this file smaller, so we left it as it is. It is probably mostly text.";
      dl.hidden = true;
    }
    result.hidden = false;
    result.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
})();
