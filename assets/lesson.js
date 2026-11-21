(function () {
  "use strict";

  var ui = window.UneonalUI;
  var el = ui.el;
  var root = document.getElementById("lesson-root");
  if (!root) return;

  var params = new URLSearchParams(window.location.search);
  var course = ui.byId(params.get("id"));
  var n = parseInt(params.get("n"), 10);

  function fail(msg) {
    document.title = "Lesson not found – Uneonal Technologies";
    root.innerHTML = "";
    root.appendChild(el("h1", { text: "Lesson not found" }));
    root.appendChild(el("p", { "class": "lead", text: msg }));
    root.appendChild(el("a", { "class": "btn btn-primary", href: "index.html#training", text: "Browse all courses" }));
  }

  if (!course) { fail("We couldn't find that course."); return; }
  if (!(n >= 1 && n <= course.lessons.length)) { n = 1; }

  // Only ever load a lesson file for a course id that exists in the catalog.
  var s = document.createElement("script");
  s.src = "assets/lessons/" + course.id + ".js";
  s.onload = function () {
    // Animated explainers are optional: render the lesson whether or not they exist.
    var a = document.createElement("script");
    a.src = "assets/anim/" + course.id + ".js";
    a.onload = render;
    a.onerror = render;
    document.head.appendChild(a);
  };
  s.onerror = function () { fail("The lessons for this course could not be loaded."); };
  document.head.appendChild(s);

  function renderBody(items) {
    var wrap = el("div", { "class": "prose" });
    items.forEach(function (item) {
      if (typeof item === "string") {
        wrap.appendChild(el("p", { text: item }));
      } else if (item.h) {
        wrap.appendChild(el("h2", { text: item.h }));
      } else if (item.ul) {
        var ul = el("ul");
        item.ul.forEach(function (t) { ul.appendChild(el("li", { text: t })); });
        wrap.appendChild(ul);
      } else if (item.code) {
        wrap.appendChild(el("pre", {}, [el("code", { text: item.code })]));
      } else if (item.note) {
        wrap.appendChild(el("div", { "class": "callout" }, [
          el("strong", { text: "Note" }),
          el("p", { text: item.note })
        ]));
      }
    });
    return wrap;
  }

  function render() {
    var lessons = (window.LESSONS || {})[course.id] || [];
    var lesson = lessons[n - 1];
    if (!lesson) { fail("That lesson isn't available yet."); return; }

    var total = course.lessons.length;
    document.title = lesson.title + " – " + course.title + " – Uneonal Technologies";
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", lesson.intro);

    root.innerHTML = "";

    // ---- main column ----
    var main = el("article", { "class": "lesson-main" });
    main.appendChild(el("p", { "class": "kicker", text: "Lesson " + n + " of " + total }));
    main.appendChild(el("h1", { text: lesson.title }));
    main.appendChild(el("p", { "class": "lead lesson-intro", text: lesson.intro }));
    var scenes = ((window.ANIMS || {})[course.id] || [])[n - 1];
    main.appendChild(window.UneonalVideo.create(lesson.video, lesson.title, scenes));
    main.appendChild(renderBody(lesson.body || []));

    if (lesson.takeaways && lesson.takeaways.length) {
      var ul = el("ul");
      lesson.takeaways.forEach(function (t) { ul.appendChild(el("li", { text: t })); });
      main.appendChild(el("div", { "class": "panel takeaways" }, [el("h2", { text: "Key takeaways" }), ul]));
    }

    if (course.track === "Cloud") {
      main.appendChild(el("p", { "class": "fineprint", text: "Cloud services, features and prices change often. Check the official documentation for the latest details." }));
    }

    var prev = n > 1 ? el("a", { "class": "btn btn-ghost", href: ui.lessonUrl(course, n - 1), text: "← Previous" }) : el("span");
    var next = n < total
      ? el("a", { "class": "btn btn-primary", href: ui.lessonUrl(course, n + 1), text: "Next lesson →" })
      : el("a", { "class": "btn btn-primary", href: "index.html#training", text: "Finish: all courses →" });
    main.appendChild(el("div", { "class": "pager" }, [prev, next]));

    // ---- sidebar ----
    var ol = el("ol", { "class": "side-list" });
    course.lessons.forEach(function (t, i) {
      var a = el("a", { href: ui.lessonUrl(course, i + 1), text: t });
      if (i + 1 === n) a.setAttribute("aria-current", "page");
      ol.appendChild(el("li", {}, [a]));
    });
    var side = el("aside", { "class": "lesson-side", "aria-label": "Course lessons" }, [
      el("a", { "class": "side-title", href: "course.html?id=" + encodeURIComponent(course.id), text: course.title }),
      ol
    ]);

    root.appendChild(el("div", { "class": "lesson-layout" }, [main, side]));
    window.scrollTo(0, 0);
  }
})();
