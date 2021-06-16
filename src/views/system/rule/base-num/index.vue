<template>
  <div v-loading="isLoading" class="rule-base-num">
    <div class="base-num-bar">
      <span class='text'>保底基数：</span>
      <template v-if='!isEditBaseNum'>
        <span class='text'>{{baseNumber}}</span>
        <i class="iconfont icon-list-edit ico"
          title="编辑"
          v-if="ruleManage_permission==1"
          @click="clickEditBaseNum"></i>
      </template>
      <template v-else>
        <el-form size="mini"
          ref="baseNumform"
          style="display:inline;"
          :inline='true'
          :model="baseNumform"
          :show-message='false'
          :rules="baseNumRules">
          <el-form-item prop="num">
            <el-input class="hy-small-padding-input hy-mini-input"
              style="width:46px;"
              ref="baseNum"
              size="mini"
              placeholder="基数"
              v-model="baseNumform.num" />
          </el-form-item>

        </el-form>
        <el-button icon="el-icon-check"
          size='mini'
          @click="confirmBaseNum"></el-button>
        <el-button plain
          icon="el-icon-close"
          size='mini'
          @click="cancelBaseNum"></el-button>
      </template>
    </div>
    <el-table :data="tableList"
      min-height="500"
      :border="table_border"
      style="width: 100%;">

      <el-table-column prop="base_number"
        width="140"
        label="保底基数">
      </el-table-column>

      <el-table-column prop="ctime"
        label="更新时间">
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
  </div>
</template>
<script>
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";
import { mapState, mapGetters, mapActions } from "vuex";
import theme from '@/views/mixin/theme/table-border'
export default {
  name: "RuleBaseNum",
  mixins: [theme],
  data() {
    let validateBaseNum = (rule, value, callback) => {
      var value = _.trim(value);
      if (value == "") {
        callback(new Error(" "));
        this.$message.error("保底基数不能为空");
      } else {
        if (this.$constReg.nonnegativeInt.test(value)) {
          callback();
        } else {
          callback(new Error(" "));
          this.$message.error("保底基数只允许输入非负整数");
        }
      }
    };
    return {
      isEditBaseNum:false,
      baseNumber:'0',
      baseNumform:{
        num:''
      },
      baseNumRules:{
        num: [{ required: true, validator:validateBaseNum, trigger: "blur" }]
      },
      isLoading: false,
      total: 10, //总页数
      pageSize: 5, //每页几条数据
      currentPage: 1, //当前页面
      tableList: [],
      goPage: ""
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
  created() {},
  mounted() {
    this.fetchList();
  },
  methods: {
    confirmBaseNum(){
      this.$refs["baseNumform"].validate(valid => {
        if (valid) {
          this.fetchUpdateBaseNum();
        } else {
          this.$message.error("请正确填写页面中不正确的数据");
        }
      });
    },
    cancelBaseNum(){
      this.isEditBaseNum = false;
    },
    clickEditBaseNum() {
      this.isEditBaseNum = true;
      this.baseNumform.num = this.baseNumber;
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
    async fetchUpdateBaseNum() {
      let url = "/basenumber/updatebasenumber";
      let base_number = this.baseNumform.num;
      await this.fetchCore(url, { base_number });
      this.baseNumber = base_number;
      this.isEditBaseNum = false;
      this.fetchList();
    },
    async fetchList() {
      let page = this.currentPage;
      let perpage = this.pageSize;
      // let media = '';
      let url = "/basenumber/lists";
      let _data = await this.fetchCore(url, { page, perpage });
      this.tableList = _data.lists;
      this.total = _data.total - 0;
      this.baseNumber = _data.base_number;
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

</style>
<style>
.rule-base-num .el-form-item--mini .el-form-item__content{
  line-height: 40px;
}
</style>
<style lang="scss" scoped>
.base-num-bar{
  height: 40px;
  line-height: 40px;
  .text{
    color: #fff;
  }
  .ico{
    cursor: pointer;
    color: #fff;
    opacity: 0.6;
    font-size: 16px;
    margin-left: 10px;
    &:hover{
      opacity: 0.8;
    }
  }
}
</style>
