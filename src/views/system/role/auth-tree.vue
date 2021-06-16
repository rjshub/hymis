<template>
  <div class="auth-tree">
    <div class="auth-box-top">
      <div class="customer-auth">
        <div class="head">{{$t('lang.system_role_client_permission')}}</div>
        <div class="auth-box-tree">
          <el-tree :data="renderCustomerTree"
            :default-expand-all="true"
            ref="customerRef"
            node-key="_id"
            @check-change='onCheckChangeCustomer'
            :indent='24'
            :default-checked-keys="defaultCheckedCustomer"
            show-checkbox
            :props="defaultProps">
          </el-tree>
        </div>
      </div>
      <div class="plate-auth">
        <div class="head">{{$t('lang.system_role_section_permission')}}</div>
        <div class="auth-box-tree">
          <el-tree :data="renderPlateTree"
            :default-expand-all="true"
            :default-checked-keys="defaultCheckedPlate"
            @check-change='onCheckChangePlate'
            ref="plateRef"
            node-key="_id"
            show-checkbox
            :indent='24'
            :props="defaultProps">
          </el-tree>
        </div>
      </div>
    </div>
    <div class="auth-box-bottom">
      <el-radio v-model="data.auth_type"
        label="1">{{`${$t('lang.public_Readable')}、${$t('lang.public_Writable')}`}}</el-radio>
      <el-radio v-model="data.auth_type"
        style="margin-right: 30px;"
        label="2">{{$t('lang.public_Readable')}}</el-radio>
      <el-button plain
        v-if="data.auth_status==1"
        style="margin-right: 8px;"
        @click="onStop">{{$t('lang.public_tooltip_off')}}</el-button>
      <el-button plain
        v-else
        style="margin-right: 8px;"
        @click="onStart">{{$t('lang.public_tooltip_on')}}</el-button>
      <el-button plain
        v-if="showDelete"
        @click="onDelete">{{$t('lang.public_tooltip_delete')}}</el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";
const ReadWrite = "1";
const Read = "2";
const Enable = "1";
const Disable = "0";

export default {
  name: "RoleAuthTree",
  componentName: "RoleAuthTree",
  components: {
    //子组件
  },
  props: {
    data: {
      type: [Object],
      required: true
    },
    isNew: {
      //是否是新建
      type: [Boolean],
      required: true
    },
    agentLevel: {
      type: [Number, String],
      required: true
    },
    authLen: {
      //权限的len
      type: [Number],
      required: true
    },
    customerTreeData: {
      //客户树的数据
      type: Array,
      required: true
    },
    plateTreeData: {
      //板块树的数据
      type: Array,
      required: true
    }
  },
  inject: ["authList"],
  data() {
    return {
      renderCustomerTree: [],
      renderPlateTree: [],
      authType: "1",
      authStatus: "1",
      defaultCheckedCustomer: [],
      defaultCheckedPlate: [],
      defaultProps: {
        children: "lists",
        label: "name",
        disabled: "disabled"
      }
    };
  },
  computed: {
    ...mapState("system", ["auth_selected_ids"]),
    ...mapGetters("system", [
      "getPlateDisabledDataById",
      "getSelectedCustomerById",
      "getCustomerDisabledDataById"
    ]),
    //是否显示删除按钮
    showDelete() {
      let isShow = false;
      let obj = this.auth_selected_ids.find(i => i.id == this.data._id);
      if (obj) {
        let c = obj.customer_ids.length;
        let p = obj.plate_ids.length-1;//因为客户版价格默认勾选
        //order_id如果有值  说明是从服务端拿来的数据
        if (!this.data.order_id && !c && !p && this.authLen > 1) {
          isShow = true;
        }
      }
      return isShow;
      
    }
  },
  watch: {
    customerTreeData: {
      handler: function(val, oldVal) {
        this.init();
      },
      deep: true
    },
    plateTreeData: {
      handler: function(val, oldVal) {
        this.init();
      },
      deep: true
    }
  },

  created() {
    this.init();
  },
  mounted() {},
  methods: {
    ...mapActions("system", [
      "update_auth_selected_ids",
      "update_auth_selected_ids_add_plate_ids",
      "pop_auth_selected_ids_by_id",
    ]),
    init() {
      this.initCustomerTree();
      this.initPlateTree();
    },
    getLeafNodesIdsCustomerTree(tree){
      let arr = tree||this.renderCustomerTree;
      let rs = [];
      for (let item of arr) {
        if (!item.hasOwnProperty('lists')||(Array.isArray(item.lists)&&!item.lists.length)) {
          rs.push(item._id);
        }
        if (Array.isArray(item.lists)&&item.lists.length) {
          rs = rs.concat(this.getLeafNodesIdsCustomerTree(item.lists))
        }
      }
      return rs
    },
    //特殊处理客户树
    specialHandleCustomerTree(){
      let ids = this.getLeafNodesIdsCustomerTree();
      // console.log('ids',ids)
      this.defaultCheckedCustomer = ids;
      this.allDisabledCustomerTree();
      let productIds = this.filterProductIds(ids);
      // console.log('productIds',productIds)
      this.updateAuthSelectedIds('customer',productIds);
    },
    allDisabledCustomerTree(tree){
      let arr = tree||this.renderCustomerTree;
      for (let item of arr) {
        item.disabled = true;
        if (Array.isArray(item.lists)&&item.lists.length) {
          this.allDisabledCustomerTree(item.lists);
        }
      }
    },
    initCustomerTree(){
      this.renderCustomerTree = this.customerTreeData; //空白客户树
      //业务需求勾选全部，切全部禁用
      if (!this.isNew&&this.agentLevel==1) {
        this.specialHandleCustomerTree();
      }else{
        this.setCheckedNode('customer')
        this.setDisabledNode('customer');
      }
    },
    initPlateTree(){
      this.renderPlateTree = _.cloneDeep(this.plateTreeData); //空白板块树
      
      this.setCheckedNode('plate')
      this.setDisabledNode('plate');

      this.handlerCustomerPrice(); //对客户版价格的特殊处理（默认勾选且禁用）
    },
    // type: 'customer' 或  'plate'
    setCheckedNode(type){
      let id = this.data._id;
      let { plate_ids,customer_ids } = this.getSelectedCustomerById(id);
      if (type=='customer') {
        this.defaultCheckedCustomer = customer_ids;//这个属性会直接挂在到对应的板块树上的
      }else if (type=='plate') {
        this.defaultCheckedPlate = plate_ids;//这个属性会直接挂在到对应的板块树上的
      }else{
        return
      }
    },
    filterProductIds(arr) {
      return arr.filter(i => i.indexOf("product_") != -1);
    },
    //对客户版价格的特殊处理，(默认勾选，且禁用)
    handlerCustomerPrice(){
      this.checkCustomerPrice();
      this.disabledCustomerPrice();
    },
    //客户版价格默认勾选
    checkCustomerPrice() {
      if (this.defaultCheckedPlate.indexOf("2_11") == -1) {
        let arr = _.cloneDeep(this.defaultCheckedPlate);
        arr.push("2_11");
        this.defaultCheckedPlate = arr;//更新树的勾选状态
        // 更新树的勾选状态到vuex
        this.update_auth_selected_ids_add_plate_ids("2_11");
      }
    },
    //客户版价格默认禁用  （配合上面默认勾选）
    disabledCustomerPrice() {
      this.setDisabledData(this.renderPlateTree, ["2_11"]);
    },
    //设置2颗树默认的勾选状态
    setDefaultCheck() {
      let { customer_ids, plate_ids } = this.getSelectedCustomerById(
        this.data._id
      );
      // this.defaultCheckedCustomer = ['customer_0'];//这个属性会直接挂在到对应的客户树上的
      this.defaultCheckedCustomer = customer_ids;//这个属性会直接挂在到对应的客户树上的
      this.defaultCheckedPlate = plate_ids;//这个属性会直接挂在到对应的板块树上的
    },
    //禁用数据
    setDisabledData(arr, ids) {
      for (let i of arr) {
        if (ids.indexOf(i._id) != -1) {
          i.disabled = true;
        }
        if (Array.isArray(i.lists)) {
          this.setDisabledData(i.lists, ids);
        }
      }
    },
    //type: 'customer' 或  'plate'
    setDisabledNode(type){
      let id = this.data._id;
      if (type=='customer') {
        let arr = this.getCustomerDisabledDataById(id);
        this.setDisabledData(this.renderCustomerTree, arr);
      }else if (type=='plate') {
        let arr = this.getPlateDisabledDataById(id);
        this.setDisabledData(this.renderPlateTree, arr);
      }else{
        return
      }
    },
    //设置禁用客户权限树
    /* setDisabledCustomerCheck() {
      let arr = this.getCustomerDisabledDataById(this.data._id);
      this.setDisabledData(this.renderCustomerTree, arr);
    },
    //设置禁用板块权限树的
    setDisabledPlateCheck() {
      let arr = this.getPlateDisabledDataById(this.data._id);
      this.setDisabledData(this.renderPlateTree, arr);
    }, */
    // 客户树的勾选事件
    onCheckChangeCustomer(obj, isCheck, childIsCheck) {
      let keys = this.$refs.customerRef.getCheckedKeys();
      let productIds = this.filterProductIds(keys);

      this.updateAuthSelectedIds('customer',productIds);
    },
    // 板块树的勾选事件
    onCheckChangePlate(obj, isCheck, childIsCheck) {
      let keys = this.$refs.plateRef.getCheckedKeys();
      this.updateAuthSelectedIds('plate',keys);
    },
    //type: 'customer' 或  'plate'
    updateAuthSelectedIds(type,idsArr){
      let obj = this.auth_selected_ids.find(i => i.id == this.data._id);
      let cloneObj = _.cloneDeep(obj);

      if (type=='customer') {
        cloneObj.customer_ids = idsArr;
      }else if (type=='plate') {
        cloneObj.plate_ids = idsArr;
      }
      this.update_auth_selected_ids(cloneObj);
    },
    /* onCheckChange(obj, isCheck, childIsCheck) {
      this.setCheckData();
    }, */
    // 禁用
    onStop() {
      this.data.auth_status = Disable;
    },
    //启用
    onStart() {
      this.data.auth_status = Enable;
    },
    onDelete() {
      this.$confirm(this.$t('lang.system_role_delete_permission_confirm'), this.$t('lang.public_dialog_point'), {
        confirmButtonText: this.$t('lang.public_button_confirm'),
        cancelButtonText: this.$t('lang.public_button_cancel'),
        type: "warning"
      })
        .then(() => {
          this.pop_auth_selected_ids_by_id(this.data._id);
          this.$dispatch("CreateEditRole", "DEL_AUTH_EVENT", this.data._id);
        })
        .catch(() => {
          // console.log("取消");
        });
    }
  }
};
</script>
<style scoped>
.auth-tree {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.auth-box-bottom {
  border-top: 1px solid #151b27;
  height: 44px;
  line-height: 44px;
  padding-left: 5px;
}
.auth-box-top {
  flex: 1;
  display: flex;
  overflow: hidden;
}
.auth-box-top .head {
  background-color: #49505a;  /*背景调换,系统管理->角色管理->新建角色->权限配置表头背景*/
  height: 32px;
  line-height: 32px;
  text-align: center;
  font-size: 12px;
}
.auth-box-tree {
  flex: 1;
  overflow: auto;
  padding-top: 20px;
}
.customer-auth {
  border-right: 1px solid #151b27;
}
.customer-auth,
.plate-auth {
  flex: 1;
  display: flex;
  flex-direction: column;
  /* width: 497px; */
}
</style>
<style>
.auth-list::-webkit-scrollbar,
.auth-box-tree::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
.create-role-form .el-tree {
  background-color: #2c323d;  /*背景调换,系统管理->角色管理->新建角色->权限配置权限tree背景*/
  height: 250px;
  overflow: auto;
}
.create-role-form .el-tree .el-checkbox__inner {
  border-radius: 0;
}
</style>