import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);
//pd缓存
import user from "./user";
import project from "./project";
import system from "./system";
import permissions from "./permissions";
import theme from "./theme"
import budget from './budget'

const state = {
  scrollTop:0,

};
const getters = {
  isShowToTop: state => {
    return state.scrollTop>0;
  }
};
const mutations = {
  UPDATA_SCROLLTOP(state, value) {
    state.scrollTop = value;
  },
};
const actions = {
  updata_scrolltop({ commit }, value) {
    commit("UPDATA_SCROLLTOP", value);
  },
};
const modules = {
  user,
  project,
  system,
  permissions,
  theme,
  budget
};
export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules,
  plugins: [createPersistedState()],
  strict: process.env.NODE_ENV !== "production" //在生产环境启用导致性能损失
});
