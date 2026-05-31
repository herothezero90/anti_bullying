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
