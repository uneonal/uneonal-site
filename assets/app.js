(function () {
  "use strict";

  var courses = window.COURSES || [];

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { node.appendChild(c); });
    return node;
  }
  function byId(id) { return courses.filter(function (c) { return c.id === id; })[0]; }
  function metaFor(c) {
    var tags = [];
    if (c.track) tags.push(el("span", { "class": "tag plain", text: c.track }));
    tags.push(el("span", { "class": "tag", text: c.level }));
    tags.push(el("span", { "class": "tag plain", text: c.lessons.length + " lessons" }));
    if (c.weeks) tags.push(el("span", { "class": "tag plain", text: c.weeks + " weeks" }));
    return el("div", { "class": "meta" }, tags);
  }
  function lessonUrl(c, n) { return "lesson.html?id=" + encodeURIComponent(c.id) + "&n=" + n; }

  // Expose helpers for the lesson page.
  window.UneonalUI = { el: el, byId: byId, metaFor: metaFor, lessonUrl: lessonUrl };

  // ---- Home page: course grid ----
  var grid = document.getElementById("course-grid");
  if (grid) {
    courses.forEach(function (c) {
      grid.appendChild(el("article", { "class": "card" }, [
        metaFor(c),
        el("h3", { text: c.title }),
        el("p", { text: c.summary }),
        el("a", { "class": "more", href: "course.html?id=" + encodeURIComponent(c.id), text: "View course →" })
      ]));
    });
  }

  // ---- Course detail page ----
  var detail = document.getElementById("course-detail");
  if (detail) {
    var id = new URLSearchParams(window.location.search).get("id");
    var course = byId(id);

    if (!course) {
      document.title = "Course not found – Uneonal Technologies";
      detail.innerHTML = "";
      detail.appendChild(el("h1", { text: "Course not found" }));
      detail.appendChild(el("p", { "class": "lead", text: "We couldn't find that course." }));
      detail.appendChild(el("a", { "class": "btn btn-primary", href: "index.html#training", text: "Browse all courses" }));
    } else {
      document.title = course.title + " – Uneonal Technologies";
      var desc = document.querySelector('meta[name="description"]');
      if (desc) desc.setAttribute("content", course.summary);

      var list = function (items) {
        var ul = el("ul");
        items.forEach(function (t) { ul.appendChild(el("li", { text: t })); });
        return ul;
      };
      var lessonList = el("ol", { "class": "lessons" });
      course.lessons.forEach(function (t, i) {
        lessonList.appendChild(el("li", {}, [el("a", { href: lessonUrl(course, i + 1), text: t })]));
      });

      var subject = encodeURIComponent("Interested in: " + course.title);
      detail.innerHTML = "";
      detail.appendChild(metaFor(course));
      detail.appendChild(el("h1", { text: course.title }));
      detail.appendChild(el("p", { "class": "lead", text: course.summary }));
      detail.appendChild(el("div", { "class": "cta" }, [
        el("a", { "class": "btn btn-primary", href: lessonUrl(course, 1), text: "Start course →" }),
        el("a", { "class": "btn btn-ghost", href: "mailto:hello@uneonal.com?subject=" + subject, text: "Register interest" })
      ]));

      var left = el("div", {}, [
        el("div", { "class": "panel" }, [
          el("h2", { text: "Lessons" }),
          lessonList
        ])
      ]);
      var right = el("div", {}, [
        el("div", { "class": "panel" }, [
          el("h2", { text: "What you'll be able to do" }),
          list(course.outcomes)
        ]),
        el("div", { "class": "panel" }, [
          el("h2", { text: "Before you start" }),
          el("p", { text: course.prerequisites, style: "margin:0" })
        ])
      ]);
      detail.appendChild(el("div", { "class": "detail-grid" }, [left, right]));
    }
  }

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
