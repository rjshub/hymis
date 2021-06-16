import axios from "axios";
import { Message, MessageBox } from "element-ui";
import router from "@/router";
import store from "@/store";

let paramsSerializer = function (params) {
  let parts = [];
  for (let key in params) {
    let val = params[key];
    if (val === null || typeof val === "undefined") {
      continue;
    }
    if (Array.isArray(val)) {
      val = JSON.stringify(val);
    }
    parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(val));
  }
  let result = parts.join("&");
  return result;
};
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
let instance = axios.create({
  baseURL: "/api",
  timeout: 600000,
  // timeout: 100000,
  // headers: 'aaa',
  paramsSerializer: function (params) {
    return paramsSerializer(params);
  }
});

let paramPost = function (data) {
  var params = new URLSearchParams();
  for (let name in data) {
    params.append(name, data[name]);
  }
  return params;
};
const i18n = store.state.theme.languageInfo
let [title, msg, text] = ['','','']
if (i18n === 'zh') {
  title = '提示'
  msg = '登录信息过期，请重新登录'
  text = '确定'
} else {
  title = 'Point'
  msg = 'Login information expired, please do again.'
  text = 'Yes'
}

let isLogonExpires = false;
instance.interceptors.response.use(res => {
  let data = res.data;
  /* if (res.config.url == "/api/user/loginstatus" && res.data.ret == 0) {
    //登陆成功后对保存过期状态
    localStorage.setItem("isExpires", "1"); //0过期，1不过期
  } */

  if (Object.prototype.toString.call(data) === "[object Object]") {
    if (data.hasOwnProperty("ret")) {
      if (data.ret == 0) {
        return data.data;
      } else if (data.ret == 2) {
        if (!isLogonExpires) {
          isLogonExpires = true;
          MessageBox({
            title: title,
            message: msg,
            confirmButtonText: text,
            callback: action => {
              store.dispatch("system/update_active_route")
              store.dispatch("user/remove_login_info").then(() => {
                isLogonExpires = false;
                router.push("/login");
              });
            }
          });
        }

      } else {
        return Promise.reject(new Error(data.msg));
      }
    } else {
      console.error("request.data.ret does not exist");
      return Promise.reject(new Error("服务器异常，请联系系统管理员！"));
      // return Promise.reject(new Error("request.data.ret does not exist"));
    }
  } else {
    console.error("request.data is not Object");
    return Promise.reject(new Error("服务器异常，请联系系统管理员！"));
    // return Promise.reject(new Error("request.data is not Object"));
  }
});
export default instance;
