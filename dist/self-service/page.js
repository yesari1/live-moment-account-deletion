// Sign-in and self-service pages (Delete data, Delete account): wires the page logic (app.js) to
// Google sign-in (Firebase Authentication, modular web SDK from gstatic.com). The SDK is loaded
// here, and only on those pages, so that a blocked or offline load shows a message instead of a
// dead page.
import { createSelfService } from "./app.js";

const SDK = "https://www.gstatic.com/firebasejs/12.6.0";
const config = window.LIVE_MOMENT_WEB;

let sdk = null;
let auth = null;

function googleProvider() {
  const provider = new sdk.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return provider;
}

const page = createSelfService({
  apiBase: config.apiBase,
  signIn: () => sdk.signInWithPopup(auth, googleProvider()),
  signOut: () => sdk.signOut(auth),
  getToken: (forceRefresh) => auth.currentUser.getIdToken(Boolean(forceRefresh)),
  authAgeSeconds: async () => {
    const result = await auth.currentUser.getIdTokenResult();
    return Date.now() / 1000 - Number(result.claims.auth_time);
  },
  reauthenticate: () => sdk.reauthenticateWithPopup(auth.currentUser, googleProvider()),
});

(async () => {
  try {
    const [appModule, authModule] = await Promise.all([
      import(`${SDK}/firebase-app.js`),
      import(`${SDK}/firebase-auth.js`),
    ]);
    sdk = authModule;
    auth = authModule.getAuth(appModule.initializeApp(config.firebase));
    authModule.onAuthStateChanged(auth, (user) => {
      if (user) page.showSignedIn({ uid: user.uid, email: user.email });
      else page.showSignedOut();
    });
  } catch (error) {
    console.error("Google sign-in could not be loaded", error);
    page.showUnavailable();
  }
})();
