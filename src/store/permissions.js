import fetch from "@/services/fetch";

const state = {
  /* [
    4,56,6,7
  ] */
  readWrite_permission: {}, //true有多写权限  false只有可读权限
  project_list_permission: [],
  operateLog_permission: 0,
  ruleManage_permission: 0, //0没有权限  1 可读可写   2只读
  userManage_permission: 0, //0没有权限  1 可读可写   2只读
  roleManage_permission: 0, //0没有权限  1 可读可写   2只读
  projectArchive_permission: 0, //0没有权限  1 可读可写   2只读
  customerManage_permission: 0, //0没有权限  1 可读可写   2只读
  budgetManage_permission: 0, //0没有权限  1 可读可写   2只读(PDB预算分配)
  strategyManage_permission: 0, //0没有权限  1 可读可写   2只读(HY.PBS媒介推荐)

  /*1 可写（页面导航栏新建按钮可以点击）
  2 只读，相当于没有权限（页面导航栏点击提示没有权限，仿照系统管理）*/
  project_create_permission: 1, //
  permission: [],
  productIDHasMediaPrice: [],
  hasMediaCpm: false //是否有媒体版价格权限
};

const mutations = {
  UPDATE_OPERATELOG_PERMISSION(state, value) {
    state.operateLog_permission = value;
  },
  UPDATE_PROJECT_LIST_PERMISSION(state, value) {
    state.project_list_permission = value;
  },
  UPDATE_PROJECTARCHIVE_PERMISSION(state, value) {
    state.projectArchive_permission = value;
  },
  UPDATE_PERMISSION(state, value) {
    state.permission = value;
  },
  UPDATE_HASMEDIACPM(state, value) {
    state.hasMediaCpm = value;
  },
  UPDATE_READWRITE_PERMISSION(state,  value) {
    state.readWrite_permission = value;
  },
  UPDATE_PROJECT_CREATE_PERMISSION(state,  value) {
    state.project_create_permission = value;
  },
  UPDATE_PRODUCTIDHASMEDIAPRICE(state, value) {
    state.productIDHasMediaPrice = value;
  },
  UPDATE_RULEMANAGE_PERMISSION(state, value) {
    state.ruleManage_permission = value;
  },
  UPDATE_USERMANAGE_PERMISSION(state, value) {
    state.userManage_permission = value;
  },
  UPDATE_ROLEMANAGE_PERMISSION(state, value) {
    state.roleManage_permission = value;
  },
  UPDATE_CUSTOMERMANAGE_PERMISSION(state, value) {
    state.customerManage_permission = value;
  },
  UPDATE_BUDGETMANAGE_PERMISSION(state, value) {
    state.budgetManage_permission = value;
  },
  UPDATE_STRATEGYMANAGE_PERMISSION(state, value) {
    state.strategyManage_permission = value;
  },
  
};
const actions = {
  clear_permission({ state, commit, rootState }) {
    commit("UPDATE_READWRITE_PERMISSION", {});
    commit("UPDATE_PROJECT_LIST_PERMISSION", []);
    commit("UPDATE_PERMISSION", []);
    commit("UPDATE_PRODUCTIDHASMEDIAPRICE", []);
    commit("UPDATE_HASMEDIACPM", false);
    commit("UPDATE_PROJECT_CREATE_PERMISSION", 1);
    commit("UPDATE_RULEMANAGE_PERMISSION", 0);
    commit("UPDATE_USERMANAGE_PERMISSION", 0);
    commit("UPDATE_ROLEMANAGE_PERMISSION", 0);
    commit("UPDATE_CUSTOMERMANAGE_PERMISSION", 0);
    commit("UPDATE_PROJECTARCHIVE_PERMISSION", 0);
    commit("UPDATE_OPERATELOG_PERMISSION", 0);
    commit("UPDATE_BUDGETMANAGE_PERMISSION", 0);
    commit("UPDATE_STRATEGYMANAGE_PERMISSION", 0);
    
  },
  update_readWrite_permission({ state, commit, rootState }, permission) {
    commit("UPDATE_READWRITE_PERMISSION", permission);
  },
  /* update_readWrite_permission({ state, commit, rootState }, permission) {
    commit("UPDATE_USERMANAGE_PERMISSION", permission);
  },
  update_readWrite_permission({ state, commit, rootState }, permission) {
    commit("UPDATE_ROLEMANAGE_PERMISSION", permission);
  },
  update_readWrite_permission({ state, commit, rootState }, permission) {
    commit("UPDATE_CUSTOMERMANAGE_PERMISSION", permission);
  }, */
  setMediaCpmPermission({ state, commit, rootState }, productID) {
    let rs = true;
    if (rootState.user.user_id != 1) {
      rs = state.productIDHasMediaPrice.find(i => i == productID);
    }
    commit("UPDATE_HASMEDIACPM", !!rs);
  },
  fetch_permission({ state, commit, rootState }) {
    return new Promise((resolve, reject) => {
      if (rootState.user.user_id == 1) {
        commit("UPDATE_PERMISSION", []);
        commit("UPDATE_PRODUCTIDHASMEDIAPRICE", []);
        commit("UPDATE_PROJECT_CREATE_PERMISSION", 1);
        commit("UPDATE_RULEMANAGE_PERMISSION", 1);
        commit("UPDATE_USERMANAGE_PERMISSION", 1);
        commit("UPDATE_ROLEMANAGE_PERMISSION", 1);
        commit("UPDATE_CUSTOMERMANAGE_PERMISSION", 1);
        commit("UPDATE_PROJECTARCHIVE_PERMISSION", 1);
        commit("UPDATE_OPERATELOG_PERMISSION", 1);
        commit("UPDATE_BUDGETMANAGE_PERMISSION", 1);
        commit("UPDATE_STRATEGYMANAGE_PERMISSION", 1);      
        commit("UPDATE_HASMEDIACPM", true);


        // commit("UPDATE_READWRITE_PERMISSION", {});
        // commit("UPDATE_PROJECT_LIST_PERMISSION", []);
        
        resolve();
      } else {
        fetch
          .post("/role/checkviewauth")
          .then(data => {
            commit("UPDATE_PERMISSION", data["3"]);
            commit("UPDATE_PROJECT_CREATE_PERMISSION", data["2"]-0);//1是可读可写  2只读
            commit("UPDATE_PRODUCTIDHASMEDIAPRICE", data["10"]);
            commit("UPDATE_RULEMANAGE_PERMISSION", data["16"]);
            commit("UPDATE_USERMANAGE_PERMISSION", data["14"]);
            commit("UPDATE_ROLEMANAGE_PERMISSION", data["13"]);
            commit("UPDATE_CUSTOMERMANAGE_PERMISSION", data["15"]);
            commit("UPDATE_PROJECTARCHIVE_PERMISSION", data["18"]);
            commit("UPDATE_OPERATELOG_PERMISSION", data["19"]);
            commit("UPDATE_BUDGETMANAGE_PERMISSION",data["25"]);
            commit("UPDATE_STRATEGYMANAGE_PERMISSION", data["23"]);      
            resolve(data);
          })
          .catch(err => {
            reject(err);
          });
      }

    });
  }
};


const getters = {
  isRoot: (state, getters, rootState) => fn => {
    if (rootState.user.user_id != 1) {
      return fn && fn();
    } else {
      return true;
    }
  },
  //创建项目的读写权限
  enableWriteCreateProject: (state, getters, rootState) => {
    if (rootState.project.pageType == 'ProjectArchive'||rootState.project.curVersion != 0) {
      return false;
    } else {
      return getters.isRoot(() => {
        if (rootState.project.projectID) {
          if (state.readWrite_permission.hasOwnProperty(rootState.project.projectID)) {
            return state.readWrite_permission[rootState.project.projectID];
          } else {
            return true;
          }
        } else {
          return true;
        }

      });
    }
    
  },
  //创建项目的权限
  /* enableCreateProject: (state, getters, rootState) => {
    return getters.isRoot(() => {
      // console.log("state.permission1", state.permission);
      if (Array.isArray(state.permission)) {
        let rs = state.permission.find(i => i == 2);
        return !!rs;
      }
    });
  }, */

  enableMediaCpm: (state, getters, rootState) => {
    return getters.isRoot(() => {
      return state.hasMediaCpm;
    });
  },
  //项目list的权限
  enableProjectList: (state, getters, rootState) => {
    return getters.isRoot(() => {
      // console.log("state.permission2", state.permission);
      if (Array.isArray(state.permission)) {
        let rs = state.permission.find(i => i == 3);
        return !!rs;
      }

    });
  },
  // 
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
