document.addEventListener("DOMContentLoaded", () => {

    const body = document.body;


    /* =========================================
       LOADER
    ========================================= */

    const loader = document.getElementById("pageLoader");
    const loaderNumber = document.getElementById("loaderNumber");
    const loaderProgress = document.getElementById("loaderProgress");
    const loaderStatus = document.getElementById("loaderStatus");

    const statuses = [
        "INITIALIZING VISUAL SYSTEM",
        "LOADING PROJECTS",
        "CALIBRATING INTERFACE",
        "CONNECTING DESIGN SYSTEM",
        "RENDERING EXPERIENCE",
        "SYSTEM READY"
    ];

    let loaderValue = 0;
    let pageLoaded = document.readyState === "complete";
    let loaderFinished = false;

    window.addEventListener("load", () => {
        pageLoaded = true;
    });


    function updateLoader() {

        if (loaderFinished) {
            return;
        }

        if (!pageLoaded) {

            loaderValue +=
                (92 - loaderValue) * 0.035;

        } else {

            loaderValue +=
                (100 - loaderValue) * 0.09;
        }

        if (loaderValue > 99.6 && pageLoaded) {
            loaderValue = 100;
        }

        const rounded =
            Math.floor(loaderValue);

        loaderNumber.textContent =
            String(rounded).padStart(2, "0");

        loaderProgress.style.width =
            `${rounded}%`;


        let statusIndex = 0;

        if (rounded > 18) {
            statusIndex = 1;
        }

        if (rounded > 35) {
            statusIndex = 2;
        }

        if (rounded > 52) {
            statusIndex = 3;
        }

        if (rounded > 72) {
            statusIndex = 4;
        }

        if (rounded >= 98) {
            statusIndex = 5;
        }

        loaderStatus.textContent =
            statuses[statusIndex];


        if (rounded >= 100) {

            loaderFinished = true;

            setTimeout(() => {

                loader.classList.add("loaded");

                body.classList.remove("is-loading");

                setTimeout(() => {
                    loader.remove();
                }, 1000);

            }, 350);

            return;
        }

        requestAnimationFrame(updateLoader);
    }

    requestAnimationFrame(updateLoader);


    /* =========================================
       CUSTOM CURSOR
    ========================================= */

    const cursor = document.querySelector(".cursor");
    const cursorLabel =
        document.querySelector(".cursor-label");

    const cursorGlow =
        document.querySelector(".cursor-glow");

    const hasFinePointer =
        window.matchMedia(
            "(pointer: fine)"
        ).matches;


    if (hasFinePointer && cursor) {

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        let currentX = mouseX;
        let currentY = mouseY;

        let glowX = mouseX;
        let glowY = mouseY;


        window.addEventListener(
            "pointermove",
            (event) => {

                mouseX = event.clientX;
                mouseY = event.clientY;

            },
            {
                passive: true
            }
        );


        function animateCursor() {

            currentX +=
                (mouseX - currentX) * .18;

            currentY +=
                (mouseY - currentY) * .18;

            glowX +=
                (mouseX - glowX) * .06;

            glowY +=
                (mouseY - glowY) * .06;


            cursor.style.left =
                `${currentX}px`;

            cursor.style.top =
                `${currentY}px`;


            if (cursorGlow) {

                cursorGlow.style.left =
                    `${glowX}px`;

                cursorGlow.style.top =
                    `${glowY}px`;
            }


            if (cursorLabel) {

                cursorLabel.style.left =
                    `${currentX}px`;

                cursorLabel.style.top =
                    `${currentY}px`;
            }


            requestAnimationFrame(
                animateCursor
            );
        }

        animateCursor();


        const cursorTargets =
            document.querySelectorAll(
                "a, button, .work-project, [data-cursor]"
            );


        cursorTargets.forEach((element) => {

            element.addEventListener(
                "pointerenter",
                () => {

                    body.classList.add(
                        "cursor-active"
                    );

                    const label =
                        element.dataset.cursor;

                    if (label && cursorLabel) {
                        cursorLabel.textContent =
                            label;
                    } else if (cursorLabel) {
                        cursorLabel.textContent =
                            "VIEW";
                    }

                }
            );


            element.addEventListener(
                "pointerleave",
                () => {

                    body.classList.remove(
                        "cursor-active"
                    );

                }
            );

        });

    }


    /* =========================================
       MAGNETIC ELEMENTS
    ========================================= */

    if (hasFinePointer) {

        const magneticElements =
            document.querySelectorAll(
                ".magnetic"
            );


        magneticElements.forEach((element) => {

            element.addEventListener(
                "pointermove",
                (event) => {

                    const rect =
                        element.getBoundingClientRect();

                    const x =
                        event.clientX -
                        rect.left -
                        rect.width / 2;

                    const y =
                        event.clientY -
                        rect.top -
                        rect.height / 2;


                    element.style.setProperty(
                        "--mag-x",
                        `${x * .12}px`
                    );

                    element.style.setProperty(
                        "--mag-y",
                        `${y * .12}px`
                    );

                    element.style.transform =
                        "translate(var(--mag-x), var(--mag-y))";
                }
            );


            element.addEventListener(
                "pointerleave",
                () => {

                    element.style.transform =
                        "";

                    element.style.removeProperty(
                        "--mag-x"
                    );

                    element.style.removeProperty(
                        "--mag-y"
                    );

                }
            );

        });

    }


    /* =========================================
       MOBILE MENU
    ========================================= */

    const menuTrigger =
        document.getElementById(
            "menuTrigger"
        );

    const mobileMenu =
        document.getElementById(
            "mobileMenu"
        );

    const menuClose =
        document.getElementById(
            "menuClose"
        );


    function closeMenu() {

        if (!mobileMenu) {
            return;
        }

        mobileMenu.classList.remove(
            "active"
        );

        body.classList.remove(
            "menu-open"
        );
    }


    if (menuTrigger && mobileMenu) {

        menuTrigger.addEventListener(
            "click",
            () => {

                mobileMenu.classList.add(
                    "active"
                );

                body.classList.add(
                    "menu-open"
                );

            }
        );

    }


    if (menuClose) {

        menuClose.addEventListener(
            "click",
            closeMenu
        );

    }


    document
        .querySelectorAll(".mobile-menu-links a")
        .forEach((link) => {

            link.addEventListener(
                "click",
                closeMenu
            );

        });


    /* =========================================
       REVEAL ON SCROLL
    ========================================= */

    const revealElements =
        document.querySelectorAll(
            ".reveal"
        );


    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (!entry.isIntersecting) {
                            return;
                        }

                        entry.target.classList.add(
                            "visible"
                        );

                        observer.unobserve(
                            entry.target
                        );

                    });

                },
                {
                    threshold: .12,
                    rootMargin: "0px 0px -80px 0px"
                }
            );


        revealElements.forEach((element) => {

            revealObserver.observe(
                element
            );

        });

    } else {

        revealElements.forEach((element) => {

            element.classList.add(
                "visible"
            );

        });

    }


    /* =========================================
       PROJECT TILT
    ========================================= */

    if (
        hasFinePointer &&
        window.innerWidth > 900
    ) {

        const projects =
            document.querySelectorAll(
                ".tilt"
            );


        projects.forEach((project) => {

            project.addEventListener(
                "pointermove",
                (event) => {

                    const rect =
                        project.getBoundingClientRect();

                    const x =
                        (event.clientX -
                            rect.left) /
                        rect.width;

                    const y =
                        (event.clientY -
                            rect.top) /
                        rect.height;


                    const rotateY =
                        (x - .5) * 3;

                    const rotateX =
                        (.5 - y) * 3;


                    project.style.transform =
                        `perspective(1400px)
                         rotateX(${rotateX}deg)
                         rotateY(${rotateY}deg)`;
                }
            );


            project.addEventListener(
                "pointerleave",
                () => {

                    project.style.transform =
                        "";

                }
            );

        });

    }


    /* =========================================
       SMOOTH ANCHOR SCROLL
    ========================================= */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach((link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const targetId =
                        link.getAttribute("href");

                    if (
                        !targetId ||
                        targetId === "#"
                    ) {
                        return;
                    }

                    const target =
                        document.querySelector(
                            targetId
                        );

                    if (!target) {
                        return;
                    }

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        });


    /* =========================================
       SCROLL PROGRESS
    ========================================= */

    let ticking = false;


    function updateScrollEffects() {

        const scrollTop =
            window.scrollY;

        const documentHeight =
            document.documentElement
                .scrollHeight -
            window.innerHeight;

        const progress =
            documentHeight > 0
                ? scrollTop / documentHeight
                : 0;

            /* =========================================
       FLOATING HEADER
    ========================================= */

    const header =
        document.querySelector(".header");

    if (header) {

        header.classList.toggle(
            "scrolled",
            scrollTop > 40
        );

    }


    ticking = false;
}


    


    window.addEventListener(
        "scroll",
        () => {

            if (!ticking) {

                window.requestAnimationFrame(
                    updateScrollEffects
                );

                ticking = true;
            }

        },
        {
            passive: true
        }
    );


    /* =========================================
       TRACKING VALUES
    ========================================= */

    const trackingValues =
        document.querySelectorAll(
            ".tracking-panel strong"
        );


    if (trackingValues.length) {

        setInterval(() => {

            trackingValues.forEach(
                (value) => {

                    const base =
                        parseFloat(
                            value.textContent
                        ) || .5;

                    const next =
                        Math.max(
                            0,
                            Math.min(
                                1,
                                base +
                                (Math.random() - .5) * .04
                            )
                        );

                    value.textContent =
                        next.toFixed(2);

                }
            );

        }, 1400);

    }


    /* =========================================
       CONTACT BUTTON MICRO INTERACTION
    ========================================= */

    const contactButton =
        document.querySelector(
            ".contact-button"
        );


    if (
        contactButton &&
        hasFinePointer
    ) {

        contactButton.addEventListener(
            "pointermove",
            (event) => {

                const rect =
                    contactButton.getBoundingClientRect();

                const x =
                    event.clientX -
                    rect.left -
                    rect.width / 2;

                const y =
                    event.clientY -
                    rect.top -
                    rect.height / 2;


                contactButton.style.transform =
                    `translate(
                        ${x * .08}px,
                        ${y * .08}px
                    ) scale(1.08)`;
            }
        );


        contactButton.addEventListener(
            "pointerleave",
            () => {

                contactButton.style.transform =
                    "";

            }
        );

    }


    /* =========================================
       RESIZE
    ========================================= */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth > 1000 &&
                mobileMenu
            ) {
                closeMenu();
            }

        }
    );

});