const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");
const modal = document.querySelector("#contact-modal");
const contactForm = document.querySelector("#contact-form");
const formState = document.querySelector("#form-state");
const successState = document.querySelector("#success-state");
const programSelect = document.querySelector("#program-select");
const modalOpeners = document.querySelectorAll("[data-modal-open]");
const modalClosers = document.querySelectorAll("[data-modal-close]");
const focusableSelector = "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";
let previouslyFocusedElement;

function initializeHeroMotion(animate, createTimeline, utils) {
    const heroPicture = document.querySelector(".hero-picture");
    const heroBase = document.querySelector(".hero-base");
    const heroHeading = document.querySelector(".hero-copy h1");
    const heroIntro = document.querySelector(".hero-intro");
    const heroActions = document.querySelector(".hero-actions");

    if (!heroPicture || !heroBase || !heroHeading || !heroIntro || !heroActions) {
        return;
    }

    document.documentElement.classList.add("motion-ready");

    utils.set(heroBase, { opacity: 0 });
    utils.set([heroHeading, heroIntro, heroActions], { opacity: 0, y: 18 });

    const timeline = createTimeline({
        defaults: { ease: "inOut(2)" },
        onComplete: () => {
            heroPicture.classList.add("hero-animation-complete");
            utils.set([heroHeading, heroIntro, heroActions], { opacity: 1, y: 0 });
        }
    });

    timeline
        .add(heroBase, { opacity: 1, duration: 1800 }, 0)
        .add(heroHeading, { opacity: 1, y: 0, duration: 1350 }, 520)
        .add(heroIntro, { opacity: 1, y: 0, duration: 1200 }, 820)
        .add(heroActions, { opacity: 1, y: 0, duration: 1100 }, 1050);
}

function initializeScrollMotion(animate, stagger, utils) {
    const revealGroups = [
        ...document.querySelectorAll(".section-heading"),
        document.querySelector(".step-grid"),
        document.querySelector(".process-support"),
        document.querySelector(".program-grid"),
        document.querySelector(".approach-grid"),
        document.querySelector(".faq-list"),
        document.querySelector(".cta-card")
    ].filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            const targets = entry.target.matches(".section-heading")
                ? [entry.target]
                : [...entry.target.children];

            animate(targets, {
                opacity: 1,
                y: 0,
                duration: 1250,
                delay: stagger(140),
                ease: "out(2)"
            });

            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.14,
        rootMargin: "0px 0px -8% 0px"
    });

    revealGroups.forEach((group) => {
        const targets = group.matches(".section-heading") ? [group] : [...group.children];
        utils.set(targets, { opacity: 0, y: 22 });
        observer.observe(group);
    });
}

function initializeMotion() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !window.anime) {
        document.documentElement.classList.remove("motion-pending");
        return;
    }

    const { animate, createTimeline, stagger, utils } = window.anime;

    try {
        initializeHeroMotion(animate, createTimeline, utils);
        initializeScrollMotion(animate, stagger, utils);
        document.documentElement.classList.remove("motion-pending");
    } catch (error) {
        document.documentElement.classList.remove("motion-pending", "motion-ready");
        console.error("Motion initialization failed:", error);
    }
}

function closeMenu() {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    mobileMenu.classList.remove("is-open");
}

function toggleMenu() {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
    mobileMenu.classList.toggle("is-open", !isOpen);
}

function resetModal() {
    contactForm.reset();
    formState.hidden = false;
    successState.hidden = true;
}

function openModal(opener) {
    resetModal();
    previouslyFocusedElement = opener;
    modal.hidden = false;
    document.body.classList.add("modal-open");

    if (opener.dataset.program) {
        programSelect.value = opener.dataset.program;
    }

    modal.querySelector("input").focus();
}

function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");

    if (previouslyFocusedElement) {
        previouslyFocusedElement.focus();
    }
}

function keepFocusInsideModal(event) {
    if (event.key !== "Tab" || modal.hidden) {
        return;
    }

    const focusableElements = [...modal.querySelectorAll(focusableSelector)].filter((element) => element.offsetParent !== null);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
    }
}

menuToggle.addEventListener("click", toggleMenu);

mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
        closeMenu();
    }
});

modalOpeners.forEach((opener) => {
    opener.addEventListener("click", () => openModal(opener));
});

modalClosers.forEach((closer) => {
    closer.addEventListener("click", closeModal);
});

modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
        closeModal();
    }

    keepFocusInsideModal(event);
});

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
    }

    formState.hidden = true;
    successState.hidden = false;
    successState.focus();
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
initializeMotion();
