/* =========================================================
   PROJECT DOCK — shared by all project pages

   Usage on a page:
     <link rel="stylesheet" href="/dock.css">
     <script src="/dock.js" defer></script>

   To add a project to the dock, add it to DOCK_PROJECTS.
========================================================= */

(() => {

  const DOCK_PROJECTS = [
    {
      name: "Medixy",
      href: "/pages/medixy.html",
      icon: "/assets/Medixy_icon.png"
    },
    {
      name: "Indor",
      href: "/pages/indor-design.html",
      icon: "/assets/04-Free.png"
    },
    {
      name: "Motion Sword",
      href: "/pages/motion-sword.html",
      icon: "/assets/03-Free.png"
    }
  ];


  /* =========================================================
     RENDER
  ========================================================= */

  const currentPath =
    window.location.pathname.replace(/\/$/, "");

  function dockItem({ name, href, icon }, extraClass = "") {

    const current =
      currentPath.endsWith(href);

    return `
      <a
        class="dock-item ${extraClass} ${current ? "current" : ""}"
        href="${href}"
        aria-label="${name}"
        ${current ? 'aria-current="page"' : ""}
      >
        <img src="${icon}" alt="" draggable="false">
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
        href: "/index.html",
        icon: "/assets/Home_icon.png"
      },
      "dock-home"
    )}
    ${DOCK_PROJECTS.map(project => dockItem(project)).join("")}
  `;

  document.body.appendChild(dock);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => dock.classList.add("ready"));
  });


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

})();
