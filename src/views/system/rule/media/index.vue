<template>
  <div v-loading="isLoading">
    <el-table :data="tableList"
      min-height="500"
      :border="table_border"
      style="width: 100%;">

      <el-table-column prop="sort"
        :label="$t('lang.system_rule_media_table_config.sort')">
        <template slot-scope="scope">
          {{scope.row.sort>9?scope.row.sort:0+scope.row.sort}}
        </template>
      </el-table-column>

      <el-table-column prop="name"
        :label="$t('lang.system_rule_media_table_config.name')">
      </el-table-column>

      <el-table-column prop="utime"
        :label="$t('lang.system_rule_media_table_config.utime')">
      </el-table-column>

      <el-table-column prop="status"
        width="80"
        :label="$t('lang.system_rule_media_table_config.status')">
        <template slot-scope="scope">
          <span v-if="scope.row.status==1" class="hy-font-green" style='color:#42a996'>{{$t('lang.system_rule_media_table_config.status_on')}}</span>
          <span v-else class="hy-font-yellow" style='color:#ffcc00'>{{$t('lang.system_rule_media_table_config.status_off')}}</span>
        </template>
      </el-table-column>
     
      <el-table-column :label="$t('lang.system_rule_media_table_config.rank')"
        v-if="ruleManage_permission==1"
        width="240"
        class-name="sort">
        <template slot-scope="scope">
          <i class="icon-arrow-top-first iconfont "
            @click="toTop(scope.row)"
            :title="$t('lang.public_tooltip_first')"></i>
          <i class="icon-arrow-top iconfont "
            @click="toUp(scope.row)"
            :title="$t('lang.public_tooltip_arrow_top')"></i>
          <i class="icon-arrow-down iconfont "
            @click="toDown(scope.row)"
            :title="$t('lang.public_tooltip_arrow_down')"></i>
          <i class="icon-arrow-down-last iconfont "
            @click="toBottom(scope.row)"
            :title="$t('lang.public_tooltip_lsat')"></i>

          <el-input :placeholder="$t('lang.public_tooltip_sort')" style="width:80px;"
            v-model="scope.row.number" size="mini">
            <span slot="append" @click="goPosition(scope.row)">Go</span>
          </el-input>

        </template>
      </el-table-column>

      <el-table-column :label="$t('lang.system_rule_media_table_config.operate')"
        v-if="ruleManage_permission==1"
        width="140"
        class-name="operate">
        <template slot-scope="scope">
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
      </el-table-column>

    </el-table>
    <div class="pagination-wrap clearfix">
      <el-pagination background
        @size-change="onSizeChange"
        class="pull-right"
        @current-change="onCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10,20,50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
    <media-edit v-if="isShowEditDialog"
       :isShow.sync="isShowEditDialog"
       v-bind="editContent" />
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";
import MediaEdit from "./create-edit";
import theme from '@/views/mixin/theme/table-border'

export default {
  name: "RuleMedia",
  componentName:"RuleManageChild",
  components: {
    MediaEdit
  },
  mixins: [theme],
  data() {
    return {
      editContent:{
        id: "",
        name: "",
        isNew:false
      },
      isShowEditDialog:false,
      isLoading: false,
      total: 10, //总页数
      pageSize: 5, //每页几条数据
      currentPage: 1, //当前页面
      tableList: [],
      goPage:'',
      keywords:''
    };
  },
  watch: {
    agent_id(n,o){
      this.fetchList()
    },
  },
  computed: {
    ...mapState("system", ["agent_id"]),
    ...mapState("permissions", ["ruleManage_permission"]),
  },
  created() {
    this.$on("onSearch", keywords=>{
      this.keywords = keywords;
      this.currentPage = 1;
      this.fetchList();
    });
    this.$eventHub.$on("refreshMediaList", () => {
      this.fetchList();
    });
  },
  mounted() {
    this.fetchList();
  },
  methods: {
    toTop({sort}){
      let param = {"type":"first",sort};
      this.fetchChangePositon(param);
    },
    toUp({sort}){
      let param = {"type":"prev",sort};
      this.fetchChangePositon(param);
    },
    toDown({sort}){
      let param = {"type":"next",sort};
      this.fetchChangePositon(param);
    },
    toBottom({sort}){
      let param = {"type":"last",sort};
      this.fetchChangePositon(param);
    },
    async fetchChangePositon(param){
      await this.fetchCore('/medias/changepositon', param);
      this.fetchList();
    },
    goPosition({sort,number}){
       if (this.$constReg.positiveInt.test(number+'')) {
        this.fetchGoPositon({sort,number});
      }else{
        this.$message.error(this.$t('lang.reg_sort_positive_integer'));
      }
    },
    async fetchGoPositon(param){
      await this.fetchCore('/medias/goposition', param);
      this.fetchList();
    },
    async fetchChangeStatus({id,status}){
      await this.fetchCore('/medias/changestauts', { id });
      this.updataStatus(id,status);
    },
    updataStatus(id,status){
      let obj = this.tableList.find(i=>i.id==id);
      obj.status = status=='1'?'0':'1';
    },
    onEdit({id,name}){
      this.editContent.id = id;
      this.editContent.name = name;
      this.isShowEditDialog = true;
    },
    onSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.fetchList();
    },
    onCurrentChange(val) {
      this.currentPage = val;
      this.fetchList();
    },
    //
    async fetchList() {
      let page = this.currentPage;
      let perpage = this.pageSize;
      let media = this.keywords;
      let url = "/medias/medialists";
      let _data = await this.fetchCore(url, { page, perpage,media });
      this.total = _data.total - 0;
      for (let item of this.tableList) {
        item.number = '';
      }
      this.tableList = _data.lists;
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
    },
  }
};
</script>
<style scoped>

</style>
<style>
</style>
