// Video box: embeds an unlisted YouTube video when an ID is given,
// otherwise draws an animated "video coming soon" placeholder.
(function () {
  "use strict";

  var YT_ID = /^[A-Za-z0-9_-]{11}$/;

  function make(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function embed(id, title) {
    var box = make("div", "video");
    var f = document.createElement("iframe");
    f.src = "https://www.youtube-nocookie.com/embed/" + id + "?rel=0";
    f.title = title;
    f.loading = "lazy";
    f.allow = "accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen";
    f.allowFullscreen = true;
    f.referrerPolicy = "strict-origin-when-cross-origin";
    box.appendChild(f);
    return box;
  }

  function placeholder(title) {
    var box = make("div", "video video-ph");
    box.setAttribute("role", "img");
    box.setAttribute("aria-label", "Video coming soon: " + title);

    var canvas = make("canvas", "video-canvas");
    canvas.setAttribute("aria-hidden", "true");
    box.appendChild(canvas);

    var center = make("div", "video-center");
    var play = make("div", "video-play");
    play.setAttribute("aria-hidden", "true");
    play.appendChild(make("span", "video-tri"));
    center.appendChild(play);
    center.appendChild(make("div", "video-label", "Video coming soon"));
    box.appendChild(center);

    var bar = make("div", "video-bar");
    bar.setAttribute("aria-hidden", "true");
    bar.appendChild(make("span", "video-time", "0:00"));
    var track = make("span", "video-track");
    track.appendChild(make("span", "video-fill"));
    bar.appendChild(track);
    bar.appendChild(make("span", "video-time", "--:--"));
    box.appendChild(bar);

    animate(canvas, box);
    return box;
  }

  // Drifting nodes joined by faint lines, like a neural network.
  function animate(canvas, box) {
    var ctx = canvas.getContext("2d");
    if (!ctx) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var w = 0, h = 0, dpr = 1, nodes = [], raf = 0, running = false, t0 = performance.now();

    function seed() {
      var count = Math.max(18, Math.min(46, Math.round((w * h) / 14000)));
      nodes = [];
      for (var i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
          r: 1 + Math.random() * 1.8, hue: Math.random() < 0.5 ? 190 : 245
        });
      }
    }
    function resize() {
      var rect = box.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, rect.width); h = Math.max(1, rect.height);
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      draw(performance.now());
    }
    function draw(now) {
      var t = (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);

      // soft moving glows
      var g1 = ctx.createRadialGradient(w * (0.3 + 0.1 * Math.sin(t * 0.5)), h * 0.4, 0, w * 0.3, h * 0.4, w * 0.55);
      g1.addColorStop(0, "rgba(34,211,238,0.22)"); g1.addColorStop(1, "rgba(34,211,238,0)");
      ctx.fillStyle = g1; ctx.fillRect(0, 0, w, h);
      var g2 = ctx.createRadialGradient(w * (0.72 + 0.08 * Math.cos(t * 0.4)), h * 0.62, 0, w * 0.72, h * 0.62, w * 0.5);
      g2.addColorStop(0, "rgba(139,140,248,0.22)"); g2.addColorStop(1, "rgba(139,140,248,0)");
      ctx.fillStyle = g2; ctx.fillRect(0, 0, w, h);

      var link = Math.min(150, w * 0.22), i, j, a, b, dx, dy, d;
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        for (j = i + 1; j < nodes.length; j++) {
          b = nodes[j]; dx = a.x - b.x; dy = a.y - b.y; d = Math.sqrt(dx * dx + dy * dy);
          if (d < link) {
            ctx.strokeStyle = "rgba(120,190,255," + (0.22 * (1 - d / link)).toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        ctx.fillStyle = "hsla(" + a.hue + ",90%,70%,0.9)";
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
      }
    }
    function step(now) {
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      draw(now);
      raf = running ? requestAnimationFrame(step) : 0;
    }
    function start() { if (reduce || running) return; running = true; raf = requestAnimationFrame(step); }
    function stop() { running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }

    if ("ResizeObserver" in window) new ResizeObserver(resize).observe(box);
    else window.addEventListener("resize", resize);
    resize();

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries[0].isIntersecting ? start() : stop();
      }).observe(box);
    } else { start(); }
  }

  window.UneonalVideo = {
    // Priority: a YouTube video if an ID is set, then an animated lesson if one exists,
    // otherwise the "coming soon" placeholder.
    create: function (videoId, title, scenes) {
      if (videoId && YT_ID.test(videoId)) return embed(videoId, title);
      if (scenes && scenes.length && window.UneonalAnim) return window.UneonalAnim.create(scenes, title);
      return placeholder(title);
    }
  };
})();
