const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#site-nav");
const form = document.querySelector("#contact-form");
const status = document.querySelector("#form-status");
const companyDialog = document.querySelector("#company-dialog");
const companyDialogOpen = document.querySelector("[data-company-dialog-open]");
const companyDialogClose = document.querySelectorAll("[data-company-dialog-close]");
const consentDialog = document.querySelector("#consent-dialog");
const consentDialogClose = document.querySelector("[data-consent-dialog-close]");
const consentCheckbox = document.querySelector("#personal-data-consent");
const consentDialogStatus = document.querySelector("#consent-dialog-status");

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
  consentCheckbox.checked = false;
  consentDialogStatus.textContent = "";
  consentDialog?.showModal();
});

consentCheckbox?.addEventListener("change", () => {
  if (!consentCheckbox.checked) return;

  consentDialogStatus.textContent = "Согласие подтверждено";

  window.setTimeout(() => {
    consentDialog?.close();
    status.textContent =
      "Согласие подтверждено. Деморежим: заявка не отправлена и данные не сохранены.";
    form?.reset();
  }, 450);
});

consentDialogClose?.addEventListener("click", () => consentDialog?.close());

consentDialog?.addEventListener("click", (event) => {
  if (event.target === consentDialog) consentDialog.close();
});

companyDialogOpen?.addEventListener("click", () => {
  companyDialog?.showModal();
});

companyDialogClose.forEach((button) => {
  button.addEventListener("click", () => companyDialog?.close());
});

companyDialog?.addEventListener("click", (event) => {
  if (event.target === companyDialog) companyDialog.close();
});
