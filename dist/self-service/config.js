// Configuration of the sign-in and self-service pages (Delete data, Delete account).
// A Firebase web app config only names the project (Google documents it as public, it is
// not a secret); what protects the data is the sign-in and the API's checks of the ID token.
// apiBase is the Live Moment API (Cloud Run), which allows this site's origin through CORS.
window.LIVE_MOMENT_WEB = Object.freeze({
  apiBase: "https://living-memories-api-okmceddtoa-uc.a.run.app",
  firebase: Object.freeze({
      "apiKey": "AIzaSyAxeW6HlFB9cM8ANmcCSQhvutfGs3EbgTc",
      "authDomain": "living-memories-staging.firebaseapp.com",
      "projectId": "living-memories-staging",
      "appId": "1:657614948972:web:01bba8f1801c1106722649"
  }),
});
