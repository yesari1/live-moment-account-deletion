// Self-service on the account site. The visitor signs in with Google, then:
//  - on /delete-data/ (element #ss-list): sees the cloud library and deletes a creation;
//  - on / (element #ss-delete-confirm): deletes the account (typed DELETE + a recent sign-in).
// Each page carries only the markup of what it offers and this module wires whatever exists.
// No framework and no Firebase import here: page.js hands over the few things it needs
// (sign-in, ID token, API address), so the same code can be tried against a fake backend.
// Text from the server goes in with textContent, never as HTML. The language follows
// <html lang>, which the EN/TR switch of each page sets.

const STRINGS = {
  en: {
    checking: "Checking your sign-in…",
    libSignInTitle: "Delete wallpapers from your cloud library",
    libSignInText: "Sign in with the Google account you use in Live Moment to see your wallpapers here and delete them. The rest of this page needs no sign-in.",
    accSignInTitle: "Delete your account now",
    accSignInText: "Sign in with the Google account you use in Live Moment to delete your account right away, without sending an email.",
    signInButton: "Sign in with Google",
    signInNote: "This page loads Google's sign-in scripts. Your sign-in session stays in this browser until you sign out.",
    signedInAs: "Signed in as",
    signOut: "Sign out",
    libraryTitle: "Your cloud library",
    loading: "Loading your wallpapers…",
    empty: "There are no wallpapers in your cloud library.",
    loadFailed: "Could not load your wallpapers. Check your connection and try again.",
    retry: "Try again",
    modeSingle: "Single wallpaper",
    metaMany: "{ready} of {total} wallpapers ready",
    metaReady: "Ready",
    metaNotReady: "Not finished",
    delete: "Delete",
    deleting: "Deleting…",
    confirmTitle: "Delete “{title}” from Live Moment?",
    confirmText: "Its photos and videos are removed from your cloud library and this cannot be undone. Wallpapers saved on your phone are not affected by this page.",
    confirmYes: "Yes, delete",
    confirmNo: "Cancel",
    listNote: "Deleting removes it from Live Moment right away; copies held by our AI provider are deleted through a queue.",
    deletedTitle: "“{title}” deleted",
    deletedConfirm: "Removed from Live Moment now. Copies held by our AI provider are queued for deletion.",
    dismiss: "Dismiss",
    deleteFailed: "Could not delete it. Please try again.",
    authExpired: "Your sign-in expired. Please sign in again.",
    recentLogin: "For your security, confirm that it is you: the account was not deleted. Try again and sign in when Google asks.",
    accountTitle: "Delete my account",
    accountText: "Permanently deletes your Live Moment account, profile, cloud library and generation history. This cannot be undone. It does not cancel a Google Play subscription: cancel that separately in Google Play.",
    accountTypeLabel: "Type DELETE to confirm",
    accountButton: "Delete my account",
    accountHint: "Google will ask you to confirm that it is you.",
    accountWorking: "Deleting your account…",
    accountFailed: "Could not delete the account. Please try again.",
    accountCancelled: "Confirmation cancelled. Your account was not deleted.",
    doneTitle: "Your account was deleted.",
    doneSubscription: "Deleting your account does not cancel a Google Play subscription. Cancel any active subscription in Google Play.",
    signInFailed: "Sign-in failed. Please try again.",
    signInBlocked: "Your browser blocked the sign-in window. Allow pop-ups for this site and try again.",
    signInCancelled: "Sign-in was cancelled.",
    signInNetwork: "No connection. Check your internet and try again.",
    signInDomain: "This page is not authorised for Google sign-in yet.",
    sdkFailed: "Could not load Google sign-in. Check your connection or turn off content blockers for this page, then reload.",
  },
  tr: {
    checking: "Oturumunuz kontrol ediliyor…",
    libSignInTitle: "Bulut kitaplığınızdaki duvar kâğıtlarını silin",
    libSignInText: "Live Moment'ta kullandığınız Google hesabıyla giriş yapın; duvar kâğıtlarınızı burada görüp silebilirsiniz. Bu sayfanın geri kalanı için giriş gerekmez.",
    accSignInTitle: "Hesabınızı hemen silin",
    accSignInText: "E-posta göndermeden, Live Moment'ta kullandığınız Google hesabıyla giriş yapıp hesabınızı hemen silin.",
    signInButton: "Google ile giriş yap",
    signInNote: "Bu sayfa Google'ın oturum açma betiklerini yükler. Oturumunuz, çıkış yapana kadar bu tarayıcıda kalır.",
    signedInAs: "Giriş yapan hesap:",
    signOut: "Çıkış yap",
    libraryTitle: "Bulut kitaplığınız",
    loading: "Duvar kâğıtlarınız yükleniyor…",
    empty: "Bulut kitaplığınızda duvar kâğıdı yok.",
    loadFailed: "Duvar kâğıtlarınız yüklenemedi. Bağlantınızı kontrol edip tekrar deneyin.",
    retry: "Tekrar dene",
    modeSingle: "Tek duvar kâğıdı",
    metaMany: "{total} duvar kâğıdından {ready} tanesi hazır",
    metaReady: "Hazır",
    metaNotReady: "Tamamlanmadı",
    delete: "Sil",
    deleting: "Siliniyor…",
    confirmTitle: "“{title}” Live Moment'tan silinsin mi?",
    confirmText: "Fotoğrafları ve videoları bulut kitaplığınızdan kaldırılır, bu işlem geri alınamaz. Telefonunuza kaydedilmiş duvar kâğıtları bu sayfadan etkilenmez.",
    confirmYes: "Evet, sil",
    confirmNo: "Vazgeç",
    listNote: "Silme işlemi Live Moment'tan hemen kaldırır; yapay zekâ sağlayıcımızın elindeki kopyalar bir kuyruk üzerinden silinir.",
    deletedTitle: "“{title}” silindi",
    deletedConfirm: "Live Moment'tan şimdi kaldırıldı. Yapay zekâ sağlayıcımızın elindeki kopyalar silinmek üzere sıraya alındı.",
    dismiss: "Kapat",
    deleteFailed: "Silinemedi. Lütfen tekrar deneyin.",
    authExpired: "Oturumunuz sona erdi. Lütfen yeniden giriş yapın.",
    recentLogin: "Güvenliğiniz için sizin olduğunuzu doğrulamanız gerekiyor: hesap silinmedi. Tekrar deneyin ve Google sorduğunda giriş yapın.",
    accountTitle: "Hesabımı sil",
    accountText: "Live Moment hesabınızı, profilinizi, bulut kitaplığınızı ve üretim geçmişinizi kalıcı olarak siler. Bu işlem geri alınamaz. Google Play aboneliğinizi iptal etmez: onu Google Play'den ayrıca iptal edin.",
    accountTypeLabel: "Onaylamak için DELETE yazın",
    accountButton: "Hesabımı sil",
    accountHint: "Google, sizin olduğunuzu doğrulamanızı isteyecek.",
    accountWorking: "Hesabınız siliniyor…",
    accountFailed: "Hesap silinemedi. Lütfen tekrar deneyin.",
    accountCancelled: "Doğrulama iptal edildi. Hesabınız silinmedi.",
    doneTitle: "Hesabınız silindi.",
    doneSubscription: "Hesabınızı silmek Google Play aboneliğinizi iptal etmez. Etkin aboneliğinizi Google Play'den iptal edin.",
    signInFailed: "Giriş başarısız oldu. Lütfen tekrar deneyin.",
    signInBlocked: "Tarayıcınız giriş penceresini engelledi. Bu site için açılır pencerelere izin verip tekrar deneyin.",
    signInCancelled: "Giriş iptal edildi.",
    signInNetwork: "Bağlantı yok. İnternetinizi kontrol edip tekrar deneyin.",
    signInDomain: "Bu sayfa henüz Google girişi için yetkilendirilmedi.",
    sdkFailed: "Google girişi yüklenemedi. Bağlantınızı kontrol edin veya bu sayfa için içerik engelleyicileri kapatıp sayfayı yenileyin.",
  },
};

const MODE_LABELS = { live_weather: "Live Weather", live_weather_plus: "Live Weather Plus" };
const DELETE_WORD = "DELETE";
const REAUTH_AFTER_SECONDS = 240; // the API wants a sign-in from the last 5 minutes to delete an account

/**
 * deps: { apiBase, signIn(), signOut(), getToken(forceRefresh), authAgeSeconds(), reauthenticate(),
 *         document?, fetchFn? }
 */
export function createSelfService(deps) {
  const doc = deps.document ?? document;
  const fetchFn = deps.fetchFn ?? ((...args) => fetch(...args));
  const $ = (id) => doc.getElementById(id);
  const el = {
    checking: $("ss-checking"),
    signedOut: $("ss-signed-out"),
    signedIn: $("ss-signed-in"),
    done: $("ss-done"),
    signInButton: $("ss-sign-in"),
    signInMessage: $("ss-sign-in-message"),
    email: $("ss-email"),
    signOutButton: $("ss-sign-out"),
    status: $("ss-status"),
    loading: $("ss-loading"),
    loadError: $("ss-load-error"),
    retry: $("ss-retry"),
    list: $("ss-list"),
    empty: $("ss-empty"),
    confirmInput: $("ss-delete-confirm"),
    accountButton: $("ss-delete-account"),
    accountMessage: $("ss-delete-account-message"),
  };
  const hasLibrary = Boolean(el.list);
  const hasAccount = Boolean(el.confirmInput && el.accountButton);

  const languageOf = () => (String(doc.documentElement.lang || "en").toLowerCase().startsWith("tr") ? "tr" : "en");
  let language = languageOf();
  let signedInUser = null;
  let projects = [];
  let libraryLoaded = false;
  let loadRun = 0;
  let accountDeleted = false;
  let accountBusy = false;
  let status = null; // { key, kind }
  let accountMessage = null; // { key, kind }
  let signInMessage = null; // { key }
  const thumbs = new Map(); // object name -> https download URL
  const itemState = new Map(); // project id -> "confirm" | "deleting" | "deleted"

  const t = (key, vars = {}) =>
    (STRINGS[language][key] ?? STRINGS.en[key] ?? key).replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ""));
  const setHidden = (node, hidden) => {
    if (node) node.hidden = hidden;
  };

  // ---------------------------------------------------------------- texts

  function applyStrings() {
    doc.querySelectorAll("[data-str]").forEach((node) => {
      node.textContent = t(node.dataset.str);
    });
    renderStatus();
    renderAccountMessage();
    renderSignInMessage();
    renderList();
  }

  function setStatus(key, kind) {
    status = key ? { key, kind } : null;
    renderStatus();
  }

  function renderMessage(node, message, kind) {
    if (!node) return;
    node.textContent = message ? t(message.key) : "";
    node.className = message ? `ss-status is-${kind}` : "ss-status";
  }

  const renderStatus = () => renderMessage(el.status, status, status && status.kind);
  const renderAccountMessage = () => renderMessage(el.accountMessage, accountMessage, accountMessage && accountMessage.kind);
  const renderSignInMessage = () => renderMessage(el.signInMessage, signInMessage, "error");

  // ---------------------------------------------------------------- API

  async function api(method, path, body) {
    const token = await deps.getToken(false);
    const headers = { Authorization: `Bearer ${token}` };
    if (body !== undefined) headers["Content-Type"] = "application/json";
    const response = await fetchFn(`${deps.apiBase}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    let data = null;
    if (response.status !== 204) {
      try {
        data = await response.json();
      } catch {
        data = null;
      }
    }
    if (!response.ok) {
      const error = new Error(`API ${method} ${path} failed`);
      error.status = response.status;
      error.code = data && data.error && typeof data.error.code === "string" ? data.error.code : null;
      throw error;
    }
    return data;
  }

  function failureKey(error, fallback) {
    if (error && error.code === "REQUIRES_RECENT_LOGIN") return "recentLogin";
    if (error && error.status === 401) return "authExpired";
    return fallback;
  }

  // ---------------------------------------------------------------- library (Delete data page)

  function pickThumbnail(project, slots) {
    for (const slot of slots) {
      const media = slot && slot.media ? slot.media : {};
      for (const kind of ["still", "preview"]) {
        if (media[kind] && typeof media[kind].objectName === "string") return media[kind].objectName;
      }
    }
    return project.source && typeof project.source.objectName === "string" ? project.source.objectName : null;
  }

  function normalizeProjects(library) {
    const raw = Array.isArray(library && library.projects) ? library.projects : [];
    return raw
      .filter((project) => project && typeof project.projectId === "string")
      .map((project) => {
        const fields = project.fields && typeof project.fields === "object" ? project.fields : {};
        const slots = Array.isArray(project.slots) ? project.slots : [];
        const created = Date.parse(fields.createdAt);
        return {
          id: project.projectId,
          mode: typeof fields.mode === "string" ? fields.mode : "create_one",
          createdMs: Number.isFinite(created) ? created : Number(project.updatedAtEpochMs) || 0,
          total: slots.length,
          ready: slots.filter((slot) => slot && slot.media && slot.media.video).length,
          thumbObject: pickThumbnail(project, slots),
        };
      })
      .sort((a, b) => b.createdMs - a.createdMs);
  }

  async function loadLibrary() {
    const run = ++loadRun;
    libraryLoaded = false;
    projects = [];
    itemState.clear();
    setHidden(el.loadError, true);
    setHidden(el.loading, false);
    renderList();
    try {
      const library = await api("GET", "/v1/library");
      if (run !== loadRun) return;
      projects = normalizeProjects(library);
      libraryLoaded = true;
      setHidden(el.loading, true);
      renderList();
      void loadThumbnails(run);
    } catch (error) {
      if (run !== loadRun) return;
      setHidden(el.loading, true);
      setHidden(el.loadError, false);
      setStatus(failureKey(error, "loadFailed"), "error");
    }
  }

  async function loadThumbnails(run) {
    const wanted = [...new Set(projects.map((project) => project.thumbObject).filter(Boolean))];
    for (let start = 0; start < wanted.length; start += 100) {
      try {
        const result = await api("POST", "/v1/library/downloads", { objects: wanted.slice(start, start + 100) });
        if (run !== loadRun) return;
        for (const download of (result && result.downloads) || []) {
          if (download && typeof download.objectName === "string" && /^https:\/\//.test(String(download.downloadUrl))) {
            thumbs.set(download.objectName, download.downloadUrl);
          }
        }
        applyThumbnails();
      } catch {
        return; // thumbnails are optional
      }
    }
  }

  function applyThumbnails() {
    if (!hasLibrary) return;
    el.list.querySelectorAll(".ss-thumb[data-object]").forEach((box) => {
      const url = thumbs.get(box.dataset.object);
      if (!url || box.querySelector("img")) return;
      const image = doc.createElement("img");
      image.alt = "";
      image.loading = "lazy";
      image.decoding = "async";
      image.referrerPolicy = "no-referrer";
      image.addEventListener("error", () => image.remove());
      image.src = url;
      box.append(image);
    });
  }

  function dateText(ms) {
    if (!ms) return "";
    try {
      return new Intl.DateTimeFormat(language === "tr" ? "tr-TR" : "en-GB", { dateStyle: "long" }).format(new Date(ms));
    } catch {
      return "";
    }
  }

  function titleOf(project) {
    return MODE_LABELS[project.mode] ?? t("modeSingle");
  }

  function metaOf(project) {
    let state;
    if (project.total > 1) state = t("metaMany", { ready: project.ready, total: project.total });
    else state = project.ready > 0 ? t("metaReady") : t("metaNotReady");
    return [state, dateText(project.createdMs)].filter(Boolean).join(" · ");
  }

  function button(label, className, onClick) {
    const node = doc.createElement("button");
    node.type = "button";
    node.className = `ss-button ${className}`.trim();
    node.textContent = label;
    node.addEventListener("click", onClick);
    return node;
  }

  function text(tag, className, content) {
    const node = doc.createElement(tag);
    node.className = className;
    node.textContent = content;
    return node;
  }

  function renderItem(project) {
    const state = itemState.get(project.id) ?? "idle";
    const item = doc.createElement("li");
    item.className = state === "deleted" ? "ss-item ss-item-done" : "ss-item";
    item.dataset.id = project.id;
    const body = doc.createElement("div");
    body.className = "ss-body";

    if (state === "deleted") {
      // The only place the "removed now, provider copies queued" sentence is shown: right where
      // the item was, after the API confirmed the deletion.
      item.setAttribute("role", "status");
      const dismiss = button(t("dismiss"), "", () => dismissDeleted(project.id));
      dismiss.dataset.role = "dismiss";
      body.append(
        text("p", "ss-done-title", t("deletedTitle", { title: titleOf(project) })),
        text("p", "ss-meta", t("deletedConfirm")),
        dismiss,
      );
      item.append(body);
      return item;
    }

    const thumb = doc.createElement("div");
    thumb.className = "ss-thumb";
    thumb.setAttribute("aria-hidden", "true");
    if (project.thumbObject) thumb.dataset.object = project.thumbObject;
    item.append(thumb);

    body.append(text("h3", "ss-item-title", titleOf(project)), text("p", "ss-meta", metaOf(project)));
    if (state === "idle") {
      body.append(button(t("delete"), "ss-button-danger", () => setItemState(project.id, "confirm", "cancel")));
    } else {
      const box = doc.createElement("div");
      box.className = "ss-confirm";
      box.setAttribute("role", "group");
      box.setAttribute("aria-label", t("confirmTitle", { title: titleOf(project) }));
      const question = doc.createElement("p");
      const strong = doc.createElement("strong");
      strong.textContent = t("confirmTitle", { title: titleOf(project) });
      question.append(strong);
      const busy = state === "deleting";
      const yes = button(busy ? t("deleting") : t("confirmYes"), "ss-button-solid-danger", () => deleteProject(project.id));
      const no = button(t("confirmNo"), "", () => setItemState(project.id, "idle", "delete"));
      yes.disabled = busy;
      no.disabled = busy;
      yes.dataset.role = "confirm";
      no.dataset.role = "cancel";
      const actions = doc.createElement("div");
      actions.className = "ss-actions";
      actions.append(yes, no);
      box.append(question, text("p", "", t("confirmText")), actions);
      body.append(box);
    }
    item.append(body);
    return item;
  }

  function updateEmpty() {
    if (!el.empty) return;
    const remaining = projects.some((project) => itemState.get(project.id) !== "deleted");
    el.empty.hidden = !(libraryLoaded && !remaining);
  }

  function renderList() {
    if (!hasLibrary) return;
    el.list.replaceChildren(...projects.map(renderItem));
    updateEmpty();
    applyThumbnails();
  }

  function setItemState(id, state, focusRole) {
    if (state === "idle") itemState.delete(id);
    else itemState.set(id, state);
    const project = projects.find((entry) => entry.id === id);
    const current = el.list.querySelector(`[data-id="${CSS.escape(id)}"]`);
    if (!project || !current) return;
    const fresh = renderItem(project);
    current.replaceWith(fresh);
    updateEmpty();
    applyThumbnails();
    if (focusRole) {
      const selector = { cancel: '[data-role="cancel"]', dismiss: '[data-role="dismiss"]', delete: ".ss-button-danger" }[focusRole];
      const target = selector ? fresh.querySelector(selector) : null;
      if (target) target.focus();
    }
  }

  function dismissDeleted(id) {
    projects = projects.filter((project) => project.id !== id);
    itemState.delete(id);
    renderList();
  }

  async function deleteProject(id) {
    setItemState(id, "deleting");
    setStatus(null);
    try {
      await api("DELETE", `/v1/library/projects/${encodeURIComponent(id)}`);
      setItemState(id, "deleted", "dismiss");
    } catch (error) {
      setItemState(id, "idle");
      setStatus(failureKey(error, "deleteFailed"), "error");
    }
  }

  // ---------------------------------------------------------------- account (Delete account page)

  function updateAccountButton() {
    if (!hasAccount) return;
    const typed = el.confirmInput.value.trim().toUpperCase() === DELETE_WORD;
    el.accountButton.disabled = accountBusy || !typed;
    el.confirmInput.disabled = accountBusy;
  }

  async function deleteAccount() {
    if (accountBusy || el.confirmInput.value.trim().toUpperCase() !== DELETE_WORD) return;
    accountBusy = true;
    accountMessage = { key: "accountWorking", kind: "ok" };
    renderAccountMessage();
    updateAccountButton();
    try {
      if ((await deps.authAgeSeconds()) > REAUTH_AFTER_SECONDS) {
        try {
          await deps.reauthenticate();
        } catch (error) {
          accountMessage = { key: "accountCancelled", kind: "error" };
          throw Object.assign(new Error("reauthentication failed"), { handled: true, cause: error });
        }
        await deps.getToken(true);
      }
      await api("DELETE", "/v1/account");
      accountDeleted = true;
      try {
        await deps.signOut();
      } catch {
        // the account is gone either way
      }
      showAccountDeleted();
    } catch (error) {
      if (!(error && error.handled)) {
        accountMessage = { key: failureKey(error, "accountFailed"), kind: "error" };
      }
      renderAccountMessage();
    } finally {
      accountBusy = false;
      updateAccountButton();
    }
  }

  function showAccountDeleted() {
    signedInUser = null;
    loadRun += 1;
    setHidden(el.checking, true);
    setHidden(el.signedOut, true);
    setHidden(el.signedIn, true);
    setHidden(el.done, false);
    if (el.done) {
      const heading = el.done.querySelector("[tabindex]");
      if (heading) heading.focus();
    }
  }

  // ---------------------------------------------------------------- views

  function showSignedOut() {
    signedInUser = null;
    projects = [];
    libraryLoaded = false;
    loadRun += 1;
    itemState.clear();
    setHidden(el.checking, true);
    setHidden(el.signedIn, true);
    if (accountDeleted) {
      setHidden(el.done, false);
      setHidden(el.signedOut, true);
      return;
    }
    setHidden(el.done, true);
    setHidden(el.signedOut, false);
    if (el.signInButton) el.signInButton.disabled = false;
    setStatus(null);
    renderList();
  }

  function showSignedIn(user) {
    if (accountDeleted) return;
    const same = signedInUser && signedInUser.uid === user.uid;
    signedInUser = user;
    setHidden(el.checking, true);
    setHidden(el.signedOut, true);
    setHidden(el.done, true);
    setHidden(el.signedIn, false);
    if (el.email) el.email.textContent = user.email || "";
    signInMessage = null;
    renderSignInMessage();
    if (same) return;
    if (hasLibrary) {
      setStatus(null);
      void loadLibrary();
    }
    if (hasAccount) {
      accountMessage = null;
      renderAccountMessage();
      el.confirmInput.value = "";
      updateAccountButton();
    }
  }

  function showUnavailable() {
    setHidden(el.checking, true);
    setHidden(el.signedOut, false);
    setHidden(el.signedIn, true);
    if (el.signInButton) el.signInButton.disabled = true;
    signInMessage = { key: "sdkFailed" };
    renderSignInMessage();
  }

  // ---------------------------------------------------------------- events

  el.signInButton.addEventListener("click", async () => {
    signInMessage = null;
    renderSignInMessage();
    el.signInButton.disabled = true;
    try {
      await deps.signIn();
    } catch (error) {
      const code = error && error.code ? String(error.code) : "";
      const key =
        code === "auth/popup-blocked" ? "signInBlocked"
        : code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request" ? "signInCancelled"
        : code === "auth/network-request-failed" ? "signInNetwork"
        : code === "auth/unauthorized-domain" ? "signInDomain"
        : "signInFailed";
      signInMessage = { key };
      renderSignInMessage();
    } finally {
      if (!signedInUser) el.signInButton.disabled = false;
    }
  });
  if (el.signOutButton) {
    el.signOutButton.addEventListener("click", async () => {
      try {
        await deps.signOut();
      } catch {
        // the state listener decides what to show
      }
    });
  }
  if (el.retry) {
    el.retry.addEventListener("click", () => {
      setStatus(null);
      void loadLibrary();
    });
  }
  if (hasAccount) {
    el.confirmInput.addEventListener("input", updateAccountButton);
    el.accountButton.addEventListener("click", () => void deleteAccount());
  }
  if (typeof MutationObserver !== "undefined") {
    new MutationObserver(() => {
      const next = languageOf();
      if (next !== language) {
        language = next;
        applyStrings();
      }
    }).observe(doc.documentElement, { attributes: true, attributeFilter: ["lang"] });
  }

  setHidden(el.checking, false); // the markup starts hidden, so nothing shows without JavaScript
  applyStrings();
  updateAccountButton();

  return { showSignedIn, showSignedOut, showUnavailable };
}
