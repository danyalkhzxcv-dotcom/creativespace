
"use strict";

document.addEventListener("DOMContentLoaded", function () {
    // ==============================
    // 1. SELECT HTML ELEMENTS
    // ==============================

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const themeToggle = document.getElementById("themeToggle");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");
    const noProjects = document.getElementById("noProjects");
    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");
    const currentYear = document.getElementById("currentYear");

    const projectDialog = document.getElementById("projectDialog");
    const dialogTitle = document.getElementById("dialogTitle");
    const dialogDescription = document.getElementById("dialogDescription");
    const dialogClose = document.getElementById("dialogClose");
    const dialogOk = document.getElementById("dialogOk");

    // ==============================
    // 2. CURRENT YEAR
    // ==============================

    currentYear.textContent = new Date().getFullYear();

    // ==============================
    // 3. MOBILE NAVIGATION
    // ==============================

    menuToggle.addEventListener("click", function () {
        const isOpen = navLinks.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    // Close the menu when a navigation link is clicked.

    navLinks.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            navLinks.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.textContent = "☰";
        });
    });

    // ==============================
    // 4. DARK / LIGHT MODE
    // ==============================

    function setTheme(isDark) {
        document.body.classList.toggle("dark-mode", isDark);

        themeToggle.textContent = isDark ? "☀️" : "🌙";

        themeToggle.setAttribute(
            "aria-label",
            isDark ? "Switch to light theme" : "Switch to dark theme"
        );

        themeToggle.title = isDark
            ? "Switch to light theme"
            : "Switch to dark theme";
    }

    // Restore the previous theme if browser storage is available.

    let savedTheme = null;

    try {
        savedTheme = localStorage.getItem("creativeSpaceTheme");
    } catch (error) {
        // The website still works if browser storage is unavailable.
    }

    setTheme(savedTheme === "dark");

    themeToggle.addEventListener("click", function () {
        const isDark = !document.body.classList.contains("dark-mode");

        setTheme(isDark);

        try {
            localStorage.setItem(
                "creativeSpaceTheme",
                isDark ? "dark" : "light"
            );
        } catch (error) {
            // The theme works for the current page even without storage.
        }
    });

    // ==============================
    // 5. PROJECT CATEGORY FILTERS
    // ==============================

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const selectedCategory = button.dataset.filter;
            let visibleCount = 0;

            filterButtons.forEach(function (filterButton) {
                const isActive = filterButton === button;

                filterButton.classList.toggle("active", isActive);
                filterButton.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });

            projectCards.forEach(function (card) {
                const category = card.dataset.category;

                const shouldShow =
                    selectedCategory === "all" ||
                    category === selectedCategory;

                card.hidden = !shouldShow;

                if (shouldShow) {
                    visibleCount++;
                }
            });

            noProjects.hidden = visibleCount > 0;
        });
    });

    // ==============================
    // 6. PROJECT DETAILS POPUP
    // ==============================

    const projectDetails = {
        brand: {
            title: "Creative Brand Identity",
            description:
                "This design concept explores how colors, typography, " +
                "and visual elements can create a consistent brand identity. " +
                "It is a sample project for demonstrating creative design ideas."
        },

        website: {
            title: "Responsive Website",
            description:
                "This website concept focuses on responsive layouts, " +
                "clear navigation, readable content, and a consistent " +
                "experience across desktop computers, tablets, and phones."
        },

        mobile: {
            title: "Mobile App Interface",
            description:
                "This interface concept explores simple navigation, " +
                "clear visual hierarchy, and user-friendly screens for " +
                "a mobile application."
        }
    };

    document.querySelectorAll(".project-link").forEach(function (button) {
        button.addEventListener("click", function () {
            const project = projectDetails[button.dataset.project];

            if (!project) {
                return;
            }

            dialogTitle.textContent = project.title;
            dialogDescription.textContent = project.description;

            projectDialog.showModal();
        });
    });

    function closeProjectDialog() {
        if (projectDialog.open) {
            projectDialog.close();
        }
    }

    dialogClose.addEventListener("click", closeProjectDialog);
    dialogOk.addEventListener("click", closeProjectDialog);

    // Close the popup if the user clicks outside its content.

    projectDialog.addEventListener("click", function (event) {
        if (event.target === projectDialog) {
            closeProjectDialog();
        }
    });

    // ==============================
    // 7. CONTACT FORM INTERACTION
    // ==============================

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        formStatus.textContent = "";
        formStatus.className = "form-status";

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        const nameInput = document.getElementById("name");
        const name = nameInput.value.trim();

        if (name.length < 2) {
            formStatus.textContent =
                "Please enter a name with at least two characters.";
            formStatus.classList.add("error");
            nameInput.focus();
            return;
        }

        formStatus.textContent =
            "Thank you, " + name +
            "! Your form passed validation. This is a demo, " +
            "so your message has not been sent.";

        formStatus.classList.add("success");

        contactForm.reset();
    });

    // ==============================
    // 8. HIGHLIGHT CURRENT SECTION
    // ==============================

    const pageSections = document.querySelectorAll("main section[id]");
    const navigationLinks = navLinks.querySelectorAll("a");

    if ("IntersectionObserver" in window) {
        const sectionObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    navigationLinks.forEach(function (link) {
                        const isCurrent =
                            link.getAttribute("href") ===
                            "#" + entry.target.id;

                        link.classList.toggle("active", isCurrent);

                        if (isCurrent) {
                            link.setAttribute("aria-current", "location");
                        } else {
                            link.removeAttribute("aria-current");
                        }
                    });
                });
            },
            {
                rootMargin: "-20% 0px -60% 0px"
            }
        );

        pageSections.forEach(function (section) {
            sectionObserver.observe(section);
        });
    }
});
