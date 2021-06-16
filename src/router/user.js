/*
 * 用户登录
 */
import store from "@/store";

import Login from "@/views/login";

let isLogin = () => {
  return store.getters["user/isLogin"];
};

const routes = [
  {
    path: "/",
    redirect: "/login"
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    beforeEnter: (to, from, next) => {
      next();
      let redirect = to.query.redirect;
      if (isLogin() && redirect) {
        next(redirect);
      } else if (isLogin()) {
        next("/project");
      } else {
        next();
      }
    }
  },
  {
    path: "/logout",
    beforeEnter(to, from, next) {
      store
        .dispatch("user/logout")
        .then(res => {
          next("/login");
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
];

export default routes;
