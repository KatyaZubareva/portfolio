/* =========================================================
   BACKGROUND VIDEOS — shared by the main page and project pages

   Usage on a page (path relative to that page):
     <script src="media.js" defer></script>

   Videos are written as <video data-src="…" poster="…">, so
   nothing is downloaded until the video is about to scroll
   into view. Off-screen videos pause to save data and battery.

   iOS blocks autoplay in Low Power Mode (even for muted
   videos) and draws its own play button over the video.
   This script hides that button, so the poster frame shows
   instead, and starts the videos as soon as the visitor taps
   anywhere or comes back to the tab.
========================================================= */

(() => {

  const videos =
    [...document.querySelectorAll("video[autoplay]")];

  if (!videos.length) {
    return;
  }

  // Hide the native iOS start-playback button.
  const style =
    document.createElement("style");

  style.textContent = `
    video::-webkit-media-controls,
    video::-webkit-media-controls-start-playback-button,
    video::-webkit-media-controls-overlay-play-button {
      display: none !important;
      -webkit-appearance: none;
    }
  `;

  document.head.appendChild(style);


  const visible =
    new Set();

  function load(video) {

    if (video.dataset.src && !video.getAttribute("src")) {
      video.src = video.dataset.src;
    }

  }

  function play(video) {

    if (!video.paused || !video.getAttribute("src")) {
      return;
    }

    video.muted = true;

    const attempt =
      video.play();

    if (attempt) {
      attempt.catch(() => {});
    }

  }

  function playVisible() {
    visible.forEach(play);
  }


  if ("IntersectionObserver" in window) {

    const observer =
      new IntersectionObserver(entries => {

        entries.forEach(entry => {

          const video =
            entry.target;

          if (entry.isIntersecting) {
            visible.add(video);
            load(video);
            play(video);
          } else {
            visible.delete(video);
            video.pause();
          }

        });

      }, {
        // Start loading a little before the video appears.
        rootMargin: "300px 0px"
      });

    videos.forEach(video => observer.observe(video));

  } else {

    videos.forEach(video => {
      load(video);
      visible.add(video);
    });

    playVisible();

  }

  // A tap counts as a user gesture, which lifts the
  // Low Power Mode restriction.
  ["touchend", "pointerup", "click", "keydown"].forEach(type => {
    window.addEventListener(type, playVisible, { passive: true });
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      playVisible();
    }
  });

})();
