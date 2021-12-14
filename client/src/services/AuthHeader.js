import { AccessTokenValidation } from "../helper/accessTokenValidation.js";
import { store } from "../store";
import router from "../router/index.js";

export default function authHeader() {
  let user = JSON.parse(localStorage.getItem("user"));

  if (user && user.accessToken) {
    let loggedIn = AccessTokenValidation.parseJwt(user.accessToken);

    if (loggedIn.exp < Date.now() / 1000) {
      // token expired
      loggedIn = false;
      store.dispatch("user/logout");
      router.push("/login");
    } else {
      return { "x-access-token": user.accessToken };
    }
  }
}
