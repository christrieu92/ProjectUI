import firebase from "../firebase";
import CookieService from "../CookieService";

const AuthService = {
  handleLoginSuccess(response, userId, remember) {
    var userToken = Promise.resolve(response);
    const expiresAt = 60 * 24;

    userToken.then(async function (idToken) {
      CookieService.set("userId", userId, { path: "/" });

      if (!remember) {
        const options = { path: "/" };
        CookieService.set(
          "access_token",
          idToken.refreshedToken.token,
          options
        );
      } else {
        let date = new Date();
        date.setTime(date.getTime() + expiresAt * 60 * 1000);
        const options = { path: "/", expires: expiresAt };

        CookieService.set(
          "access_token",
          idToken.refreshedToken.token,
          options
        );
      }
      return true;
    });
  },
  setUserId(userId) {
    CookieService.set("userId", userId, { path: "/" });
  },
  setCalendarId(calendarId) {
    CookieService.set("calendarId", calendarId, { path: "/" });
  },
  getToken() {
    return CookieService.get("access_token");
  },
  getUserId() {
    return CookieService.get("userId");
  },
  getCalendarId() {
    return CookieService.get("calendarId");
  },
  removeCalendarId() {
    return CookieService.remove("calendarId");
  },
  githubOAuth() {
    return new firebase.firebase_.auth.GithubAuthProvider();
  },
  twitterOAuth() {
    return new firebase.firebase_.auth.TwitterAuthProvider();
  },
  facebookOAuth() {
    return new firebase.firebase_.auth.FacebookAuthProvider();
  },
};
//    console.log(idToken.refreshedToken.token);
//    console.log(idToken.refreshedToken.expirationTime);

export default AuthService;
