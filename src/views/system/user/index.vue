<template>
  <div v-loading.fullscreen='isLoading'>
    <div class="role-content">
      <div class="clearfix breadcrumb-wrap content-header">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '' }">
          <span class="breadcrumb-item-line">|</span>{{$t('lang.secondary_nav_users_manage')}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="clearfix content-header">
        <el-button icon="el-icon-plus pull-left" v-if="userManage_permission==1"
            @click="onNew">{{$t('lang.system_user_add')}}</el-button>

        <template v-if="isRoot">
          <el-select v-model="agentLevel"
            style="width:130px;margin-left:5px"
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
            style="width:130px;margin-left:5px"
            size="mini"
            filterable
            clearable
            @change='onChangeAgent'
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
            v-model="keyWord"
            @keyup.enter.native="onSearch">
          <i slot="prefix"
              class="el-input__icon el-icon-search"
              @click="onSearch"
              style="cursor: pointer;"></i>
        </el-input>
      </div>

      <div style="margin-top:20px;" class="content-body">
        <el-table :data="tableList"
            :border="table_border"
            style="width: 100%">
          <el-table-column prop="username"
              :label="$t('lang.system_user_table_config.username')"
              width="150">
            <!-- <template slot-scope="scope">
              <div style="margin-left: 30px;">{{scope.row.username}}</div>
            </template> -->
          </el-table-column>
          <template v-if="isRoot">
            <el-table-column prop="agent_level_name"
              width="100"
                :label="$t('lang.system_user_table_config.agent_level_name')">
            </el-table-column>
            <el-table-column prop="agent_name"
                :label="$t('lang.system_user_table_config.agent_name')">
            </el-table-column>
          </template>
          <el-table-column prop="role_name"
              :label="$t('lang.system_user_table_config.role_name')">
          </el-table-column>
          <el-table-column prop="ctime"
              :label="$t('lang.system_user_table_config.ctime')">
          </el-table-column>
          <el-table-column prop="utime"
              :label="$t('lang.system_user_table_config.utime')">
          </el-table-column>
          <el-table-column prop="status"
            width="100"
              :label="$t('lang.system_user_table_config.status')">
            <template slot-scope="scope">
              <span v-if="scope.row.status==1"
                  class="hy-font-green">{{$t('lang.system_user_table_config.status_en')}}</span>
              <span v-else
                  class="hy-font-yellow">{{$t('lang.system_user_table_config.status_un')}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('lang.system_role_table_config.operate')"
              width="160"
              class-name="operate">
            <template slot-scope="scope">
              <i class="iconfont icon-index-detail"
                  style="margin-left:0"
                  @click="onDetail(scope.row.uid)"
                  :title="$t('lang.public_tooltip_detail')"></i>
              <template v-if="userManage_permission==1">
                <i class="iconfont icon-qidong"
                  v-if="scope.row.status==0"
                  @click="fetchChangeStatus(scope.row)"
                  :title="$t('lang.public_tooltip_on')"></i>
                <i class="iconfont icon-tingzhi"
                    v-if="scope.row.status==1"
                    @click="fetchChangeStatus(scope.row)"
                    :title="$t('lang.public_tooltip_off')"></i>
                <i class="iconfont icon-list-edit"
                    @click="onEdit(scope.row)"
                    :title="$t('lang.public_tooltip_edit')"></i>
              </template>

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

    <create-edit v-if='isShowNewEditDialog'
        :id="userId"
        :isShow.sync="isShowNewEditDialog"
        @save="handleSave" />

    <user-detail v-if='isShowDetailDialog'
        :id="userId"
        :isShow.sync="isShowDetailDialog" />
  </div>
</template>

<script>
import _ from "lodash";
import { mapState, mapGetters, mapActions } from "vuex";
import moment from "moment";
import fetch from "@/services/fetch";
import createEdit from "./create-edit";
import userDetail from "./detail";
import Vue from "vue";
import theme from '@/views/mixin/theme/table-border';

export default {
  name: "UserManage",
  components: {
    createEdit,
    userDetail
  },
  mixins: [theme],
  data() {
    return {
      agent:'',
      agentLevel:'',
      isLoading: false,
      userId: "", //当前操作的用户id
      currentPage: 1,
      pageSize: 5,
      total: 0,
      isShowDetailDialog: false,
      isShowNewEditDialog: false,
      keyWord: "",
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
  },
  mounted() {
    this.fetchList();
  },
  computed: {
    ...mapGetters("user", ["isRoot"]),
    ...mapState("system", ["agentList"]),
    ...mapState("permissions", ["userManage_permission"]),

  },
  watch: {},

  methods: {
    onChangeLevel(){
      this.currentPage = 1;
      this.fetchList();
    },
    onChangeAgent(){
      this.currentPage = 1;
      this.fetchList();
    },
    renderHeader(h, { column, $index }) {
      return h("div", { style: "margin-left:30px;padding-left: 0px;" }, column.label);
    },
    onDetail(id) {
      this.isShowDetailDialog = true;
      this.userId = id;
    },
    async fetchChangeStatus(obj) {
      let uid = obj.uid;
      try {
        this.isLoading = true;
        let data = await fetch.post("/user/changestatus", { uid });
        // console.log('fetchList OK',data);
        this.isLoading = false;
        obj.status = obj.status == 1 ? "0" : "1";
        // this.tableList = data;
      } catch (err) {
        // this.$alert(err || "默认错误", "提示");
        // console.log("内层catch:", err.message);
        // console.log("内层catch:", err);
        this.$message.error(err.message);
        throw err;
      }
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.fetchList();
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchList();
    },

    onNew() {
      this.isShowNewEditDialog = true;
      this.userId = "";
    },
    onDelete(obj) {
      this.$confirm("您确定要删除该角色吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          try {
            let role_id = obj.uid;
            this.isLoading = true;
            let data = await fetch.post("/role/deleterole", { role_id });
            // console.log(data);
            this.isLoading = false;
            this.fetchList();
          } catch (err) {
            this.$message.error("删除角色失败，请稍后重试");
            throw err;
          }
        })
        .catch(() => {
          // console.log("取消");
        });
    },
    onEdit(obj) {
      this.isShowNewEditDialog = true;
      this.userId = obj.uid;
    },
    onSearch() {
      // console.log("onSearch");
      this.currentPage = 1;
      this.fetchList();
    },
    async fetchList() {
      try {
        let name = this.keyWord;
        let page = this.currentPage;
        let perpage = this.pageSize;
        let agent_level = this.agentLevel;
        let agent_id = this.agent;
        this.isLoading = true;
        let data = await fetch.post("/user/userlist", { agent_id,agent_level,name, page, perpage });
        this.isLoading = false;
        this.tableList = data.list;
        this.total = data.total - 0;
      } catch (err) {
        // this.$alert(err || "默认错误", "提示");
        // console.log("内层catch:", err.message);
        // console.log("内层catch:", err);
        this.isLoading = true;
        this.$message.error("获取角色列表失败，请稍后重试");
        throw err;
      }
    },
    handleSave() {
      this.currentPage = 1;
      this.fetchList();
    }
  }
};
</script>
<style scoped>
.role-content {
  margin-right: 20px;
  margin-left: 20px;
  /* padding-top: 31px; */
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
.detail-ico {
  font-size: 18px;
}
</style>
<style>
/*全局部分*/
</style>
