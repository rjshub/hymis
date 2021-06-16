<template>
  <div v-loading.fullscreen='isLoading'>
    <div class="role-content">
      <div class="clearfix breadcrumb-wrap content-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '' }">
          <span class="breadcrumb-item-line">|</span>{{$t('lang.secondary_nav_roles_manage')}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="clearfix content-header">
        <el-button icon="el-icon-plus pull-left" v-if="roleManage_permission==1"
          @click="onNew">{{$t('lang.system_add_new_role')}}</el-button>
         <template v-if="isRoot">
          <el-select v-model="agentLevel"
            style="width:140px;margin-left:5px"
            size="mini"
            clearable
            @change='onChangeLevel'
            :placeholder="$t('lang.public_role_level_placeholder')">
            <el-option key="0"
              :label="$t('lang.public_all_level_label')"
              value=""></el-option>
            <el-option key="1"
              :label="$t('lang.public_level1_label')"
              value="1"></el-option>
            <el-option key="2"
              :label="$t('lang.public_level2_label')"
              value="2">
            </el-option>
          </el-select>
          
          <el-select v-model="agent"
            style="width:140px;margin-left:5px"
            size="mini"
            filterable
            clearable
            @change="onChangeAgent"
            :placeholder="$t('lang.layout_agent_placeholder')">
            <el-option key="0"
              :label="$t('lang.public_all_agent')"
              value=""></el-option>
            <el-option v-for="item in agentList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </template>

        <el-input size="mini"
          class="pull-right"
          style="width:180px;vertical-align:bottom;"
          :placeholder="$t('lang.public_key_words')"
          v-model="form.keyWords"
          @keyup.enter.native="refresh">
          <i slot="prefix"
            class="el-input__icon el-icon-search"
            @click="refresh"
            style="cursor: pointer;"></i>
        </el-input>
      </div>
      <div style="margin-top:20px;" class="content-body">
        <el-table :data="tableList"
          min-height="500"
          :border="table_border"
          style="width: 100%;">
          <el-table-column prop="role_name"
            width="250"
            :label="$t('lang.system_role_table_config.role_name')">
            <!-- <template slot-scope="scope">
              <div style="margin-left: 30px;">{{scope.row.role_name}}</div>
            </template> -->
          </el-table-column>
          <template v-if="isRoot">
            <el-table-column prop="agent_level_name"
              width="100"
                :label="$t('lang.system_role_table_config.agent_level_name')">
            </el-table-column>
            <el-table-column prop="agent_name"
                :label="$t('lang.system_role_table_config.agent_name')">
            </el-table-column>
          </template>
         
          <el-table-column prop="ctime"
            :label="$t('lang.system_role_table_config.ctime')">
          </el-table-column>
          <el-table-column prop="utime"
            :label="$t('lang.system_role_table_config.utime')">
          </el-table-column>
          <el-table-column prop="status"
            width="100"
              :label="$t('lang.system_role_table_config.status')">
            <template slot-scope="scope">
              <span v-if="scope.row.role_status==0"
                  class="hy-font-green">{{$t('lang.system_role_table_config.status_en')}}</span>
              <span v-else
                  class="hy-font-yellow">{{$t('lang.system_role_table_config.status_un')}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('lang.system_role_table_config.operate')" v-if='roleManage_permission==1'
            width="140"
            class-name="operate">
            <template slot-scope="scope">
              <i class="iconfont icon-list-edit"
                style="margin-left:0"
                @click="onEdit(scope.row)"
                :title="$t('lang.public_tooltip_edit')"></i>
              <!-- <i class="icon-list-delete"
                @click="onDelete(scope.row)"
                title='删除'></i> -->
              <i class="iconfont icon-qidong"
                  v-if="scope.row.role_status==1"
                  @click="fetchChangeStatus(scope.row)"
                  :title="$t('lang.public_tooltip_on')"></i>
              <i class="iconfont icon-tingzhi"
                  v-if="scope.row.role_status==0"
                  @click="fetchChangeStatus(scope.row)"
                  :title="$t('lang.public_tooltip_off')"></i>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-wrap clearfix">
          <el-pagination background
            @size-change="handleSizeChange"
            class="pull-right"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[5, 10,20,50]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>
    </div>

    <create-edit v-if='isShowDialog'
      :role-id="editRoleId"
      :isShow.sync="isShowDialog" />

  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";
import createEdit from "./create-edit";
import Vue from "vue";
import theme from '@/views/mixin/theme/table-border'

export default {
  name: "RoleManage",
  componentName: "RoleManage",
  components: {
    createEdit
  },
  mixins: [theme],
  data() {
    return {
      agent:'',
      agentLevel:'',
      isLoading: false,
      total: 10, //总页数
      pageSize: 5, //每页几条数据
      currentPage: 1, //当前页面
      editRoleId: "", //正在编辑的角色的id   该值为空，表示新建，否则为编辑
      isShowDialog: false,
      form: {
        keyWords: ""
      },
      tableList: []
    };
  },
  props: {
    values: {
      type: Object,
      required: false,
      default: () => {
        return {};
      }
    }
  },
  created() {
    this.fetch_role_list();
    this.$on("REFRESH", this.fetch_role_list);
  },
  mounted() {},
  computed: {
    ...mapGetters("user", ["isRoot"]),
    ...mapState("system", ["agentList"]),
    ...mapState("permissions", ["roleManage_permission"]),
  },
  watch: {},

  methods: {
    async fetchChangeStatus(obj) {
      let role_id = obj.id;
      try {
        this.isLoading = true;
        let data = await fetch.post("/role/changerolestatus", { role_id });
        this.isLoading = false;
        obj.role_status = obj.role_status == 1 ? "0" : "1";
      } catch (err) {
        this.$message.error(err.message);
        throw err;
      }
    },
    onChangeLevel(){
      this.currentPage = 1;
      this.fetch_role_list();
    },
    onChangeAgent(){
      this.currentPage = 1;
      this.fetch_role_list();
    },
    renderHeader(h, { column, $index }) {
      return h(
        "div",
        { style: "margin-left:30px;padding-left: 0px;" },
        column.label
      );
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.fetch_role_list();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetch_role_list();
    },
    onNew() {
      this.isShowDialog = true;
      this.editRoleId = "";
    },
    onDelete(obj) {
      let msg = this.$t('lang.system_role_no_user_delete_confirm');
      if (obj.uid != "0") {
        msg = this.$t('lang.system_role_users_delete_confirm');
      }
      this.$confirm(msg, this.$t('lang.public_dialog_point'), {
        confirmButtonText: this.$t('lang.public_button_confirm'),
        cancelButtonText: this.$t('lang.public_button_cancel'),
        type: "warning"
      })
        .then(async () => {
          try {
            let role_id = obj.id;
            this.isLoading = true;
            let data = await fetch.post("/role/deleterole", { role_id });
            // console.log(data);
            this.isLoading = false;
            this.fetch_role_list();
          } catch (err) {
            this.$message.error(this.$t('lang.system_role_delete_fail'));
            throw err;
          }
        })
        .catch(() => {
          console.log("取消");
        });
    },
    onEdit(obj) {
      this.isShowDialog = true;
      this.editRoleId = obj.id;
    },
    refresh() {
      this.currentPage = 1;
      this.fetch_role_list();
    },

    async fetch_role_list() {
      this.isLoading = true;
      try {
        let name = this.form.keyWords;
        let page = this.currentPage;
        let perpage = this.pageSize;
        let agent_level = this.agentLevel;
        let agent_id = this.agent;
        let res = await fetch.post("/role/rolelist", { agent_id,agent_level,name, page, perpage });
        this.isLoading = false;
        this.tableList = res.list;
        this.total = res.total - 0;
      } catch (err) {
        this.isLoading = false;
        this.$message.error(err.message);
        throw err;
      }
    },

    test() {}
  }
};
</script>
<style scoped>
.role-content {
  margin-right: 20px;
  margin-left: 20px;
}
/* .content-header,.content-body {
  padding: 0 20px;
} */

.operate i {
  margin-left: 20px;
  margin-top: 12px;
  cursor: pointer;
  opacity: 0.6;
  display: inline-block;
  color: white;
  font-size: 30px;
  width: 24px;
  height: 24px;
  line-height: 12px;
}
.operate i:hover {
  opacity: 0.8;
}
</style>
<style>
/*全局部分*/
</style>