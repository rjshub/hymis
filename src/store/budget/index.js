import fetch from "@/services/fetch";

const state = {
  is_fromback: false, //是否从返回过来到list
  handle_type: 'create', //操作类型
  customer_list: [],
  brand_list: [],
  product_list: [],
  port_list: [],
  customerID: "",
  customerName: "",
  budgetID: "",
  budgetName: "",
  selectValue: ""
}
const mutations = {
  UPDATE_IS_FROMBACK(state, value) {
    state.is_fromback = value;
  },
  UPDATE_HANDLE_TYPE(state, value) {
    state.handle_type = value
  },
  // 过滤
  UPDATE_CUSTOMER_LIST(state, value) {
    state.customer_list = value;
  },
  UPDATE_BRAND_LIST(state, value) {
    state.brand_list = value;
  },
  UPDATE_PRODUCT_LIST(state, value) {
    state.product_list = value;
  },
  UPDATE_PORT_LIST(state, value) {
    state.port_list = value;
  },
  // 所选客户信息
  UPDATE_CUSTOMER_ID(state, value) {
    state.customerID = value;
  },
  UPDATE_CUSTOMER_NAME(state, value) {
    state.customerName = value;
  },
  // 项目信息
  UPDATE_BUDGET_ID(state, value) {
    state.budgetID = value;
  },
  UPDATE_BUDGET_NAME(state, value) {
    state.budgetName = value;
  },
  // 筛选信息
  UPDATE_SELECT_VALUE(state, value) {
    state.selectValue = value
  }
}

const actions = {
  update_is_fromback({ commit }, bool) {
    commit("UPDATE_IS_FROMBACK", bool);
  },
  update_handle_type({commit}, data) {
    commit("UPDATE_HANDLE_TYPE", data)
  },
  // 更新筛选框option
  fetch_selectlists({
    state,
    commit
  }, params) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/projects/selectlists", params)
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  fetch_customer_port_list({
    state,
    commit,
    dispatch
  }, payload) {
    return new Promise((resolve, reject) => {
      let params = {
        menu: payload.menu,
        industry_id: payload.industry_id
      };
      dispatch("fetch_selectlists", params)
        .then(data => {
          commit("UPDATE_CUSTOMER_LIST", data.customerlists);
          commit("UPDATE_PORT_LIST", data.portlists);
          resolve({
            customer_list: data.customerlists,
            port_list: data.portlists
          });
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  fetch_brand_list({
    state,
    commit,
    dispatch
  }, payload) {
    return new Promise((resolve, reject) => {
      let params = {
        customer_id: payload.customer_id,
        menu: payload.menu
      };
      dispatch("fetch_selectlists", params)
        .then(data => {
          commit("UPDATE_BRAND_LIST", data.brandlists);
          resolve({
            brand_list: data.brandlists
          });
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  fetch_product_list({
    state,
    commit,
    dispatch
  }, payload) {
    return new Promise((resolve, reject) => {
      let params = {
        customer_id: payload.customer_id,
        brand_id: payload.brand_id,
        menu: payload.menu
      };
      dispatch("fetch_selectlists", params)
        .then(data => {
          commit("UPDATE_PRODUCT_LIST", data.productlists);
          resolve({
            product_list: data.productlists
          });
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  fetch_project_list({
    state,
    commit,
    dispatch
  }, payload) {
    return new Promise((resolve, reject) => {
      let params = {
        customer_id: payload.customer_id,
        brand_id: payload.brand_id,
        product_id: payload.product_id,
        menu: payload.menu
      };
      dispatch("fetch_selectlists", params)
        .then(data => {
          resolve({
            project_list: data.display_projectlists
          });
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  update_customer_id({ commit }, id) {
    commit("UPDATE_CUSTOMER_ID", id);
  },
  update_customer_name({ commit }, name) {
    commit("UPDATE_CUSTOMER_NAME", name);
  },

  update_budget_id({ commit }, id) {
    commit("UPDATE_BUDGET_ID", id);
  },
  update_budget_name({ commit }, name) {
    commit("UPDATE_BUDGET_NAME", name);
  },
  update_select_value({commit}, data) {
    commit("UPDATE_SELECT_VALUE", data)
  }
}

export default {
  namespaced: true,
  state,
  // getters,
  mutations,
  actions,
  // modules
};
