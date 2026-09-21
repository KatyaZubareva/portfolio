const photo = document.querySelector(".photo-inner");

if (photo && window.matchMedia("(pointer: fine)").matches) {
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    window.addEventListener("mousemove", (event) => {
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;

        targetX = x * 4;
        targetY = y * 4;
    });

    function animatePhoto() {
        currentX += (targetX - currentX) * 0.045;
        currentY += (targetY - currentY) * 0.045;

        photo.style.transform =
            `translate3d(${currentX}px, ${currentY}px, 0)`;

        requestAnimationFrame(animatePhoto);
    }

    animatePhoto();
}
