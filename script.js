const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#site-nav");
const form = document.querySelector("#contact-form");
const status = document.querySelector("#form-status");

const closeMenu = ({ restoreFocus = false } = {}) => {
  menuButton?.setAttribute("aria-expanded", "false");
  navigation?.removeAttribute("data-open");
  if (restoreFocus) menuButton?.focus();
};

menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  navigation?.toggleAttribute("data-open", open);
});

navigation?.addEventListener("click", (event) => {
  if (event.target.closest('a[href^="#"]')) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigation?.hasAttribute("data-open")) {
    closeMenu({ restoreFocus: true });
  }
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  status.textContent =
    "Деморежим: заявка не отправлена. Контакты нужно подключить перед публикацией.";
});
