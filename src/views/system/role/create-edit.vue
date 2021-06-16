<template>
  <hy-dialog :visible="true"
    @close="onClose"
    custom-class='create-edit-role'
    :title="isNew? $t('lang.system_role_add_title'):$t('lang.system_role_edit_title')"
    :show-close="true"
    :close-on-click-modal="false">

    <div class="box">
      <el-form ref="form"
        :rules="rules"
        :model="form">
        <el-form-item :label="`${$t('lang.public_role_name')}：`"
          prop="roleName">
          <el-input style="width:390px"
            size="mini"
            :placeholder="$t('lang.public_role_name_placeholder')"
            v-model="form.roleName"></el-input>
        </el-form-item>

        <template v-if="isRoot">
          <el-form-item :label="`${$t('lang.public_role_level_label')}：`"
            class="role-level"
            prop="roleLevel">
            <!-- <el-select v-model="tem_agentLevel" -->
            <el-select v-model="form.agentLevel"
              style="width:175px;height:28px;line-height:28px"
              :disabled="!isNew"
              size="mini"
              @change='onChangeLevel'
              :placeholder="$t('lang.public_role_level_placeholder')">
              <el-option key="1"
                :label="$t('lang.public_level1_label')"
                value="1"></el-option>
              <el-option key="2"
                :label="$t('lang.public_level2_label')"
                value="2">
              </el-option>
            </el-select>

            <el-select v-model="form.agent"
              v-show="form.agentLevel=='2'"
              size="mini"
              filterable
              style="width:256px;height:28px;line-height:28px"
              @change='onChangeAgent'
              :placeholder="$t('lang.layout_agent_placeholder')">
              <el-option v-for="item in agentList"
                :key="item.id"
                :label="item.name"
                :value="item.id"></el-option>
            </el-select>

            <el-input style="width:256px"
              v-show="form.agentLevel=='1'"
              size="mini"
              :placeholder="$t('lang.public_agent_name_placeholder')"
              v-model="form.agentName"></el-input>
          </el-form-item>
        </template>
        <el-form-item :label="`${$t('lang.public_role_level_label')}：`" v-else>
          <span style="font-size:12px">{{$t('lang.public_level2_label')}}</span>
        </el-form-item>
      </el-form>
      <div class="clearfix auth">
        <span class="text"
          style="max-width:80px;display:block;word-break: keep-all;">{{$t('lang.system_role_Permissions_configuration')}}：</span>
        <div class="auth-box">
          <!-- 左侧权限列表 start -->
          <div class="auth-list">

            <div class="item head"
              style="cursor: default;">
              {{$t('lang.system_role_Generate_Permissions')}}
              <i class="iconfont icon-add" v-if="(isRoot&&agentLevel==2)||!isRoot"
                @click="onAddAuth"></i>
            </div>
            
            <div class="item"
              :class="{ active: auth._id==activeAuth }"
              v-for="(auth,index) in authListRender"
              :key="index"
              @click="onActiveAuth(auth)">
              <span class="auth-name"
                :title="$t('lang.public_tooltip_permission')+(index+1)">{{$t('lang.public_tooltip_permission')}}{{index+1}}</span>
              <template v-if="auth.auth_status==0">
                <i class="iconfont icon-qidong"
                  :title="$t('lang.public_tooltip_on')"
                  @click.self.stop="onStart(auth)">
                </i>
                <div class="status">{{$t('lang.public_tooltip_off')}}</div>
              </template>
              <template v-else>
                <i class="iconfont icon-tingzhi"
                  :title="$t('lang.public_tooltip_off')"
                  @click.self.stop="onStop(auth)"></i>
                <div class="status">{{$t('lang.public_tooltip_on')}}</div>
              </template>
            </div>
          </div>
          <!-- 左侧权限列表 end -->

          <!-- 右侧2颗树 start -->
          <!-- <keep-alive> -->
          <template v-for="(auth,index) in authList">
            <authTree v-if="auth._id==activeAuth"
              :key="index"
              :data='auth'
              :is-new="isNew"
              :auth-len='authListRender.length'
              :plate-tree-data='plateTree'
              :agent-level='agentLevel'
              :customer-tree-data='customerTree'>
            </authTree>
          </template>

          <!-- </keep-alive> -->
          <!-- 右侧2颗树 end -->
        </div>
      </div>
    </div>

    <div slot="footer">
      <el-button plain
        @click="onCancel">{{$t('lang.public_button_cancel')}}</el-button>
      <el-button @click="onSubmit">{{$t('lang.public_button_submit')}}</el-button>
    </div>
  </hy-dialog>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";
import authTree from "./auth-tree";
const ReadWrite = "1";
const Read = "2";
const Enable = "1";
const Disable = "0";
//名称为数字、英文、中文、下划线 20个字符以内
export default {
  name: "CreateEditRole",
  componentName: "CreateEditRole",
  components: {
    authTree
  },
  provide() {
    return {
      authList: this.authList
    };
  },
  props: {
    isShow: {
      type: [Boolean],
      required: true
    },
    roleId: {
      //该值为空，表示新建，否则为编辑
      type: [Number, String],
      required: true
    }
  },
  data() {
    var validateName = (rule, value, callback) => {
      let _val = _.trim(value);
      if (_val == "") {
        callback(new Error(this.$t('lang.public_role_name_placeholder')));
      } else {
        if (_val.length > 20) {
          callback(new Error(this.$t('lang.reg_role_name_length_error')));
        } else {
          if (this.$constReg.cnenName2.test(_val)) {
            callback();
          } else {
            callback(
              new Error(this.$t('lang.reg_role_name_error_msg'))
            );
          }
        }
      }
    };
    var validateRoleLevel = (rule, value, callback) => {
      let _val = _.trim(this.form.agentName);
      if (this.form.agentLevel==1) {
        if (_val == "") {
          callback(new Error(this.$t('lang.public_agent_name_placeholder')));
        } else {
          if (_val.length > 20) {
            callback(new Error(this.$t('lang.reg_agent_name_length_error')));
          } else {
            if (this.$constReg.cnenName2.test(_val)) {
              callback();
            } else {
              callback(
                new Error(this.$t('lang.reg_role_name_error_msg'))
              );
            }
          }
        }
      }else{
        callback();
      }
      
    };
    return {
      activeAuth: "",
      authList: [], //权限列表,侧边栏的权限1  权限2  权限3
      isLoading: false,
      tem_agentLevel:'',
      form: {
        roleName: "",
        agentLevel: "", //代理等级
        agent: "", //一级下拉选定的代理id
        agentName: "" //一级可以修改的代理名称
      },
      rules: {
        roleName: [{ validator: validateName, trigger: "blur" }],
        roleLevel: [{ validator: validateRoleLevel, trigger: "blur" }],
      },
      customerTree: [], //客户树(左侧)
      plateTree: [], //板块树(右侧侧)
      plateTreeCache: {}, //客户树(左侧)缓存
      customerTreeCache: {} //板块树(右侧侧)缓存
    };
  },

  computed: {
    ...mapGetters("user", ["isRoot"]),
    ...mapState("system", ["auth_selected_ids","agentList"]),
    ...mapState("user", ["role"]),
    authListRender() {
      return this.authList;
    },
    isNew() {
      return !this.roleId;
    },
    agentLevel() {
      return this.form.agentLevel;
    },
    agent() {
      return this.form.agent;
    }
  },
  watch: {
    agent(n, o) {
      this.setCustomerTree();
    },
    agentLevel: {
      handler: function (n, o) {
        if (this.isNew) {
        this.authList = [];
        this.reset_auth_selected_ids();
        this.createFirstAuth();
        if (n == "1") {
          this.$set(this.form, "agent", "");
        } else {
          this.$set(this.form, "agentName", "");
        }
        this.setPlateTree();
      }
      },
      immediate: true
    },
    /* agentLevel(n, o) {
      if (this.isNew) {
        this.authList = [];
        this.reset_auth_selected_ids();
        this.createFirstAuth();
        if (n == "1") {
          this.$set(this.form, "agent", "");
        } else {
          this.$set(this.form, "agentName", "");
        }
        this.setPlateTree();
      }
    }, */
    tem_agentLevel(n, o){
      if ((o==2&&n==1)||(o==1&&n==2)) {
        this.$confirm(this.$t('lang.system_role_switch_level_confirm'), this.$t('lang.public_dialog_point'), {
          confirmButtonText: this.$t('lang.public_button_confirm'),
          cancelButtonText: this.$t('lang.public_button_cancel'),
          type: 'warning'
        }).then(() => {
          this.$set(this.form, "agentLevel", n);
          //为什么要加这个逻辑呢，因为目前是新建才能切换角色级别，万一后面又改编辑也可以，
          // 如果不加这个判断，下面的逻辑就有问题了
          if (this.isNew) {
            this.authList = [];
            this.reset_auth_selected_ids();
            this.createFirstAuth();
          }
        }).catch(() => {
          this.tem_agentLevel = o;          
        });        
      }else{
        this.$set(this.form, "agentLevel", n);
      }
    },
  },
  created() {
    this.$on("DEL_AUTH_EVENT", id => {
      //下面2个函数顺序不可颠倒  有依赖关系
      this.autoActiveAuth(id); //根据删除的id，自动高亮下一个权限
      this.delAuth(id); //根据id删除对应的权限
    });

    this.reset_auth_selected_ids();
    if (!this.isRoot) {
      this.form.agentLevel='2';
      if (this.isNew) {
        this.form.agent = this.role.agent_id;
      }
    }
  },

  mounted() {
    if (this.isNew) {
      this.initNew();
    } else {
      this.initEdit();
    }
  },
  methods: {
    ...mapActions("system", [
      "update_auth_selected_ids",
      "reset_auth_selected_ids",
      "set_agent_list",
      "update_agent_list_by_id_name"
    ]),
    onChangeLevel(val) {

    },
    onChangeAgent(val) {},
    validateRoleName() {
      return new Promise((resolve, reject) => {
        this.$refs["form"].validate(valid => {
          resolve(valid);
        });
      });
    },
    validateAuth() {
      // let emptyAuthName = [];
      let rs = {};
      for (let index = 0; index < this.authListRender.length; index++) {
        let productId = this.getProductId(index);
        let authId = this.getAuthId(index);
        // console.log(authId);
        if (productId.length == 0 && authId.length !== 0) {
          let msg = this.$t('lang.system_role_Client_permissions_empty')+' : ';
          if (!rs[msg]) {
            rs[msg] = [];
          }
          rs[msg].push(this.$t('lang.system_role_permission') + (index + 1));
          // emptyAuthName.push("权限" + (index + 1));
        }
        if (productId.length !== 0 && authId.length == 0) {
          let msg = this.$t('lang.system_role_Section_permissions_empty')+' : ';
          if (!rs[msg]) {
            rs[msg] = [];
          }
          rs[msg].push(this.$t('lang.system_role_permission') + (index + 1));
          // emptyAuthName.push("权限" + (index + 1));
        }
        if (productId.length == 0 && authId.length == 0) {
          let msg = this.$t('lang.system_role_permissions_empty')+' : ';
          if (!rs[msg]) {
            rs[msg] = [];
          }
          rs[msg].push(this.$t('lang.system_role_permission') + (index + 1));
          // emptyAuthName.push("权限" + (index + 1));
        }
      }
      return rs;
    },
    async onSubmit() {
      let nameOK = await this.validateRoleName();
      if (nameOK) {
        let validateResult = this.validateAuth();
        let titles = Object.keys(validateResult);
        // let authNames = Object.values(validateResult);
        if (titles.length) {
          const h = this.$createElement;
          let arr = [];
          for (const title of titles) {
            arr.push(h("p", null, title));
            arr.push(
              h(
                "span",
                { style: "padding-left:0px;" },
                validateResult[title].join(",")
              )
            );
          }
          this.$msgbox({
            title: this.$t('lang.public_dialog_point'),
            type: "warning",
            message: h("p", null, [
              ...arr,
              h("p", { style: "margin-top: 10px;" }, this.$t('lang.system_role_continue_submit_confirm'))
            ]),
            showCancelButton: true,
            confirmButtonText: this.$t('lang.public_button_continue'),
            cancelButtonText: this.$t('lang.public_button_cancel')
          })
            .then(async () => {
              this.submitFn();
            })
            .catch(() => {
              // console.log("取消");
            });
        } else {
          this.submitFn();
        }
      }
    },
    async submitFn() {
      await this.fetchSaveAuth();
      this.set_agent_list();
      this.$dispatch("RoleManage", "REFRESH");
      this.onClose();
    },
    onCancel() {
      this.$emit("update:isShow", false);
    },
    getSelectedIds(type, arr) {
      /**
       * 因为服务端给的节点都是叶子节点，前面构建数据时也是根据它的结构构建的，
       * 所以按照既定的规则就可以将服务端数据和构建的数据对应起来了
       */
      let prefix = "product_";
      if (type == "plate") {
        prefix = "2_";
      }
      return arr.map(i => (i = prefix + i));
    },
    setAuthList(arr) {
      arr.forEach((item, i) => {
        let index = _.uniqueId();
        let obj = {
          // _isShow: true, //是否显示，因为使用了keep-alive 无法删除
          _id: index,
          order_id: item.order_id, //权限的顺序id
          auth_status: item.auth_status, //权限状态 启用 禁用
          auth_type: item.auth_type //权限类型  可读可写 只读
        };
        this.authList.push(obj);
        this.update_auth_selected_ids({
          id: index,
          customer_ids: this.getSelectedIds("customer", item.product_id),
          plate_ids: this.getSelectedIds("plate", item.auth)
        });
      });
    },
    async initEdit() {
      await this.initAuthDetail();
      await this.initAuthTreeByDetail();
    },
    //根据详情初始化树
    async initAuthTreeByDetail(){
      this.setCustomerTree()
      this.setPlateTree()
    },
    //初始化详情信息到数据模型
    async initAuthDetail(){
      let authInfo = await this.fetchAuthDetail();
      this.form.roleName = authInfo.role_name;
      this.form.agentLevel = authInfo.agent_level;
      this.form.agent = authInfo.agent_id;
      this.form.agentName = authInfo.agent_name;
      this.setAuthList(authInfo.list);
      this.activeAuth = this.authListRender[0]["_id"];
    },
    createFirstAuth(){
      this.onAddAuth(); //新建时创建一条默认空权限
      this.activeAuth = this.authListRender[0]["_id"]; //高亮第一条权限
    },
    async initNew() {
      this.setCustomerTree()
      this.setPlateTree()
      // this.createFirstAuth();
    },
    setUniqueIDTree(arr) {
      for (let i of arr) {
        i._id = i.type + "_" + i.id;
        if (Array.isArray(i.lists)) {
          this.setUniqueIDTree(i.lists);
        }
      }
    },
    async setCustomerTree(){
      let tree = await this.fetchCustomerTree();
      this.setUniqueIDTree(tree);
      this.customerTree = tree;
    },
    async setPlateTree(){
      let tree = await this.fetchPlateTree();
      this.setUniqueIDTree(tree);
      this.plateTree = tree;
    },
    //删除某一个权限
    delAuth(id) {
      let index = this.authList.findIndex(i => i._id == id);
      if (index != -1) {
        this.authList.splice(index, 1);
      }
    },
    //设置高亮的权限，主要是在删除之后调用
    autoActiveAuth(id) {
      let index = this.authListRender.findIndex(i => i._id == id);
      if (index != -1) {
        let activeIndex = index - 1;
        if (index == 0) {
          activeIndex = index + 1;
        }
        this.activeAuth = this.authListRender[activeIndex]["_id"];
      }
    },
    onActiveAuth(auth) {
      this.activeAuth = auth._id;
    },
    //点击添加权限按钮
    onAddAuth() {
      // let len = this.authList.length;
      let index = _.uniqueId();
      let obj = {
        _id: index,
        auth_status: Enable, //权限状态 启用 禁用
        auth_type: ReadWrite //权限类型  可读可写 只读
      };

      this.authList.push(obj);
      // debugger
      this.update_auth_selected_ids({
        id: index,
        customer_ids: [],
        plate_ids: []
      });

      // setTimeout(() => {
      this.$nextTick(() => {
        this.onActiveAuth(obj);
      });
      // }, 2000);

      // this.$broadcast("auth-tree", "mayue", "wsm");
    },
    onStart(obj) {
      // this.testIf = true;
      obj.auth_status = Enable;
    },
    onStop(obj) {
      obj.auth_status = Disable;
    },
    onDelete() {},
    onClose() {
      this.$emit("update:isShow", false);
    },
    getProductId(index) {
      let arr = this.auth_selected_ids[index]["customer_ids"];
      return arr.map(i => (i = i.replace("product_", "")));
    },
    getAuthId(index) {
      let arr = this.auth_selected_ids[index]["plate_ids"];
      // console.log("arr=",arr)
      /* arr = arr.filter(i => {
        return i.indexOf("2_") == 0&&i!='2_11'
      }); */
      return arr.map(i => (i = i.replace(/^\d_/, "")));
    },
    getParam() {
      let data = {
        role_name: this.form.roleName,
        role_id: this.roleId,
        agent_level: this.form.agentLevel
      };
      if (this.isNew) {
        data.agent =
          this.form.agentLevel == "1" ? this.form.agentName : this.form.agent;
      } else {
        data.agent_id = this.form.agent;
        if (this.form.agentLevel == "1") {
          data.agent = this.form.agentName;
        }
      }
      let list = [];
      this.authList.forEach((item, index) => {
        let obj = {
          auth_status: item.auth_status,
          auth_type: item.auth_type,
          product_id: this.getProductId(index),
          auth: this.getAuthId(index)
        };
        if (!this.isNew) {
          obj.order_id = item.order_id;
        }
        list.push(obj);
      });
      data.list = list;
      return data;
    },
    async fetchSaveAuth() {
      let param = this.getParam();
      let url = this.isNew ? "/role/add" : "/role/edit";
      let data = await this.fetchCore(url, param);
      return data;
    },
    // 获取角色的权限信息
    async fetchAuthDetail() {
      let role_id = this.roleId;
      let data = await this.fetchCore("/role/roledetail", { role_id });
      return data;
    },
    // 一起获取2棵树
    async fetchAuthTree() {
      let [customerTree, plateTree] = await Promise.all([
        this.fetchCustomerTree(),
        this.fetchPlateTree()
      ]);
      return { customerTree, plateTree };
    },
    // 客户树的数据(左侧)
    async fetchCustomerTree() {
      let agent_id = this.form.agent;
      if (agent_id) {
        if (this.customerTreeCache[agent_id]) {
          return this.customerTreeCache[agent_id];
        } else {
          let data = [];
          if (agent_id) {
            let lists = await this.fetchCore("/products/productselectlists", {
              agent_id
            });
            if (lists.length) {
              data = [
                {
                  id: "0",
                  type: "customer",
                  name: this.$t('lang.public_client_All'),
                  lists
                }
              ];
            }
          }
          this.customerTreeCache[agent_id] = data;
          return data;
        }
      } else {
        return [];
      }
    },
    //板块树的数据（右侧）
    async fetchPlateTree() {
      let agent_level = this.form.agentLevel;
      if (agent_level) {
        if (this.plateTreeCache[agent_level]) {
          return this.plateTreeCache[agent_level];
        } else {
          let lists = await this.fetchCore("/role/menuselectlist", {
            agent_level
          });
          let data = [
            {
              id: "0",
              name: this.$t('lang.system_role_all_section'),
              type: "0",
              lists
            }
          ];
          this.plateTreeCache[agent_level] = data;
          return data;
        }
      } else {
        return [];
      }
    },
    async fetchCore(url, data, hasLoading = true) {
      hasLoading && (this.isLoading = true);
      try {
        let _data = await fetch.post(url, data);
        return _data;
      } catch (err) {
        this.$message.error(err.message);
        throw err;
      } finally {
        hasLoading && (this.isLoading = false);
      }
    }
  }
};
</script>
<style scoped>
.box {
  padding: 30px 20px 20px 20px;
  color: #aaa9af;
  height: calc(100% - 50px);
}
.box >>> .text {
  font-size: 12px;
}
.auth {
  height: calc(100% - 20px - 94px);
  margin-top: 20px;
  display: flex;
}
.auth-box {
  background-color: #2c333e;    /*背景调换,系统管理->角色管理->新建角色->权限配置背景*/
  display: flex;
  flex: 1;
}
.auth-list {
  /* width: 140px; */
  width: 160px;
  border-right: 1px solid #151b27;
  overflow: auto;
}

.auth-list .item {
  height: 32px;
  line-height: 32px;
  background-color: #555c66;    /*背景调换,系统管理->角色管理->新建角色->权限配置左侧生成权限条目背景*/
  color: #fdfeff;
  font-size: 12px;
  padding-left: 10px;
  padding-right: 7px;
  border-bottom: 1px solid #2b3340;
  cursor: pointer;
}
.auth-list .item .status {
  display: inline-block;
  background: #333736;    /*背景调换,系统管理->角色管理->新建角色->权限配置左侧生成权限未选中时状态背景*/
  padding: 1px 7px;
  height: 16px;
  line-height: 16px;
  float: right;
  margin-top: 7px;
  border-radius: 11px;
  color: #ffcb00;
  margin-right: 8px;
}
/* .auth-list .item:hover .status {
  opacity: 0.5;
}
.auth-list .item.active:hover .status {
  background: #1f2c29;
} */
.auth-list .item.active .status {
  background: #276359;    /*背景调换,系统管理->角色管理->新建角色->权限配置左侧生成权限选中时状态背景*/
  color: #3cb298;
}
.auth-list .item .iconfont {
  float: right;
  cursor: pointer;
}
.auth-list .item.head,
.auth-list .item.head:hover {
  background-color: #2c323e;    /*背景调换,系统管理->角色管理->新建角色->权限配置左侧生成权限背景*/
  color: #a9aeb2;
}
.auth-list .item.active {
  background-color: #42a996;   /*背景调换,系统管理->角色管理->新建角色->权限配置左侧生成权限选中时背景*/
}
.auth-list .item:hover {
  opacity: 0.6;
}
.auth-list .item.active:hover {
  opacity: 1;
}
.auth-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  width: 55px;
}
</style>
<style lang="scss">
.create-edit-role {
  .el-form-item {
    margin-bottom: 12px;
    .el-form-item__label {
      padding-right: 4px;
      color: #aaa9af;
    }
    .el-form-item__error {
      padding-top: 0px;
      left: 64px;
    }
    &.role-level{
      .el-form-item__error{
        margin-left: 134px;
      }
    }
  }
}
</style>

