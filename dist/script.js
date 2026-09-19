(function () {
  "use strict";

  const translations = {
    tr: {
      eyebrow: "HESAP VE VERİLER",
      title: "Live Moment hesabınızı silin",
      intro: "Live Moment: Weather Wallpaper hesabınızın ve ilişkili uygulama verilerinin kalıcı olarak silinmesini talep edin.",
      requestCta: "Silme talebi gönder",
      privacyTitle: "Hesap ID’niz bir parola değildir",
      privacyText: "Silme işleminden önce hesap sahipliğini doğrularız. Yalnızca hesap ID’sini bilmek silme yetkisi vermez.",
      requestTitle: "Hesap silme talebi oluşturun",
      requestLead: "Live Moment hesabınıza bağlı e-posta adresini kullanın. Hazır talep e-posta uygulamanızda açılır; kontrol edip Gönder’e dokunun.",
      emailLabel: "Hesap e-posta adresi",
      emailHelp: "Google ile giriş veya e-posta bağlantısıyla giriş yaparken kullandığınız adresi yazın.",
      idLabel: "Hesap ID’si",
      optional: "İsteğe bağlı",
      idHelp: "Hesabınızı bulmamıza yardımcı olur; hesap sahipliği kanıtı olarak kullanılmaz.",
      confirmTitle: "Hesabımı kalıcı olarak silmek istiyorum.",
      confirmText: "Bu işlemin geri alınamayacağını anlıyorum.",
      submitCta: "Silme talebini hazırla",
      formFootnote: "Bu sayfa bilgilerinizi iletmez. Bilgiler e-posta uygulamanızdaki yeni bir mesaja eklenir ve yalnızca Gönder’i seçtiğinizde iletilir.",
      dataTitle: "Veri silme ayrıntıları",
      dataLead: "Talebin hangi verileri kapsadığını ve Live Moment dışında nelerin kalabileceğini görün.",
      deletedTitle: "Silinenler",
      deletedSummary: "Live Moment hesabınız, profiliniz, yüklenen medyalarınız ve üretim geçmişiniz.",
      retainedTitle: "Kalabilecek veriler",
      retainedSummary: "Dışa aktarılan kopyalar, Google hesabınız ve güvenlik ya da sağlayıcı saklama şartları için gerekli sınırlı kayıtlar.",
      subscriptionTitle: "Hesabınızı silmek Google Play aboneliğinizi iptal etmez.",
      subscriptionText: "Etkin aboneliğinizi talep göndermeden önce veya sonra Google Play üzerinden ayrıca iptal edin.",
      footerText: "Hesap silme ve veri talebi",
      invalidEmail: "Geçerli bir e-posta adresi girin.",
      confirmRequired: "Devam etmek için kalıcı silme onay kutusunu işaretleyin.",
      emailNotConfigured: "Talep adresi henüz yapılandırılmamış. Lütfen site yöneticisiyle iletişime geçin.",
      mailSubject: "Live Moment hesap silme talebi",
      mailGreeting: "Live Moment Destek Ekibi,",
      mailRequest: "Live Moment: Weather Wallpaper hesabımın ve hesapla ilişkili uygulama verilerimin kalıcı olarak silinmesini talep ediyorum.",
      mailEmail: "Hesap e-posta adresi",
      mailId: "Hesap ID’si",
      mailMissingId: "Belirtilmedi",
      mailConsent: "Bu işlemin geri alınamayacağını anlıyorum.",
      mailVerify: "Hesap sahipliğimi doğrulamak için gerekli güvenli adımları iletebilirsiniz."
    }
  };

  const englishMessages = {
    invalidEmail: "Enter a valid email address.",
    confirmRequired: "Select the permanent-deletion confirmation before continuing.",
    emailNotConfigured: "The request address has not been configured yet. Please contact the site administrator.",
    mailSubject: "Live Moment account deletion request",
    mailGreeting: "Live Moment Support,",
    mailRequest: "I request permanent deletion of my Live Moment: Weather Wallpaper account and its associated app data.",
    mailEmail: "Account email",
    mailId: "Account ID",
    mailMissingId: "Not provided",
    mailConsent: "I understand that this action cannot be undone.",
    mailVerify: "Please send any secure steps required to verify that I own this account."
  };

  let language = "en";
  const translatable = Array.from(document.querySelectorAll("[data-i18n]"));
  const originalEnglish = Object.fromEntries(
    translatable.map((element) => [element.dataset.i18n, element.innerHTML])
  );

  function setLanguage(nextLanguage) {
    language = nextLanguage === "tr" ? "tr" : "en";
    document.documentElement.lang = language;
    document.title = language === "tr"
      ? "Hesabınızı silin · Live Moment"
      : "Delete your account · Live Moment";

    translatable.forEach((element) => {
      const key = element.dataset.i18n;
      element.innerHTML = language === "tr" ? translations.tr[key] : originalEnglish[key];
    });

    document.querySelectorAll("[data-language]").forEach((button) => {
      const active = button.dataset.language === language;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

  }

  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.language));
  });

  // English is the stable default for the public Google Play resource.
  // Visitors can switch to Turkish for the current page without changing
  // the default on their next visit.
  setLanguage("en");

  const form = document.getElementById("request-form");
  const emailInput = document.getElementById("account-email");
  const idInput = document.getElementById("account-id");
  const confirmInput = document.getElementById("confirm-delete");
  const message = document.getElementById("form-message");

  function showError(text, input) {
    message.textContent = text;
    message.classList.add("is-visible");
    if (input) {
      input.setAttribute("aria-invalid", "true");
      input.focus();
    }
  }

  function clearError() {
    message.textContent = "";
    message.classList.remove("is-visible");
    emailInput.removeAttribute("aria-invalid");
    confirmInput.removeAttribute("aria-invalid");
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearError();

    const messages = language === "tr" ? translations.tr : englishMessages;
    const email = emailInput.value.trim();
    const accountId = idInput.value.trim();
    const supportEmail = String(window.LIVE_MOMENT_CONFIG?.supportEmail || "").trim();

    if (!emailInput.validity.valid) {
      showError(messages.invalidEmail, emailInput);
      return;
    }
    if (!confirmInput.checked) {
      confirmInput.setAttribute("aria-invalid", "true");
      showError(messages.confirmRequired, confirmInput);
      return;
    }
    if (!supportEmail || supportEmail === "REPLACE_WITH_SUPPORT_EMAIL") {
      showError(messages.emailNotConfigured);
      return;
    }

    const body = [
      messages.mailGreeting,
      "",
      messages.mailRequest,
      "",
      `${messages.mailEmail}: ${email}`,
      `${messages.mailId}: ${accountId || messages.mailMissingId}`,
      "",
      messages.mailConsent,
      messages.mailVerify
    ].join("\n");

    window.location.href = `mailto:${encodeURIComponent(supportEmail)}?subject=${encodeURIComponent(messages.mailSubject)}&body=${encodeURIComponent(body)}`;
  });

  document.getElementById("year").textContent = String(new Date().getFullYear());
})();
