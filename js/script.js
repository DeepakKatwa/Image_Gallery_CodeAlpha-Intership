/* =====================================================
   1. SELECT ELEMENTS
===================================================== */

const galleryItems = Array.from(
    document.querySelectorAll(".gallery-item")
);

const filterButtons = Array.from(
    document.querySelectorAll(".filter-btn")
);

const searchInput =
    document.getElementById("searchInput");

const clearSearch =
    document.getElementById("clearSearch");

const resultCount =
    document.getElementById("resultCount");

const noResults =
    document.getElementById("noResults");


/* =====================================================
   NAVIGATION
===================================================== */

const menuButton =
    document.getElementById("menuButton");

const navLinks =
    document.getElementById("navLinks");

const navigationLinks =
    document.querySelectorAll(".nav-link");


/* =====================================================
   LIGHTBOX
===================================================== */

const lightbox =
    document.getElementById("lightbox");

const lightboxImage =
    document.getElementById("lightboxImage");

const lightboxTitle =
    document.getElementById("lightboxTitle");

const lightboxCategory =
    document.getElementById("lightboxCategory");

const lightboxCounter =
    document.getElementById("lightboxCounter");

const lightboxClose =
    document.getElementById("lightboxClose");

const lightboxPrev =
    document.getElementById("lightboxPrev");

const lightboxNext =
    document.getElementById("lightboxNext");


/* =====================================================
   2. STATE
===================================================== */

let activeFilter = "all";

let searchTerm = "";

let visibleItems = [];

let currentIndex = 0;

/* =====================================================
   3. SAFETY CHECK
===================================================== */

if (!galleryItems.length) {
    console.warn(
        "Image Gallery: No gallery items found."
    );
}

/* =====================================================
   4. IMAGE LOADING
===================================================== */

const galleryImages =
    document.querySelectorAll(
        ".gallery-item img"
    );

galleryImages.forEach((image) => {

    const wrapper =
        image.closest(".image-wrapper");


    function markImageLoaded() {

        image.classList.add(
            "loaded"
        );


        if (wrapper) {

            wrapper.classList.add(
                "image-loaded"
            );

        }

    }


    if (image.complete) {

        markImageLoaded();

    } else {

        image.addEventListener(
            "load",
            markImageLoaded
        );


        image.addEventListener(
            "error",
            () => {

                if (wrapper) {

                    wrapper.classList.add(
                        "image-loaded"
                    );

                }

                image.classList.add(
                    "loaded"
                );

                console.warn(
                    "Image could not be loaded:",
                    image.src
                );

            }
        );

    }

});


/* =====================================================
   5. GET FILTERED ITEMS
===================================================== */

function getFilteredItems() {

    return galleryItems.filter(
        (item) => {

            const category =
                (
                    item.dataset.category || ""
                ).toLowerCase();


            const title =
                (
                    item.dataset.title || ""
                ).toLowerCase();


            const matchesCategory =
                activeFilter === "all" ||
                category === activeFilter;


            const matchesSearch =
                searchTerm === "" ||
                title.includes(searchTerm) ||
                category.includes(searchTerm);


            return (
                matchesCategory &&
                matchesSearch
            );

        }
    );

}


/* =====================================================
   6. RENDER GALLERY
===================================================== */

function renderGallery() {

    visibleItems =
        getFilteredItems();


    galleryItems.forEach(
        (item) => {

            const isVisible =
                visibleItems.includes(item);


            if (isVisible) {

                item.classList.remove(
                    "hidden"
                );

            } else {

                item.classList.add(
                    "hidden"
                );

            }

        }
    );


    updateResultCount();


    if (
        noResults
    ) {

        if (
            visibleItems.length === 0
        ) {

            noResults.classList.add(
                "visible"
            );

        } else {

            noResults.classList.remove(
                "visible"
            );

        }

    }

}


/* =====================================================
   7. RESULT COUNT
===================================================== */

function updateResultCount() {

    if (!resultCount) {
        return;
    }


    const visibleCount =
        visibleItems.length;

    const totalCount =
        galleryItems.length;


    if (
        activeFilter !== "all" ||
        searchTerm !== ""
    ) {

        resultCount.textContent =
            `Showing ${visibleCount} of ${totalCount} images`;

    } else {

        resultCount.textContent =
            `Showing ${totalCount} images`;

    }

}


/* =====================================================
   8. FILTER BUTTONS
===================================================== */

filterButtons.forEach(
    (button) => {

        button.addEventListener(
            "click",
            () => {

                activeFilter =
                    (
                        button.dataset.filter ||
                        "all"
                    ).toLowerCase();


                filterButtons.forEach(
                    (btn) => {

                        btn.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                renderGallery();

            }
        );

    }
);

/* =====================================================
   11. OPEN LIGHTBOX
===================================================== */

function openLightbox(item) {

    visibleItems =
        getFilteredItems();


    currentIndex =
        visibleItems.indexOf(item);


    if (
        currentIndex < 0
    ) {

        currentIndex = 0;

    }


    updateLightbox();


    if (!lightbox) {
        return;
    }


    lightbox.classList.add(
        "active"
    );


    lightbox.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "lightbox-open"
    );


    if (
        lightboxClose
    ) {

        lightboxClose.focus();

    }

}


/* =====================================================
   12. UPDATE LIGHTBOX
===================================================== */

function updateLightbox() {

    if (
        !visibleItems.length
    ) {

        return;

    }


    const currentItem =
        visibleItems[currentIndex];


    if (!currentItem) {

        return;

    }


    const image =
        currentItem.querySelector(
            "img"
        );


    if (!image) {

        return;

    }


    const title =
        currentItem.dataset.title ||
        image.alt ||
        "Untitled";


    const category =
        currentItem.dataset.category ||
        "";


    /*
       IMAGE
    */

    if (
        lightboxImage
    ) {

        lightboxImage.src =
            image.src;

        lightboxImage.alt =
            image.alt || title;


        /*
           Restart animation
        */

        lightboxImage.style.animation =
            "none";


        requestAnimationFrame(
            () => {

                lightboxImage.style.animation =
                    "";

            }
        );

    }


    /*
       TITLE
    */

    if (
        lightboxTitle
    ) {

        lightboxTitle.textContent =
            title;

    }


    /*
       CATEGORY
    */

    if (
        lightboxCategory
    ) {

        lightboxCategory.textContent =
            category;

    }


    /*
       COUNTER
    */

    if (
        lightboxCounter
    ) {

        lightboxCounter.textContent =
            `${currentIndex + 1} / ${visibleItems.length}`;

    }


    /*
       PRELOAD
    */

    preloadNavigationImages();

}

/* =====================================================
   13. CLOSE LIGHTBOX
===================================================== */

function closeLightbox() {

    if (!lightbox) {
        return;
    }


    lightbox.classList.remove(
        "active"
    );


    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "lightbox-open"
    );


    /*
       Clear image after animation
    */

    setTimeout(
        () => {

            if (
                !lightbox.classList.contains(
                    "active"
                )
            ) {

                if (
                    lightboxImage
                ) {

                    lightboxImage.src = "";

                }

            }

        },
        300
    );

}


/* =====================================================
   14. NEXT IMAGE
===================================================== */

function showNextImage() {

    if (
        visibleItems.length <= 1
    ) {

        return;

    }


    currentIndex =
        (
            currentIndex + 1
        ) %
        visibleItems.length;


    updateLightbox();

}

/* =====================================================
   15. PREVIOUS IMAGE
===================================================== */

function showPreviousImage() {

    if (
        visibleItems.length <= 1
    ) {

        return;

    }


    currentIndex =
        (
            currentIndex -
            1 +
            visibleItems.length
        ) %
        visibleItems.length;


    updateLightbox();

}

/* =====================================================
   16. GALLERY CLICK
===================================================== */

galleryItems.forEach(
    (item) => {

        item.addEventListener(
            "click",
            (event) => {

                const viewButton =
                    event.target.closest(
                        ".view-btn"
                    );


                if (
                    viewButton
                ) {

                    event.preventDefault();

                }


                openLightbox(item);

            }
        );

    }
);


/* =====================================================
   17. LIGHTBOX CLOSE BUTTON
===================================================== */

if (lightboxClose) {

    lightboxClose.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            event.stopPropagation();

            closeLightbox();

        }
    );

}


/* =====================================================
   18. LIGHTBOX NEXT
===================================================== */

if (lightboxNext) {

    lightboxNext.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            event.stopPropagation();

            showNextImage();

        }
    );

}


/* =====================================================
   19. LIGHTBOX PREVIOUS
===================================================== */

if (lightboxPrev) {

    lightboxPrev.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            event.stopPropagation();

            showPreviousImage();

        }
    );

}


/* =====================================================
   20. KEYBOARD NAVIGATION
===================================================== */

document.addEventListener(
    "keydown",
    (event) => {

        /*
           Lightbox navigation
        */

        if (
            lightbox &&
            lightbox.classList.contains(
                "active"
            )
        ) {

            if (
                event.key === "Escape"
            ) {

                event.preventDefault();

                closeLightbox();

                return;

            }


            if (
                event.key === "ArrowRight"
            ) {

                event.preventDefault();

                showNextImage();

                return;

            }


            if (
                event.key === "ArrowLeft"
            ) {

                event.preventDefault();

                showPreviousImage();

                return;

            }

        }


        /*
           Close mobile menu
        */

        if (
            event.key === "Escape" &&
            navLinks &&
            navLinks.classList.contains(
                "mobile-active"
            )
        ) {

            closeMobileMenu();

        }

    }
);


/* =====================================================
   21. MOUSE WHEEL
===================================================== */

if (lightbox) {

    lightbox.addEventListener(
        "wheel",
        (event) => {

            if (
                !lightbox.classList.contains(
                    "active"
                )
            ) {

                return;

            }


            event.preventDefault();


            /*
               Small scrolls should not
               change multiple images.
            */

            if (
                Math.abs(event.deltaY) < 10
            ) {

                return;

            }


            if (
                event.deltaY > 0
            ) {

                showNextImage();

            } else {

                showPreviousImage();

            }

        },
        {
            passive: false
        }
    );

}


/* =====================================================
   22. CLICK OUTSIDE LIGHTBOX
===================================================== */

if (lightbox) {

    lightbox.addEventListener(
        "click",
        (event) => {

            /*
               Only clicking the dark
               background closes it.
            */

            if (
                event.target === lightbox
            ) {

                closeLightbox();

            }

        }
    );

}


/* =====================================================
   23. MOBILE MENU
===================================================== */

function closeMobileMenu() {

    if (
        !navLinks
    ) {

        return;

    }


    navLinks.classList.remove(
        "mobile-active"
    );


    if (
        menuButton
    ) {

        menuButton.classList.remove(
            "active"
        );


        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

    }

}


if (
    menuButton &&
    navLinks
) {

    menuButton.addEventListener(
        "click",
        () => {

            const isOpen =
                navLinks.classList.toggle(
                    "mobile-active"
                );


            menuButton.classList.toggle(
                "active"
            );


            menuButton.setAttribute(
                "aria-expanded",
                String(isOpen)
            );

        }
    );

}


/* =====================================================
   24. MOBILE NAV LINKS
===================================================== */

navigationLinks.forEach(
    (link) => {

        link.addEventListener(
            "click",
            () => {

                closeMobileMenu();

            }
        );

    }
);


/* =====================================================
   25. ACTIVE NAVIGATION
===================================================== */

const sections =
    document.querySelectorAll(
        "section[id]"
    );


if (
    sections.length &&
    navigationLinks.length
) {

    const sectionObserver =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (
                            !entry.isIntersecting
                        ) {

                            return;

                        }


                        navigationLinks.forEach(
                            (link) => {

                                link.classList.remove(
                                    "active-link"
                                );


                                const target =
                                    link.getAttribute(
                                        "href"
                                    );


                                if (
                                    target ===
                                    `#${entry.target.id}`
                                ) {

                                    link.classList.add(
                                        "active-link"
                                    );

                                }

                            }
                        );

                    }
                );

            },
            {
                threshold: 0.3
            }
        );


    sections.forEach(
        (section) => {

            sectionObserver.observe(
                section
            );

        }
    );

}


/* =====================================================
   26. TOUCH / SWIPE
===================================================== */

let touchStartX = 0;

let touchStartY = 0;

let touchEndX = 0;

let touchEndY = 0;


if (lightbox) {

    lightbox.addEventListener(
        "touchstart",
        (event) => {

            if (
                !lightbox.classList.contains(
                    "active"
                )
            ) {

                return;

            }


            touchStartX =
                event.changedTouches[0].screenX;


            touchStartY =
                event.changedTouches[0].screenY;

        },
        {
            passive: true
        }
    );


    lightbox.addEventListener(
        "touchend",
        (event) => {

            if (
                !lightbox.classList.contains(
                    "active"
                )
            ) {

                return;

            }


            touchEndX =
                event.changedTouches[0].screenX;


            touchEndY =
                event.changedTouches[0].screenY;


            handleSwipe();

        },
        {
            passive: true
        }
    );

}


/* =====================================================
   27. HANDLE SWIPE
===================================================== */

function handleSwipe() {

    const horizontalDistance =
        touchEndX - touchStartX;


    const verticalDistance =
        touchEndY - touchStartY;


    /*
       Ignore mostly vertical swipes
    */

    if (
        Math.abs(horizontalDistance) <
        Math.abs(verticalDistance)
    ) {

        return;

    }


    /*
       Ignore small movements
    */

    if (
        Math.abs(horizontalDistance) < 50
    ) {

        return;

    }


    /*
       Swipe LEFT
       → Next
    */

    if (
        horizontalDistance < 0
    ) {

        showNextImage();

    }


    /*
       Swipe RIGHT
       → Previous
    */

    else {

        showPreviousImage();

    }

}


/* =====================================================
   28. PRELOAD IMAGE
===================================================== */

function preloadImage(item) {

    if (!item) {
        return;
    }


    const image =
        item.querySelector("img");


    if (!image) {
        return;
    }


    const preload =
        new Image();


    preload.src =
        image.src;

}


/* =====================================================
   29. PRELOAD NEXT / PREVIOUS
===================================================== */

function preloadNavigationImages() {

    if (
        visibleItems.length <= 1
    ) {

        return;

    }


    const nextIndex =
        (
            currentIndex + 1
        ) %
        visibleItems.length;


    const previousIndex =
        (
            currentIndex -
            1 +
            visibleItems.length
        ) %
        visibleItems.length;


    preloadImage(
        visibleItems[nextIndex]
    );


    preloadImage(
        visibleItems[previousIndex]
    );

}


/* =====================================================
   30. INITIALIZE
===================================================== */

renderGallery();


/* =====================================================
   31. INITIAL HOME LINK
===================================================== */

if (
    navigationLinks.length
) {

    navigationLinks.forEach(
        (link) => {

            link.classList.remove(
                "active-link"
            );

        }
    );


    const homeLink =
        document.querySelector(
            '.nav-link[href="#home"]'
        );


    if (
        homeLink
    ) {

        homeLink.classList.add(
            "active-link"
        );

    }

}


/* =====================================================
   32. CONSOLE MESSAGE
===================================================== */

console.log(
    "Image Gallery initialized successfully."
);