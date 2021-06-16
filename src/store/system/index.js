import _ from "lodash";
import fetch from "@/services/fetch";
const state = {
  agent_id:'',
  agentList:[],//代理列表
  auth_selected_ids: [], //{id:23,customer_ids:[],plate_ids:[]}
  active_route: ''
};

const mutations = {
  UPDATE_AUTH_SELECTED_IDS(state, arr) {
    state.auth_selected_ids = arr;
  },
  UPDATE_AGENT_LIST(state, arr) {
    state.agentList = arr;
  },
  UPDATE_AGENT_ID(state, val) {
    state.agent_id = val;
  },
  UPDATE_ACTIVE_ROUTE(state, value) {
    state.active_route = value
  }
};
const actions = {
  update_agent_list({ state, dispatch, commit }, list) {
    commit("UPDATE_AGENT_LIST", list);
  },
  update_agent_list_by_id_name({ state, dispatch, commit }, { id, name }) {
    let list = _.cloneDeep(state.agentList);
    let obj = list.find(i => i.id == id);
    if (obj) {
      obj.name = name;
      commit("UPDATE_AGENT_LIST", list);
    }
  },
  update_agent_id({ state, dispatch, commit }, id) {
    commit("UPDATE_AGENT_ID", id);
  },
  set_agent_list({ state, dispatch, commit }) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/agent/agentlist")
        .then(res => {
          if (res.length && !state.agent_id) {
            let id = res[0]["id"];
            dispatch("update_agent_id", id);
          }
          dispatch("update_agent_list", res);
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  reset_auth_selected_ids({ state, dispatch, commit }) {
    commit("UPDATE_AUTH_SELECTED_IDS", []);
  },
  pop_auth_selected_ids_by_id({ state, dispatch, commit }, id) {
    let arr = _.cloneDeep(state.auth_selected_ids);
    let index = arr.findIndex(i=>i.id==id);
    if (index!=-1) {
      arr.splice(index,1);
      commit("UPDATE_AUTH_SELECTED_IDS", arr);
    }
  },
  update_auth_selected_ids_add_plate_ids({ state, dispatch, commit }, id) {
    let arr = _.cloneDeep(state.auth_selected_ids);
    for (let item of arr) {
      if (!Array.isArray(item.plate_ids)) {
        item.plate_ids = [];
      }
      if (!item.plate_ids.includes(id)) {
        item.plate_ids.push(id);
      }
    }
    commit("UPDATE_AUTH_SELECTED_IDS", arr);
  },
  update_auth_selected_ids({ state, dispatch, commit }, obj) {
    let tem = _.cloneDeep(state.auth_selected_ids);
    let index = tem.findIndex(i => i.id == obj.id);
    if (index !== -1) {
      tem[index] = obj;
    } else {
      tem.push(obj);
    }
    commit("UPDATE_AUTH_SELECTED_IDS", tem);
  },
  update_active_route({commit}, data) {
    commit('UPDATE_ACTIVE_ROUTE', data)
  }
};
const getters = {
  getSelectedCustomerById: state => id => {
    let obj = state.auth_selected_ids.find(i => i.id == id);
    if (!obj) {
      return {
        customer_ids: [],
        plate_ids: []
      };
    } else {
      return obj;
    }
  },
  getCustomerDisabledDataById: state => id => {
    let tem = _.cloneDeep(state.auth_selected_ids);
    let arr = tem.filter(i => i.id != id);
    let rs = [];
    for (let i of arr) {
      rs.push(...i.customer_ids);
    }
    return rs;
  },
  getPlateDisabledDataById: state => id => {
    let tem = _.cloneDeep(state.auth_selected_ids);
    let arr = tem.filter(i => i.id != id);
    let rs = [];
    for (let i of arr) {
      rs.push(...i.plate_ids);
    }
    //规则管理的id
    let result = rs.find(i=>i=='2_16')
    // console.log('result==',result)
    return result?[result]:[];
  }
};
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
