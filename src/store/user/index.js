import fetch from "@/services/fetch";

const state = {
  token: 0,
  site_type: [],
  username: "",
  user_id: "",
  truename: "",
  role:{},
  isFirstVisit: true, //是否首次进入该账号
  languageInfo: 'zh'  // 默认中文
};
const getters = {
  isLogin: state => {
    return state.token == "1";
  },
  isRoot: state => {
    return state.user_id == "1";
  }
};
const mutations = {
  UPDATE_TOKEN(state, value) {
    state.token = value;
  },
  UPDATE_ISFIRST_VISIT(state, value) {
    if (value == "1") {
      state.isFirstVisit = true;
    } else {
      state.isFirstVisit = false;
    }
  },

  UPDATE_SITE_TYPE(state, value) {
    state.site_type = value;
  },
  UPDATE_ROLE(state, value) {
    state.role = value;
  },
  UPDATE_USERNAME(state, value) {
    state.username = value;
  },
  UPDATE_TRUENAME(state, value) {
    state.truename = value;
  },
  UPDATE_USER_ID(state, value) {
    state.user_id = value;
  },
  UPDATE_SYSTEM_LANGUAGE_INFO(state, value) {
    state.languageInfo = value
    window.document.cookie = "language" + "=" + value
  }
};
const actions = {
  login({ getters, commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/login/check", data)
        .then(data => {
          commit("UPDATE_TOKEN", 1);
          commit("UPDATE_SITE_TYPE", data.site_type);
          commit("UPDATE_ROLE", data.role);
          commit("UPDATE_USERNAME", data.username);
          commit("UPDATE_USER_ID", data.id);
          commit("UPDATE_ISFIRST_VISIT", data.is_new); //是否首次登录let data = res.data;
          commit("UPDATE_TOKEN", 1);
          commit("UPDATE_SITE_TYPE", data.site_type);
          commit("UPDATE_ROLE", data.role);
          commit("UPDATE_TRUENAME", data.truename);
          commit("UPDATE_ISFIRST_VISIT", data.is_new); //是否首次登录
          commit('UPDATE_SYSTEM_LANGUAGE_INFO', data.language)
          dispatch("permissions/clear_permission", {}, { root: true });
          if (getters.isRoot) {
            dispatch("system/update_agent_id", "", { root: true });
            dispatch("system/set_agent_list", {}, { root: true });
          }
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  // logout({ commit, dispatch }, data) {
  logout({ commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fetch
        .get("/login/logout")
        .then(res => {
          dispatch("remove_login_info");
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  remove_login_info({ commit, dispatch }) {
    commit("UPDATE_TOKEN", 0);
    commit("UPDATE_SITE_TYPE", []);
    commit("UPDATE_ROLE", "");
    commit("UPDATE_USERNAME", "");
    dispatch("project/clear_projectInfo", {}, { root: true });
    
    return Promise.resolve();
  },
  update_system_language_info({commit}, value) {
    commit('UPDATE_SYSTEM_LANGUAGE_INFO', value)
  }
};
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
