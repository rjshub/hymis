import Vue from "vue";
import Router from "vue-router";
import store from "@/store";
// pd路由
import userRoute from "./user";
import systemRoute from "./system";
import strategyRoute from "./strategy";
import errorRoute from "./error";
import projectRoute from "./project";
import budgetRoute from "./budget";
import elm from "element-ui";

/*import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)*/

Vue.use(Router);

let isLogin = () => {
  return store.getters["user/isLogin"];
};

let routes = [].concat(
  userRoute,
  systemRoute,
  errorRoute,
  strategyRoute,
  projectRoute,
  budgetRoute,
);

const router = new Router({
  routes: routes
});
// 不需要登录的路径
const whiteList = ["/login", "/404", "/test", "/foo"];
//未开发的路由
const unOpenedList = ["/history"];
//没有权限的路由
const noAuthList = ["/nosystem", "/noprojectcreate"];

router.beforeEach((to, from, next) => {
  if (unOpenedList.indexOf(to.path) >= 0) {
    next(false);
    elm.Message.info("敬请期待");
    return;
  }
  if (noAuthList.indexOf(to.path) >= 0) {
    next(false);
    elm.Message.info("暂无权限");
    return;
  }
  if (whiteList.indexOf(to.path) >= 0) {
    next();
  } else if (isLogin()) {
    next();
  } else {
    next({
      path: "/login",
      query: { redirect: to.fullPath }
    });
  }
});

export default router;
