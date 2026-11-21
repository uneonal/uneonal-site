// Animated lesson player.
// A lesson animation is a list of scenes: { dur: seconds, cap: "caption text", build: function (s) { ... } }.
// build() lays out elements on a 960x540 stage and schedules their animations with the helpers on `s`.
// All animations are driven by one clock, so play, pause and scrubbing always stay in sync.
(function () {
  "use strict";

  var W = 960, H = 540;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function fmt(s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2); }
  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  // ---------- scene helper API ----------
  function makeApi(stage) {
    var anims = [], ticks = [];
    var api = { W: W, H: H };

    api.node = function (o) {
      var d = document.createElement("div");
      d.className = "an" + (o.cls ? " " + o.cls : "");
      d.style.left = (o.x || 0) + "px";
      d.style.top = (o.y || 0) + "px";
      if (o.w != null) d.style.width = o.w + "px";
      if (o.h != null) d.style.height = o.h + "px";
      if (o.text != null) d.textContent = o.text;
      if (o.style) for (var k in o.style) d.style[k] = o.style[k];
      if (!o.show) d.style.opacity = "0";
      stage.appendChild(d);
      return d;
    };

    api.anim = function (e, frames, o) {
      o = o || {};
      var a = e.animate(frames, {
        duration: (o.dur || 0.5) * 1000,
        delay: (o.at || 0) * 1000,
        easing: o.ease || "cubic-bezier(.2,.7,.2,1)",
        fill: o.fill || "both"
      });
      a.pause();
      anims.push(a);
      return a;
    };

    api.appear = function (e, at, o) {
      o = o || {};
      var dy = o.dy == null ? 16 : o.dy;
      var sc = o.s == null ? 1 : o.s;
      return api.anim(e, [
        { opacity: 0, translate: "0px " + dy + "px", scale: String(sc) },
        { opacity: 1, translate: "0px 0px", scale: "1" }
      ], { at: at || 0, dur: o.dur || 0.5 });
    };

    api.fade = function (e, at, dur) {
      return api.anim(e, [{ opacity: 0 }, { opacity: 1 }], { at: at || 0, dur: dur || 0.5, ease: "ease-out" });
    };

    api.title = function (text, y, at, cls) {
      var e = api.node({ x: 0, y: y, w: W, cls: "an-title " + (cls || ""), text: text });
      api.appear(e, at);
      return e;
    };
    api.sub = function (text, y, at, cls) {
      var e = api.node({ x: 60, y: y, w: W - 120, cls: "an-sub " + (cls || ""), text: text });
      api.appear(e, at);
      return e;
    };
    api.label = function (text, x, y, w, at, cls) {
      var e = api.node({ x: x, y: y, w: w, cls: "an-label " + (cls || ""), text: text });
      api.appear(e, at, { dy: 8 });
      return e;
    };
    api.chip = function (text, x, y, w, at, cls, h) {
      var e = api.node({ x: x, y: y, w: w, h: h || 56, cls: "an-chip " + (cls || ""), text: text });
      api.appear(e, at, { s: 0.9 });
      return e;
    };
    api.card = function (x, y, w, h, at, o) {
      o = o || {};
      var c = api.node({ x: x, y: y, w: w, h: h, cls: "an-card " + (o.cls || "") });
      if (o.icon) c.appendChild(el("div", "an-icon", o.icon));
      if (o.head) c.appendChild(el("div", "an-headline", o.head));
      if (o.body) c.appendChild(el("div", "an-body", o.body));
      if (at == null) c.style.opacity = "1"; else api.appear(c, at, o);
      return c;
    };
    api.dot = function (x, y, d, at, cls) {
      var e = api.node({ x: x, y: y, w: d, h: d, cls: "an-dot " + (cls || "") });
      if (at != null) api.appear(e, at, { s: 0.3, dy: 0, dur: 0.4 });
      return e;
    };
    api.line = function (x1, y1, x2, y2, o) {
      o = o || {};
      var dx = x2 - x1, dy = y2 - y1;
      var len = Math.sqrt(dx * dx + dy * dy);
      var ang = Math.atan2(dy, dx) * 180 / Math.PI;
      var e = api.node({
        x: x1, y: y1 - 1, w: len, h: 2, cls: "an-line " + (o.cls || ""), show: true,
        style: { transform: "rotate(" + ang + "deg)", transformOrigin: "0 50%" }
      });
      if (o.at != null) {
        api.anim(e, [{ scale: "0 1" }, { scale: "1 1" }], { at: o.at, dur: o.dur || 0.6 });
      }
      return e;
    };
    api.arrow = function (x1, y1, x2, y2, o) {
      o = o || {};
      api.line(x1, y1, x2, y2, o);
      var ang = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
      var h = api.node({
        x: x2 - 9, y: y2 - 8, w: 0, h: 0, cls: "an-head " + (o.cls || ""),
        style: { transform: "rotate(" + ang + "deg)", transformOrigin: "50% 50%" }
      });
      api.fade(h, (o.at || 0) + (o.dur || 0.6) * 0.85, 0.2);
    };
    api.img = function (src, x, y, w, h, at, cls) {
      var d = api.node({ x: x, y: y, w: w, h: h, cls: "an-img " + (cls || "") });
      var i = document.createElement("img");
      i.src = src; i.alt = ""; i.draggable = false;
      d.appendChild(i);
      api.appear(d, at);
      return d;
    };
    api.tick = function (fn) { ticks.push(fn); };
    api.type = function (e, text, at, dur, byWord) {
      e.style.opacity = "1";
      var words = byWord ? text.split(" ") : null;
      api.tick(function (t) {
        var p = clamp01((t - at) / dur);
        var out;
        if (byWord) {
          var n = Math.floor(p * words.length + 0.0001);
          out = words.slice(0, n).join(" ");
        } else {
          out = text.slice(0, Math.floor(p * text.length + 0.0001));
        }
        e.textContent = out + (p > 0 && p < 1 ? "▍" : "");
      });
    };

    api.cancel = function () { anims.forEach(function (a) { a.cancel(); }); anims.length = 0; ticks.length = 0; };
    api.apply = function (t) {
      var ms = t * 1000, i;
      for (i = 0; i < anims.length; i++) anims[i].currentTime = ms;
      for (i = 0; i < ticks.length; i++) ticks[i](t);
    };
    return api;
  }

  // ---------- player ----------
  function create(scenes, title) {
    var starts = [], total = 0;
    scenes.forEach(function (s) { starts.push(total); total += s.dur; });

    var wrap = el("div", "an-wrap");
    var root = el("div", "video video-an");
    wrap.appendChild(root);
    root.tabIndex = 0;
    root.setAttribute("role", "group");
    root.setAttribute("aria-label", "Animated lesson: " + title + ". Space plays or pauses. Arrow keys skip.");

    // ---- narration: the browser's built-in text-to-speech reads each scene's caption ----
    var synth = window.speechSynthesis;
    var canSpeak = !!(synth && window.SpeechSynthesisUtterance);
    var pending = false, utter = null, spoken = -1, voice = null, holdAt = 0;
    function readPref() { try { return localStorage.getItem("uneonal-narrate"); } catch (e) { return null; } }
    function writePref(v) { try { localStorage.setItem("uneonal-narrate", v); } catch (e) {} }
    var narrate = canSpeak && readPref() !== "off";

    function pickVoice() {
      if (!canSpeak || !synth.getVoices) return;
      var best = null, bestScore = -1;
      synth.getVoices().forEach(function (v) {
        var l = (v.lang || "").toLowerCase().replace("_", "-");
        if (l.indexOf("en") !== 0) return;
        var sc = l === "en-gb" ? 3 : l === "en-us" ? 2 : 1;
        if (/natural|neural|online|enhanced|premium/i.test(v.name)) sc += 4;
        else if (/google/i.test(v.name)) sc += 2;
        if (sc > bestScore) { best = v; bestScore = sc; }
      });
      voice = best;
    }
    if (canSpeak) {
      pickVoice();
      if (synth.addEventListener) synth.addEventListener("voiceschanged", pickVoice);
    }

    var stage = el("div", "an-stage");
    stage.setAttribute("aria-hidden", "true");
    var cap = el("div", "an-cap");
    cap.setAttribute("aria-hidden", "true");
    var capText = el("span");
    cap.appendChild(capText);

    var big = el("button", "an-big");
    big.type = "button";
    big.setAttribute("aria-label", "Play lesson animation");
    var bigIcon = el("span", "an-big-icon", "▶");
    big.appendChild(bigIcon);

    var bar = el("div", "an-controls");
    var btn = el("button", "an-btn", "▶");
    btn.type = "button";
    btn.setAttribute("aria-label", "Play");
    var range = el("input", "an-range");
    range.type = "range"; range.min = "0"; range.max = "1000"; range.step = "1"; range.value = "0";
    range.setAttribute("aria-label", "Seek");
    var time = el("span", "an-time", "0:00 / " + fmt(total));
    var vbtn = el("button", "an-btn an-voice", "🔊");
    vbtn.type = "button";
    bar.appendChild(btn); bar.appendChild(range);
    if (canSpeak) bar.appendChild(vbtn);
    bar.appendChild(time);

    root.appendChild(stage); root.appendChild(big); root.appendChild(bar);
    wrap.appendChild(cap); // captions sit under the video so they never cover the scene

    var t = 0, playing = false, ended = false, last = 0, raf = 0, cur = -1, api = null;

    function stopSpeech() {
      if (canSpeak) { synth.cancel(); if (synth.resume) synth.resume(); }
      pending = false; utter = null; spoken = -1; holdAt = 0;
    }
    function speak(i) {
      if (!canSpeak || !narrate) return;
      spoken = i;
      var text = scenes[i].say || scenes[i].cap;
      var u = new window.SpeechSynthesisUtterance(text);
      if (voice) { u.voice = voice; u.lang = voice.lang; } else { u.lang = "en-GB"; }
      // Aim to finish within the scene; the player waits if the voice runs a little long.
      var words = text.split(/\s+/).length;
      u.rate = Math.max(0.95, Math.min(1.2, (words / 2.7) / Math.max(3, scenes[i].dur - 0.8)));
      var done = function () { if (utter === u) pending = false; };
      u.onend = done; u.onerror = done;
      var busy = synth.speaking || synth.pending;
      utter = u; pending = true;
      if (busy) {
        synth.cancel();
        setTimeout(function () { if (utter === u && narrate) { if (synth.resume) synth.resume(); synth.speak(u); } }, 80);
      } else {
        synth.speak(u);
      }
    }

    function sceneAt(x) {
      for (var i = scenes.length - 1; i >= 0; i--) if (x >= starts[i]) return i;
      return 0;
    }
    function setCaption(text) {
      capText.textContent = text || "";
      cap.classList.remove("on");
      void cap.offsetWidth;
      cap.classList.add("on");
    }
    function load(i) {
      if (api) api.cancel();
      stage.innerHTML = "";
      api = makeApi(stage);
      cur = i;
      scenes[i].build(api);
      api.anim(stage, [{ opacity: 0 }, { opacity: 1 }], { at: 0, dur: 0.3, ease: "ease-out" });
      setCaption(scenes[i].cap);
    }
    function ui() {
      var showBig = !playing && (t <= 0.01 || ended);
      big.style.display = showBig ? "" : "none";
      bigIcon.textContent = ended ? "↻" : "▶";
      big.setAttribute("aria-label", ended ? "Replay lesson animation" : "Play lesson animation");
      btn.textContent = playing ? "❚❚" : (ended ? "↻" : "▶");
      btn.setAttribute("aria-label", playing ? "Pause" : (ended ? "Replay" : "Play"));
      time.textContent = fmt(t) + " / " + fmt(total);
      range.value = String(Math.round((t / total) * 1000));
      vbtn.textContent = narrate ? "🔊" : "🔇";
      vbtn.setAttribute("aria-label", narrate ? "Turn narration off" : "Turn narration on");
      vbtn.setAttribute("aria-pressed", narrate ? "true" : "false");
    }
    function seek(x) {
      t = Math.max(0, Math.min(total, x));
      var i = sceneAt(t >= total ? total - 0.001 : t);
      if (i !== cur) load(i);
      api.apply(Math.min(scenes[i].dur, t - starts[i]));
      ui();
    }
    function frame(ts) {
      if (!playing) return;
      var dt = (ts - last) / 1000;
      last = ts;
      t += Math.min(dt, 0.25);
      // If the voice is still talking when a scene ends, hold on the last frame until it finishes.
      if (narrate && pending && spoken === cur && cur >= 0) {
        var limit = starts[cur] + scenes[cur].dur - 0.05;
        if (t > limit) {
          t = limit;
          if (!holdAt) holdAt = ts; else if (ts - holdAt > 8000) pending = false; // safety: never get stuck
        } else { holdAt = 0; }
      } else { holdAt = 0; }
      if (t >= total) {
        playing = false; ended = true;
        stopSpeech();
        seek(total);
        return;
      }
      seek(t);
      if (narrate && spoken !== cur) speak(cur);
      raf = requestAnimationFrame(frame);
    }
    function play() {
      if (playing) return;
      if (ended || t >= total) { t = 0; ended = false; stopSpeech(); }
      playing = true;
      last = performance.now();
      if (narrate) {
        // Start speaking inside the click so browsers that require a user gesture allow it.
        if (canSpeak && synth.paused && utter && pending) synth.resume();
        else { var si = sceneAt(t); if (spoken !== si) speak(si); }
      }
      ui();
      raf = requestAnimationFrame(frame);
    }
    function pause() {
      if (!playing) return;
      playing = false;
      if (raf) cancelAnimationFrame(raf);
      if (narrate && canSpeak && synth.speaking) synth.pause();
      ui();
    }
    function toggle() { playing ? pause() : play(); }

    big.addEventListener("click", play);
    btn.addEventListener("click", toggle);
    stage.addEventListener("click", toggle);
    cap.addEventListener("click", toggle);
    vbtn.addEventListener("click", function (e) {
      e.stopPropagation();
      narrate = !narrate;
      writePref(narrate ? "on" : "off");
      stopSpeech(); // if narration is on and playing, the next frame starts the current scene's voice
      ui();
    });
    range.addEventListener("input", function () {
      ended = false;
      stopSpeech();
      seek((parseInt(range.value, 10) / 1000) * total);
    });
    root.addEventListener("keydown", function (e) {
      if (e.target === range || e.target === btn || e.target === big || e.target === vbtn) {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      }
      if (e.key === " " || e.key === "k") { e.preventDefault(); toggle(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); ended = false; stopSpeech(); seek(t + 5); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); ended = false; stopSpeech(); seek(t - 5); }
    });

    function fit() {
      var w = root.clientWidth;
      if (w > 0) stage.style.transform = "scale(" + (w / W) + ")";
    }
    if ("ResizeObserver" in window) new ResizeObserver(fit).observe(root);
    else window.addEventListener("resize", fit);

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) pause();
      }, { threshold: 0.15 }).observe(root);
    }
    document.addEventListener("visibilitychange", function () { if (document.hidden) pause(); });

    seek(0);
    fit();

    // Small hooks for testing.
    wrap._an = {
      seek: seek, total: total, scenes: scenes.length, play: play, pause: pause,
      state: function () { return { t: t, cur: cur, playing: playing, ended: ended, narrate: narrate, pending: pending, spoken: spoken, voice: voice && voice.name }; }
    };
    return wrap;
  }

  window.UneonalAnim = { create: create };
})();
