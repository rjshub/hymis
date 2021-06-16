import fetch from "@/services/fetch";
import componentCompute from "./component-compute";
import { Message, MessageBox } from "element-ui";

const nameMap = {
  basic_info_status: "项目基本信息",
  basic_data_status: "Basic Data",
  reach_goal_status: "Reach Goal",
  goal_cpm_status: "目标CPM",
  score_card_status: "Score Card",
  reach_curve_status: "Reach Curve",
  computing_status: "提交数据",
  cmp_compute_status: "分量计算表",
  cmp_table_status: "分量表",
  schedule_table_status: "排期表",
  overlapping_stauts: "Overlapping"
};
const nameMap_en = {
  basic_info_status: "Project Info",
  basic_data_status: "Basic Data",
  reach_goal_status: "Reach Goal",
  goal_cpm_status: "Target CPM",
  score_card_status: "Score Card",
  reach_curve_status: "Reach Curve",
  computing_status: "Submit Data",
  cmp_compute_status: "Budget Allocation Table",
  cmp_table_status: "Allocation Table",
  schedule_table_status: "Spotplan Table",
  overlapping_stauts: "Overlapping"
};
const statusOrder = [
  "basic_info_status",
  "goal_cpm_status",
  "basic_data_status",
  "reach_curve_status",
  "score_card_status",
  "computing_status",
  "cmp_compute_status",
  "cmp_table_status",
  "schedule_table_status"
];
const state = {
  is_fromback: false, //是否从返回过来到list
  activeStep: 1, //step 当前高亮的值
  projectID: "",
  projectName: "",
  customerID: "",
  customerName: "",
  pageType: "", //ProjectManage  or   ProjectArchive
  version: "",
  versionList: [],
  curVersion: "",
  // disabled\enable\active

  //服务器记录完成到了哪一步
  processingStep: {
    //服务器记录的processing 完成到了哪一步
    main: "1",
    sub: ""
  },
  //disabled enable active
  basic_info_status: "enable",
  basic_data_status: "disabled",
  // _basic_data_status: "disabled",
  goal_cpm_status: "disabled",
  score_card_status: "disabled",
  reach_curve_status: "disabled",
  computing_status: "disabled",
  cmp_compute_status: "disabled",
  cmp_table_status: "disabled",
  schedule_table_status: "disabled",

  industry_list:[],//行业数据
  customer_list: [],
  brand_list: [],
  product_list: [],
  port_list: [],
  log_info: [],
  preview_data: "" //预览数据
};

const mutations = {
  UPDATE_VERSION_LIST(state, value) {
    state.versionList = value;
  },
  UPDATE_CURVERSION(state, value) {
    state.curVersion = value;
  },
  UPDATE_VERSION(state, value) {
    state.version = value;
  },
  UPDATE_IS_FROMBACK(state, value) {
    state.is_fromback = value;
  },
  UPDATE_PAGE_TYPE(state, value) {
    state.pageType = value;
  },
  UPDATE_PREVIEW_DATA(state, value) {
    state.preview_data = value;
  },
  UPDATE_ACTIVE_STEP(state, value) {
    state.activeStep = value;
  },
  UPDATE_LOG_INFO(state, value) {
    state.log_info = value;
  },
  UPDATE_INDUSTRY_LIST(state, value) {
    state.industry_list = value;
  },
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
  UPDATE_SERVER_STEP_STATUS(state, value) {
    state.processingStep = value;
  },
  UPDATE_PROJECT_ID(state, value) {
    state.projectID = value;
  },
  UPDATE_PROJECTNAME(state, value) {
    state.projectName = value;
  },
  UPDATE_CUSTOMER_ID(state, value) {
    state.customerID = value;
  },
  UPDATE_CUSTOMER_NAME(state, value) {
    state.customerName = value;
  },
  /* -----分界线------ */
  UPDATA_BASIC_INFO_STATUS(state, value) {
    state.basic_info_status = value;
  },
  UPDATA_BASIC_DATA_STATUS(state, value) {
    state.basic_data_status = value;
  },
  /* UPDATA__BASIC_DATA_STATUS(state, value) {
    state._basic_data_status = value;
  }, */
  UPDATA_SCORE_CARD_STATUS(state, value) {
    state.score_card_status = value;
  },
  UPDATA_REACH_CURVE_STATUS(state, value) {
    state.reach_curve_status = value;
  },
  UPDATA_COMPUTING_STATUS(state, value) {
    state.computing_status = value;
  },
  UPDATA_CMP_COMPUTE_STATUS(state, value) {
    state.cmp_compute_status = value;
  },
  UPDATA_CMP_TABLE_STATUS(state, value) {
    state.cmp_table_status = value;
  },
  UPDATE_GOAL_CPM_STATUS(state, value) {
    // debugger;
    state.goal_cpm_status = value;
  },
  UPDATA_SCHEDULE_TABLE_STATUS(state, value) {
    state.schedule_table_status = value;
  }
};
const actions = {
  clear_projectInfo({ state, commit, dispatch }) {
    dispatch("update_project_id", "");
    dispatch("update_project_name", "");
    dispatch("update_customer_id", "");
    dispatch("update_customer_name", "");
    dispatch("update_is_fromback", false);
  },
  //更新预览、日志、流程图高亮的状态
  updata_preview_log_step_status({ state, commit, dispatch }) {
    dispatch("fetch_preview_data");
    dispatch("fetch_step_status");
    dispatch("fetch_log_info");
  },
  fetch_preview_data({ state, commit }) {
    return new Promise((resolve, reject) => {
      if (state.projectID) {
        fetch
          .post("/projects/previewarealist", { project_id: state.projectID, version: state.curVersion })
          .then(res => {
            commit("UPDATE_PREVIEW_DATA", res);
            resolve(res);
          })
          .catch(err => {
            Message({ message: err.message, type: "error" });
            reject(err);
          });
      } else {
        commit("UPDATE_PREVIEW_DATA", "");
        resolve("");
        Message({ message: err.message, type: "error" });
      }
    });
  },

  fetch_log_info({ state, commit }) {
    return new Promise((resolve, reject) => {
      if (state.projectID) {
        fetch
          .post("/runlog/runloglist", { project_id: state.projectID, version: state.curVersion })
          .then(data => {
            commit("UPDATE_LOG_INFO", data);
            resolve();
          })
          .catch(err => {
            reject(err);
          });
      } else {
        resolve("projectID is none");
      }
    });
  },
  fetch_selectlists({ state, commit }, params) {
    return new Promise((resolve, reject) => {
      if (state.pageType == "ProjectArchive") {
        Object.assign(params, { status: 2 });
      }

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
  //行业
  fetch_industry_list({ state, commit, dispatch }) {
    return new Promise((resolve, reject) => {
      fetch.post("/customers/industrylist")
        .then(data => {
          commit("UPDATE_INDUSTRY_LIST", data);
          resolve({ industry_list: data});
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  fetch_customer_port_list({ state, commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      let params = { menu: payload.menu,industry_id:payload.industry_id};
      dispatch("fetch_selectlists", params)
        .then(data => {
          commit("UPDATE_CUSTOMER_LIST", data.customerlists);
          commit("UPDATE_PORT_LIST", data.portlists);
          resolve({ customer_list: data.customerlists, port_list: data.portlists });
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  fetch_brand_list({ state, commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      let params = { customer_id: payload.customer_id, menu: payload.menu };
      dispatch("fetch_selectlists", params)
        .then(data => {
          commit("UPDATE_BRAND_LIST", data.brandlists);
          resolve({ brand_list: data.brandlists });
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  fetch_product_list({ state, commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      let params = { customer_id: payload.customer_id, brand_id: payload.brand_id, menu: payload.menu };
      dispatch("fetch_selectlists", params)
        .then(data => {
          commit("UPDATE_PRODUCT_LIST", data.productlists);
          resolve({ product_list: data.productlists });
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  fetch_project_list({ state, commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      let params = {
        customer_id: payload.customer_id,
        brand_id: payload.brand_id,
        product_id: payload.product_id,
        menu: payload.menu
      };
      dispatch("fetch_selectlists", params)
        .then(data => {
          resolve({ project_list: data.projectlists });
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  //向服务端更新当前做到第几步了
  fetch_update_current_status({ commit }, status) {
    return new Promise((resolve, reject) => {
      fetch
        .post("/login/check", status)
        .then(res => {
          if (res.ret == 0) {
            commit("UPDATE_SERVER_STEP_STATUS", status);
            resolve();
          } else {
            reject(new Error(res.msg));
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },
  update_project_id({ commit }, id) {
    commit("UPDATE_PROJECT_ID", id);
  },
  update_page_type({ commit }, type) {
    commit("UPDATE_PAGE_TYPE", type);
  },
  update_version_list({ commit, state }, val) {
    return new Promise((resolve, reject) => {
      if (state.projectID) {
        fetch
          .post("/projects/historylists", { project_id: state.projectID })
          .then(res => {
            commit("UPDATE_VERSION_LIST", res);
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      } else {
        commit("UPDATE_VERSION_LIST", []);
        resolve([]);
      }
    });
  },
  update_version({ commit }, val) {
    commit("UPDATE_VERSION", val);
  },
  update_curVersion({ commit }, val) {
    commit("UPDATE_CURVERSION", val);
  },
  update_is_fromback({ commit }, bool) {
    commit("UPDATE_IS_FROMBACK", bool);
  },
  update_project_name({ commit }, name) {
    commit("UPDATE_PROJECTNAME", name);
  },
  update_customer_id({ commit }, id) {
    commit("UPDATE_CUSTOMER_ID", id);
  },
  update_customer_name({ commit }, name) {
    commit("UPDATE_CUSTOMER_NAME", name);
  },
  fetch_step_status({ state, commit, dispatch }) {
    return new Promise((resolve, reject) => {
      if (state.projectID) {
        fetch
          .post("/projects/projectstepstatus", { project_id: state.projectID, version: state.curVersion })
          .then(res => {
            //重置所有状态
            dispatch("reset_all_status");
            for (const item of statusOrder) {
              if (res.includes(item)) {
                dispatch("update_" + item, "active");
              }
            }
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      }
    });
  },
  //对basic_info来说只有enable、active状态
  update_basic_info_status({ state, dispatch, commit }, val) {
    commit("UPDATA_BASIC_INFO_STATUS", val);
    if (val == "active") {
      commit("UPDATA_SCORE_CARD_STATUS", "enable");
      commit("UPDATA_BASIC_DATA_STATUS", "enable");
    }
  },
  update_goal_cpm_status({ state, dispatch, commit }, val) {
    commit("UPDATE_GOAL_CPM_STATUS", val);
    /* if (val == "active") {
      commit("UPDATA_REACH_CURVE_STATUS", "disabled");
      if (state.score_card_status == "active") {
        commit("UPDATA_COMPUTING_STATUS", "enable");
      }
    } */
  },
  //disabled enable active
  update_basic_data_status({ state, dispatch, commit }, val) {
    commit("UPDATA_BASIC_DATA_STATUS", val);
    if (val == "active") {
      if (state.goal_cpm_status == "active") {
        commit("UPDATA_REACH_CURVE_STATUS", "disabled");
        if (state.score_card_status == "active") {
          commit("UPDATA_COMPUTING_STATUS", "enable");
        }
      } else {
        commit("UPDATA_REACH_CURVE_STATUS", "enable");
      }
    }
  },
  /* update__basic_data_status({ state, dispatch, commit }, val) {
    commit("UPDATA__BASIC_DATA_STATUS", val);
    if (val == "active") {
      commit("UPDATA_REACH_CURVE_STATUS", "enable");
    }
  }, */
  update_score_card_status({ state, dispatch, commit }, val) {
    commit("UPDATA_SCORE_CARD_STATUS", val);
    if (val == "active" && state.basic_data_status == "active") {
      if (state.goal_cpm_status == "active") {
        if (state.basic_data_status == "active") {
          commit("UPDATA_COMPUTING_STATUS", "enable");
        }
      } else {
        if (state.reach_curve_status == "active") {
          commit("UPDATA_COMPUTING_STATUS", "enable");
        }
      }
    }
  },
  update_reach_curve_status({ state, dispatch, commit }, val) {
    commit("UPDATA_REACH_CURVE_STATUS", val);
    if (val == "active" && state.score_card_status == "active" && state.basic_data_status == "active") {
      commit("UPDATA_COMPUTING_STATUS", "enable");
    }
  },
  update_computing_status({ state, commit }, val) {
    commit("UPDATA_COMPUTING_STATUS", val);
    if (val == "active") {
      commit("UPDATA_CMP_COMPUTE_STATUS", "disabled");
    }
  },
  update_cmp_compute_status({ state, commit }, val) {
    commit("UPDATA_CMP_COMPUTE_STATUS", val == "active" ? "enable" : val);
    if (val == "active") {
      commit("UPDATA_COMPUTING_STATUS", "complete");
    }
  },
  update_cmp_table_status({ commit }, val) {
    commit("UPDATA_CMP_TABLE_STATUS", val);
    if (val == "active") {
      commit("UPDATA_CMP_COMPUTE_STATUS", "active");
      commit("UPDATA_SCHEDULE_TABLE_STATUS", "enable");
    }
  },
  update_schedule_table_status({ commit }, val) {
    commit("UPDATA_SCHEDULE_TABLE_STATUS", val);
  },
  //初始化状态 新建项目时使用
  reset_all_status({ state, dispatch, commit }) {
    let arr = [
      "UPDATA_BASIC_INFO_STATUS",
      "UPDATA_BASIC_DATA_STATUS",
      // "UPDATA__BASIC_DATA_STATUS",
      "UPDATE_GOAL_CPM_STATUS",
      "UPDATA_SCORE_CARD_STATUS",
      "UPDATA_REACH_CURVE_STATUS",
      "UPDATA_COMPUTING_STATUS",
      "UPDATA_CMP_COMPUTE_STATUS",
      "UPDATA_CMP_TABLE_STATUS",
      "UPDATA_SCHEDULE_TABLE_STATUS"
    ];
    for (let i = 0; i < arr.length; i++) {
      let val = "disabled";
      if (i == 0) {
        val = "enable";
      }
      commit(arr[i], val);
    }
  },
  //禁用第二步之后的所有状态
  disabled_after_step2_status({ state, dispatch, commit }) {
    let arr = [
      "UPDATA_COMPUTING_STATUS",
      "UPDATA_CMP_COMPUTE_STATUS",
      "UPDATA_CMP_TABLE_STATUS",
      "UPDATA_SCHEDULE_TABLE_STATUS"
    ];
    for (let i = 0; i < arr.length; i++) {
      commit(arr[i], "disabled");
    }
  },
  update_active_step({ commit }, value) {
    commit("UPDATE_ACTIVE_STEP", value);
  }
};
const getters = {
  log_info_render: (state, getters, rootState) => {
    const lang = rootState.user.languageInfo
    let rs = [];
    if (state.log_info) {
      for (let item of state.log_info) {
        let name = nameMap[item.step];
        if (lang === 'en') {
          name = nameMap_en[item.step]
        }
        let time = item.ctime;
        if (item.step == "computing_status") {
          let obj = { name: time+' '+"分量计算进行中…" };
          if (lang === 'en') {
            obj = { name: time+' '+" budget allocation is calculating..." };
          }
          rs.push(obj);
        } else if (item.step == "reach_goal_status" || item.step == "goal_cpm_status") {
          let obj2 = { name: time + ' ' +name + "上传完成" };
          if (lang === 'en') {
            obj2 = { name: time + ' ' +name + " uploaded" };
          }
          rs.push(obj2);
        } else if (item.step == "cmp_compute_status") {
          let obj2 = { name: time + ' ' +name + "生成完成" };
          if (lang === 'en') {
            obj2 = { name: time + ' ' +name + " is generated" };
          }
          rs.push(obj2);
        } else {
          let obj = { name: time + ' ' +name + "正在生成中…" };
          let obj2 = { name: time + ' ' +name + "生成完成" };
          if (lang === 'en') {
            obj = { name: time + ' ' +name + " is generating..." };
            obj2 = { name: time + ' ' +name + " is generated" };
          }
          rs.push(obj2, obj);
        }
      }
    }

    return rs;
  }
};
const modules = {
  componentCompute
};
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
  modules
};
