<template>
  <div v-loading.fullscreen='isLoading'>
    <div class="operatelog-content">
      <div class="clearfix breadcrumb-wrap">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '' }">
            <span class="breadcrumb-item-line">|</span>{{$t('lang.secondary_nav_operation_log')}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="clearfix">

          <el-select v-model="actAccount"
            style="width:170px;"
            size="mini"
            filterable
            clearable
            class="hy-input-with-title"
            @change='onChangeAccount'
            :placeholder="$t('lang.system_operate_account_placeholder')">
            <div slot="prefix"
              class="select-prefix">{{$t('lang.system_operate_account')}}:</div>
            <el-option v-for="user in selectLists.user_list"
              :key="user.id"
              :label="user.username"
              :value="user.id">
            </el-option>
          </el-select>

          <el-select v-model="actRole"
            style="width:170px;"
            size="mini"
            clearable
            class="hy-input-with-title"
            @change='onChangeRole'
            :placeholder="$t('lang.system_operate_role_placeholder')">
            <div slot="prefix"
              class="select-prefix">{{$t('lang.system_operate_role')}}:</div>
            <el-option  v-for="role in selectLists.role_list"
              :key="role.id"
              :label="role.role_name"
              :value="role.id"></el-option>
          </el-select>

          <el-select v-model="actObject"
            style="width:170px;"
            size="mini"
            filterable
            clearable
            class="hy-input-with-title"
            @change='onChangeSelect'
            :placeholder="$t('lang.system_operate_section_placeholder')">
            <div slot="prefix"
              class="select-prefix">{{$t('lang.system_operate_section')}}:</div>
            <el-option v-for="obj in selectLists.obj_list"
              :key="obj.act_object"
              :label="obj.act_object"
              :value="obj.act_object">
            </el-option>
          </el-select>

          <el-select v-model="actType"
            style="width:170px;"
            size="mini"
            filterable
            clearable
            class="hy-input-with-title"
            @change='onChangeSelect'
            :placeholder="$t('lang.system_operate_type_placeholder')">
            <div slot="prefix"
              class="select-prefix">{{$t('lang.system_operate_type')}}:</div>
            <el-option v-for="item in selectLists.name_list"
              :key="item.actionname"
              :label="item.actionname"
              :value="item.actionname">
            </el-option>
          </el-select>

          <el-date-picker size="mini"
            style="width: 194px;vertical-align: top;"
            v-model="dateRange"
            type="daterange"
            align="right"
            unlink-panels
            :clearable="true"
            :range-separator="$t('lang.public_DatePicker_between')"
            :start-placeholder="$t('lang.public_DatePicker_start')"
            :end-placeholder="$t('lang.public_DatePicker_end')"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            @change="changeDate()">
          </el-date-picker>
          <el-input size="mini"
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

      <div style="margin-top:20px;">
        <el-table :data="tableList"
          :border="table_border"
          style="width: 100%">
          <el-table-column prop="act_time"
            :label="$t('lang.system_operate_table_config.act_time')"
            width="150">
            <!-- <template slot-scope="scope">
              <div style="margin-left: 30px;">{{scope.row.username}}</div>
            </template> -->
          </el-table-column>
          <el-table-column prop="username"
            :label="$t('lang.system_operate_table_config.username')">
          </el-table-column>
          <el-table-column prop="role_name"
            :label="$t('lang.system_operate_table_config.role_name')">
          </el-table-column>
          <el-table-column prop="act_model"
            :label="$t('lang.system_operate_table_config.act_model')">
          </el-table-column>
          <el-table-column prop="act_object"
            width="300"
            :label="$t('lang.system_operate_table_config.act_object')">
          </el-table-column>
          <el-table-column prop="actionname"
            :label="$t('lang.system_operate_table_config.actionname')">
          </el-table-column>

          <el-table-column :label="$t('lang.system_operate_table_config.operate')"
            width="160"
            class-name="operate">
            <template slot-scope="scope">
              <el-popover placement="top"
                title=""
                popper-class="operatelog-popover"
                width="400"
                trigger="click">
                <span v-if="isTableData(scope.row.changes)"
                  style="color: #fff;
                  display: flex;
                  justify-content: center;
                  padding: 13px;">
                  {{getPopoverData(scope.row.changes)[0]['msg']}}
                </span>
                <el-table v-else :data="getPopoverData(scope.row.changes)">
                  <el-table-column width="100"
                    property="key"
                    :label="$t('lang.system_operate_table_config.key')"></el-table-column>
                  <el-table-column width="150"
                    property="old"
                    :label="$t('lang.system_operate_table_config.old')"></el-table-column>
                  <el-table-column width="150"
                    property="new"
                    :label="$t('lang.system_operate_table_config.new')"></el-table-column>
                </el-table>
                <i class="iconfont icon-index-detail"
                  slot="reference"
                  style="margin-left:0"
                  :title="$t('lang.public_tooltip_detail')"></i>
              </el-popover>

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

  </div>
</template>

<script>
import _ from "lodash";
import { mapState, mapGetters, mapActions } from "vuex";
import moment from "moment";
import fetch from "@/services/fetch";
import Vue from "vue";
import theme from '@/views/mixin/theme/table-border';

export default {
  name: "UserManage",
  components: {},
  mixins: [theme],
  data() {
    return {
      actRole: "",
      actAccount: "",
      actObject: "",
      actType: "",
      dateRange: [],
      selectLists:{},
      // selectRoleId:"",
      // selectUserId:"",

      isLoading: false,
      currentPage: 1,
      pageSize: 5,
      total: 0,
      keyWord: "",
      tableList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now(); // - 24 * 60 * 60 * 1000; //禁用今天以后
        },
        shortcuts: this.$datePickerShortcuts
      }
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
    this.init()
  },

  mounted() {},
  computed: {
    ...mapGetters("user", ["isRoot"]),
    ...mapState("system", ["agent_id"]),
    ...mapState("permissions", ["userManage_permission"])
  },
  watch: {
    agent_id(n,o){
      this.reset()
    },
  },

  methods: {
    async reset() {
      this.actRole = "";
      this.actAccount = "";
      this.actObject = "";
      this.actType = "";
      this.dateRange = [];
      // this.selectRoleId = ''
      // this.selectUserId = ''
      this.selectLists = {}
      this.currentPage = 1
      this.keyWord = ''

      this.init();
    },
    init(){
      Promise.all([this.fetchList(), this.getSelectList()])
      .then(arr => {
        this.isLoading = false;
        let [list, selects] = arr;
        this.selectLists = selects;
      }).catch(e => {
        this.isLoading = false;
        console.error(e);
      });
    },
    isTextCenter(arrStr){
      if (!this.isTableData(arrStr)) {
        return {
          textAlign: 'center',
        }
      }
    },
    isTableData(arrStr){
      let arr = this.getPopoverData(arrStr);
      if (arr.length > 0) {
        return arr[0].hasOwnProperty('msg')
      }else{
        return false
      }
    },
    getPopoverData(arrStr){
      try {
        let arr = JSON.parse(arrStr);
        return arr;
      } catch (err) {
        console.error(err);
        return [];
      }finally {
      //to do
      }
    },
    changeDate() {
      this.refresh();
    },
    refresh(){
      this.currentPage = 1;
      this.fetchList();
    },
    async onChangeRole(val) {
      // this.selectRoleId = val;
      this.actAccount = '';
      let data = await this.getSelectList();
      this.$set(this.selectLists,"user_list",data.user_list)
      // this.actAccount =''
      this.refresh();
    },
    async onChangeAccount(val) {
			console.log('TCL: onChangeAccount -> val', val)
      // this.actAccount = val;
      let data = await this.getSelectList();
      this.$set(this.selectLists,"role_list",data.role_list)
      if (data.role_list.length) {
        this.actRole =data.role_list[0]['id']
      }else{
        this.actRole = ''
      }
      
      this.refresh();
    },
    onChangeSelect() {
      this.refresh();
    },
    onSearch() {
      this.refresh();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetchList();
    },
    async getSelectList() {
      try {
        let obj = {};
        obj.role_id = this.actRole
        // obj.role_id = this.selectRoleId
        obj.uid = this.actAccount
        // obj.uid = this.selectUserId
        this.isLoading = true;
        let data = await fetch.post("/actionlog/selectlist",obj);
        this.isLoading = false;
        return data;
      } catch (err) {
        // this.$message.error("删除角色失败，请稍后重试");
        throw err;
        return {};
      } finally {
        this.isLoading = false;
      }
    },

    
    async fetchList() {
      try {
        let param = {};
        param.role_id = this.actRole;
        param.uid = this.actAccount;
        param.model = this.actObject;
        param.type = this.actType;
        param.word = this.keyWord;
        param.start_date = "";
        param.end_date = "";
        if (this.dateRange&&this.dateRange.length) {
          param.start_date = this.dateRange[0];
          param.end_date = this.dateRange[1];
        }

        param.page = this.currentPage;
        param.perpage = this.pageSize;

        this.isLoading = true;
        let data = await fetch.post("/actionlog/loglist", param);

        this.tableList = data.list;
        this.total = data.total - 0;
      } catch (err) {
        // this.$alert(err || "默认错误", "提示");
        // console.log("内层catch:", err.message);
        // console.log("内层catch:", err);
        this.$message.error(this.$t('lang.system_operate_fail_get_role_list'));
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
  }
};
</script>
<style scoped>
.operatelog-content {
  margin-right: 20px;
  margin-left: 20px;
  /* padding-top: 31px; */
}

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
.operatelog-content .hy-input-with-title .el-input--prefix .el-input__inner {
  padding-left: 55px;
  /* padding-left: 50px; */
}
.operatelog-popover .el-table{
max-height: 600px;
    overflow: auto;
}
</style>
