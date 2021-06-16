import _ from "lodash";
const state = {
  targetCost: {},
  tabList: [] //{name: 'adjust',label:"调整"}
};
const getters = {
  
};
const mutations = {
  UPDATE_TARGET_COST(state, value) {
    state.targetCost = value;
  },
  CLEAR_TAB_LIST(state, value) {
    state.tabList = [];
  },
  ADD_TAB_LIST(state, value) {
    let arr = _.cloneDeep(state.tabList);
    if (arr.indexOf(value) == -1) {
      arr.push(value);
      state.tabList = arr;
    }
  },
  POP_TAB_LIST(state, value) {
    let arr = _.cloneDeep(state.tabList);
    // arr.filter(i => i != value);
    state.tabList = arr.filter(i => i != value);
  }
};
const actions = {
  update_target_cost({ commit }, val) {
    commit("UPDATE_TARGET_COST", val);
  },
  add_tab_list({ commit }, val) {
    commit("ADD_TAB_LIST", val);
  },
  clear_tab_list({ commit }) {
    commit("CLEAR_TAB_LIST");
  },
  pop_tab_list({ commit }, val) {
    commit("POP_TAB_LIST", val);
  }
};
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
