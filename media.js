/* =========================================================
   BACKGROUND VIDEOS — shared by the main page and project pages

   Usage on a page (path relative to that page):
     <script src="media.js" defer></script>

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


  function playAll() {

    videos.forEach(video => {

      if (!video.paused) {
        return;
      }

      video.muted = true;

      const attempt =
        video.play();

      if (attempt) {
        attempt.catch(() => {});
      }

    });

  }

  playAll();

  // A tap counts as a user gesture, which lifts the
  // Low Power Mode restriction.
  ["touchend", "pointerup", "click", "keydown"].forEach(type => {
    window.addEventListener(type, playAll, { passive: true });
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      playAll();
    }
  });

})();
