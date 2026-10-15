/* =========================================================
   PROJECT DOCK — shared by all project pages

   Usage on a page (paths relative to that page):
     <link rel="stylesheet" href="../dock.css">
     <script src="../dock.js" defer></script>

   Links and icons are resolved against the folder this script
   lives in (the site root), so the dock works on any host,
   including a GitHub Pages sub-path like /portfolio/.

   To add a project to the dock, add it to DOCK_PROJECTS.
========================================================= */

(() => {

  const DOCK_PROJECTS = [
    {
      name: "Medixy",
      href: "pages/medixy.html",
      icon: "assets/Medixy_icon.webp"
    },
    {
      name: "QuickFront",
      href: "pages/quickfront.html",
      icon: "assets/QuickFront_icon.webp"
    },
    {
      name: "EchoBlade",
      href: "pages/echo-blade.html",
      icon: "assets/EchoBlade_icon.webp"
    },
    {
      name: "Shunli",
      href: "pages/shunli.html",
      icon: "assets/Shunli_icon.webp"
    }
  ];


  /* =========================================================
     RENDER
  ========================================================= */

  const script =
    document.currentScript ||
    document.querySelector('script[src*="dock.js"]');

  const siteRoot =
    new URL("./", script ? script.src : window.location.href);

  const resolve =
    path => new URL(path, siteRoot).href;

  // Bump when an icon file is replaced under the same name,
  // so browsers fetch the new image instead of a cached one.
  const ICON_VERSION = 6;

  function dockItem({ name, href, icon }, extraClass = "") {

    const url =
      resolve(href);

    const current =
      new URL(url).pathname === window.location.pathname;

    return `
      <a
        class="dock-item ${extraClass} ${current ? "current" : ""}"
        href="${url}"
        aria-label="${name}"
        ${current ? 'aria-current="page"' : ""}
      >
        <img src="${resolve(icon)}?v=${ICON_VERSION}" alt="" draggable="false">
        <span class="dock-tooltip">${name}</span>
      </a>
    `;
  }

  const dock =
    document.createElement("nav");

  dock.className = "project-dock";
  dock.setAttribute("aria-label", "Projects navigation");

  dock.innerHTML = `
    ${dockItem(
      {
        name: "Home",
        href: "index.html",
        icon: "assets/Home_icon.webp"
      },
      "dock-home"
    )}
    <span class="dock-separator" aria-hidden="true"></span>
    ${DOCK_PROJECTS.map(project => dockItem(project)).join("")}
  `;

  document.body.appendChild(dock);


  /* =========================================================
     MAGNIFICATION

     Each icon grows depending on how close the cursor is
     to its center (cosine falloff, like the macOS Dock).
  ========================================================= */

  const canHover =
    window.matchMedia("(hover: hover) and (pointer: fine)");

  const reducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)");

  const items =
    [...dock.querySelectorAll(".dock-item")];

  // Distance (px) at which an icon stops being magnified.
  const RANGE = 170;

  let pointerX = null;
  let frame = null;

  function magnify() {

    frame = null;

    items.forEach(item => {

      if (pointerX === null) {
        item.style.setProperty("--s", 0);
        return;
      }

      const rect =
        item.getBoundingClientRect();

      const distance =
        Math.abs(pointerX - (rect.left + rect.width / 2));

      const s =
        distance >= RANGE
          ? 0
          : (Math.cos((distance / RANGE) * Math.PI) + 1) / 2;

      item.style.setProperty("--s", s.toFixed(3));
    });
  }

  function requestMagnify() {
    if (!frame) {
      frame = requestAnimationFrame(magnify);
    }
  }

  dock.addEventListener("mousemove", event => {

    if (!canHover.matches || reducedMotion.matches) {
      return;
    }

    pointerX = event.clientX;

    requestMagnify();
  });

  dock.addEventListener("mouseleave", () => {

    pointerX = null;

    requestMagnify();
  });


  /* =========================================================
     TOUCH MAGNIFICATION

     On phones and tablets: press an icon and it grows like on
     desktop; slide along the dock to scrub through the icons;
     lift the finger to open the icon under it. Icons scale with
     a transform (see .touching in dock.css), so the dock never
     gets wider than the screen.
  ========================================================= */

  // Shorter falloff than with a mouse: icons sit closer together.
  const TOUCH_RANGE = 80;

  // Keep the magnified state on screen briefly before leaving.
  const OPEN_DELAY = 220;

  let touchId = null;
  let opening = false;

  function itemAt(x) {
    return items.find(item => {
      const rect = item.getBoundingClientRect();
      return x >= rect.left && x <= rect.right;
    });
  }

  function magnifyTouch() {

    frame = null;

    items.forEach(item => {

      if (pointerX === null) {
        item.style.setProperty("--s", 0);
        return;
      }

      const rect =
        item.getBoundingClientRect();

      const distance =
        Math.abs(pointerX - (rect.left + rect.width / 2));

      const s =
        distance >= TOUCH_RANGE
          ? 0
          : (Math.cos((distance / TOUCH_RANGE) * Math.PI) + 1) / 2;

      item.style.setProperty("--s", s.toFixed(3));
    });
  }

  function releaseTouch() {
    touchId = null;
    pointerX = null;
    dock.classList.remove("touching");
    items.forEach(item => item.style.setProperty("--s", 0));
  }

  dock.addEventListener("pointerdown", event => {

    if (event.pointerType === "mouse" || reducedMotion.matches || opening) {
      return;
    }

    touchId = event.pointerId;
    dock.classList.add("touching");

    // Keep receiving moves when the finger slides off an icon.
    // Capture can fail (e.g. the pointer is already gone); the
    // dock still works without it.
    try {
      dock.setPointerCapture(touchId);
    } catch (error) {}

    pointerX = event.clientX;
    magnifyTouch();
  });

  dock.addEventListener("pointermove", event => {

    if (event.pointerId !== touchId) {
      return;
    }

    pointerX = event.clientX;

    if (!frame) {
      frame = requestAnimationFrame(magnifyTouch);
    }
  });

  dock.addEventListener("pointerup", event => {

    if (event.pointerId !== touchId) {
      return;
    }

    const rect = dock.getBoundingClientRect();
    const target = itemAt(event.clientX);

    // Finger lifted away from the dock: just cancel.
    if (!target || event.clientY < rect.top - 80 || event.clientY > rect.bottom + 40) {
      releaseTouch();
      return;
    }

    opening = true;
    touchId = null;

    setTimeout(() => {
      window.location.href = target.href;
    }, OPEN_DELAY);
  });

  dock.addEventListener("pointercancel", releaseTouch);

  // The page navigates from pointerup; ignore the click that follows a touch.
  dock.addEventListener("click", event => {
    if (dock.classList.contains("touching") || opening) {
      event.preventDefault();
    }
  });

  // Coming back with the browser's Back button restores the page from
  // cache, still magnified; reset it.
  window.addEventListener("pageshow", () => {
    opening = false;
    releaseTouch();
  });

})();
