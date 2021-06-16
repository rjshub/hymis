<template>
    <hy-dialog :visible="true"
        title="Score Card"
        custom-class='score-card'
        @close="onClose"
        :heightFillBody='true'
        :close-on-click-modal="false">
        <div class="box"
            v-loading='isLoading'
            style="height: 100%">
            <div class="head">
                <!-- 两个下拉过滤 start -->
                <el-select v-model="market"
                    @change="onClickSelect('market')"
                    class="select"
                    :disabled='disabled_c'
                    style=" margin-right: 6px;"
                    size="mini"
                    filterable
                    placeholder="Market">
                    <el-option key=""
                        :label="$t('lang.AS_detail_basic_data_market_label')"
                        value="">
                    </el-option>
                    <el-option v-for="item in marketList "
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>

                <el-select v-model="media"
                    class="select"
                    @change="onClickSelect('media')"
                    :disabled='disabled_c'
                    size="mini"
                    style=" margin-right: 12px;"
                    filterable
                    placeholder="Media">
                    <el-option key=""
                        :label="$t('lang.AS_detail_basic_data_media_label')"
                        value="">
                    </el-option>
                    <el-option v-for="item in mediaList "
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
                <!-- 两个下拉过滤 end -->
                <!-- 保底基数 start -->
                <template v-if="false&&user_id==1">
                    <span style="color:#fff">{{$t('lang.AS_detail_score_card_guaranteed_base')}}：</span>
                    <template v-if='!isEditBaseNum'>
                        <span style="color:#fff">{{baseNumber}}</span>
                        <i class="iconfont icon-list-edit ico"
                            :title="$t('lang.public_tooltip_edit')"
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
                </template>
                <!-- 保底基数 end -->
                <!-- <span v-show="percentSum!=1" style="color:#fee01a;padding-left:10px;" :style="remind_text">权重和不等于100%</span> -->
                <span v-show="percentSum!=1"
                    style="padding-left:10px;"
                    :style="remind_text">{{$t('lang.reg_proportion_sum_error_msg')}}</span>
            </div>
            <!-- table start -->
            <el-form size="mini"
                ref="form"
                :model="form"
                class="score-card-fixed-table"
                style="height:calc(100% - 58px)"
                :show-message='false'
                :rules="rules">
                <el-table :data="tableData"
                    :show-header='true'
                    border
                    height='100%'>

                    <el-table-column prop="market"
                        label="Market"
                        fixed="left"
                        min-width="120px">
                    </el-table-column>

                    <el-table-column prop="media"
                        label="Media"
                        fixed="left"
                        min-width="120px">
                    </el-table-column>

                    <el-table-column prop="ranking"
                        :label="$t('lang.public_tooltip_ranking')"
                        fixed="left"
                        min-width="70px">
                    </el-table-column>

                    <el-table-column prop="total_score"
                        :label="$t('lang.public_tooltip_total_score')"
                        fixed="left"
                        min-width="100px">
                        <template slot-scope="scope">
                            {{$formatNumber(scope.row['total_score'],4,'')}}
                        </template>
                    </el-table-column>

                    <table-column v-if="index>2"
                        v-for="(item,index) in tableHeadData"
                        :notEqual100='percentSum!=1'
                        :props='defaultProps'
                        :key="index"
                        :operateStatus='userOperateStatus'
                        :form='form'
                        :has-only-one='tableHeadData.length==4'
                        :is-last='index==tableHeadData.length-1'
                        :column-data="item">
                    </table-column>

                </el-table>
                <!-- table end -->
            </el-form>

        </div>
        <div slot="footer"
            v-if="enableWriteCreateProject">
            <!-- <el-button plain
          @click="onClose">取消</el-button> -->
            <el-upload style="display:inline-block"
                :data='{project_id:projectID}'
                action="/api/scorecard/importscorecard"
                :show-file-list="false"
                accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'
                :on-error='handleError'
                :before-upload='handleBeforeUpload'
                :on-success="handleSuccess">
                <el-button plain>{{$t('lang.public_upload_again')}}</el-button>
            </el-upload>
            <el-button @click="onSubmit">{{$t('lang.public_button_submit')}}</el-button>
        </div>
    </hy-dialog>

</template>

<script>
import math from "mathjs";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";
import tableColumn from "./table-column";
import theme from "@/views/mixin/theme/remind-text.vue";
const Newing = "Newing";
const Editing = "Editing";
export default {
  name: "score-card",
  componentName: "ScoreCard",
  components: { tableColumn },
  mixins: [theme],
  props: {
    isShow: {
      type: [Boolean],
      required: true,
    },
  },
  provide() {
    return {
      userOperateStatus: this.userOperateStatus,
      loading: this.loading,
    };
  },
  data() {
    let validatePercent = (rule, value, callback) => {
      var value = _.trim(value);
      if (value == "") {
        callback(new Error(" "));
        this.$message.error(this.$t("lang.reg_percents_required"));
      } else {
        if (this.$constReg.positiveInt.test(value)) {
          if (Number.parseFloat(value) < 0 || Number.parseFloat(value) > 100) {
            callback(new Error(" "));
            this.$message.error(this.$t("lang.reg_percents_min_max"));
          } else {
            callback();
          }
        } else {
          callback(new Error(" "));
          this.$message.error(this.$t("lang.reg_percents_error_msg"));
        }
      }
    };
    return {
      baseNumform: { num: "" },
      baseNumRules: {
        num: [{ required: true, message: this.$t("lang.reg_base_required"), trigger: "blur" }],
      },
      //'baseNum' 保底基数修改中
      // 'Newing'  新建列中
      // 'Editing'  编辑列中
      userOperateStatus: "", //用户的操作状态  ’‘为用户没有任何操作
      defaultProps: {
        field: "id",
        name: "title",
        percent: "weight",
        status: "type",
      },
      form: {
        field: "",
        name: "",
        percent: "",
      },
      // modifyNum: 0,
      // confirmNum: 0,
      isEditBaseNum: false, //保底基数的编辑状态
      // baseNumber_tem: 3, //保底基数 临时变量
      baseNumber: 50, //保底基数
      market: "",
      media: "",
      marketList: [],
      mediaList: [],
      isLoading: false,
      rules: {
        // name: [{ required: true, validator: validateTime, trigger: "change" }],
        name: [{ required: true, message: this.$t("lang.reg_name_required"), trigger: "blur" }],
        percent: [{ required: true, validator: validatePercent }],
      },
      tableData: [],
      tableHeadData: [],
    };
  },

  computed: {
    ...mapState("project", ["projectID", "curVersion"]),
    ...mapState("user", ["user_id"]),
    ...mapGetters("permissions", ["enableWriteCreateProject"]),
    disabled_c() {
      return !!this.userOperateStatus;
    },
    percentSum() {
      let sum = 0;
      for (const item of this.tableHeadData) {
        if (item.hasOwnProperty("weight")) {
          sum = math.eval(item.weight + "+" + sum) - 0;
        }
      }
      return sum;
    },
  },
  watch: {},
  created() {
    // this.update_project_id("2");
    this.$on("REFRESH", this.fetchListData);
    this.$on("SORT-COMPUTE", this.onSortCompute);
    this.$on("DELETE", this.onDelete);

    this.$on("ADD", this.onAdd);
    this.$on("CONFIRM-ADD", this.onConfirmAdd);
    this.$on("CANCEL-ADD", this.onCancelAdd);

    this.$on("EDIT", this.onEdit);
    this.$on("CONFIRM-EDIT", this.onConfirmEdit);
    this.$on("CANCEL-EDIT", this.onCancelEdit);
    this.init();
    return;
  },
  mounted() {},
  methods: {
    ...mapActions("project", [
      "updata_preview_log_step_status",
      "update_project_id",
      // "fetch_preview_data",
      // "fetch_log_info"
    ]),
    init() {
      this.market = "";
      this.media = "";
      this.userOperateStatus = "";
      this.fetchSelectData();
      this.fetchListData();
    },
    loading(bool) {
      this.isLoading = !!bool;
    },
    checkUserOperate(msg = "") {
      if (this.userOperateStatus) {
        switch (this.userOperateStatus) {
          case Editing:
            msg = this.$t("lang.AS_detail_score_card_editing") + msg + this.$t("lang.AS_detail_score_card_finish_editing");
            break;
          case Newing:
            msg = this.$t("lang.AS_detail_score_card_adding") + msg + this.$t("lang.AS_detail_score_card_finish_adding");
            break;
          default:
          //n 与 case 1 和 case 2 不同时执行的代码
        }
        this.$message.error(msg);
        return false;
      } else {
        return true;
      }
    },
    handleBeforeUpload() {
      this.isLoading = true;
    },
    handleError() {
      this.isLoading = false;
      this.$message.error(this.$t("lang.public_upload_fail"));
    },
    handleSuccess(res, file) {
      if (res && res.ret == 0) {
        //不能有&res.ret& 否则进不去
        this.$message.success(this.$t("lang.public_upload_again_success"));
        this.init();
      } else {
        this.$message.error(res.msg || this.$t("lang.public_upload_fail"));
      }
      this.isLoading = false;
    },
    onClickSelect(column) {
      if (this.checkUserOperate(`${this.$t("lang.AS_detail_score_card_unable_to_filter")},`)) {
        this.refresh();
      }
    },
    /* ------------新建相关代码 start---------------*/
    addTableData() {
      for (let item of this.tableData) {
        item["new_d"] = "";
      }

      let lastData = _.cloneDeep(this.tableHeadData[this.tableHeadData.length - 1]);
      for (const key in lastData) {
        if (lastData.hasOwnProperty(key)) {
          lastData[key] = "";
        }
      }
      lastData["is_special"] = false;
      lastData[this.defaultProps.field] = "new_d";
      this.tableHeadData.push(lastData);
    },
    //主要是给新建 取消使用
    resetTableData() {
      for (let item of this.tableData) {
        delete item["new_d"];
      }
      this.tableHeadData.pop();
    },
    onAdd() {
      // if (this.checkUserOperate()) {
      this.userOperateStatus = Newing;
      this.addTableData();
      this.setForm("new_d");
      this.scrollRight();
      // }
    },
    scrollRight() {
      setTimeout(() => {
        const container = document.querySelectorAll(".score-card .el-table__body-wrapper")[0];
        // const content = document.querySelectorAll('.el-table__body')[0];
        container.scrollLeft = container.scrollLeft + 500;
      }, 500);
      setTimeout(() => {
        // const container = document.querySelectorAll(".score-card .el-table__fixed .el-table__fixed-body-wrapper")[0];
        // // const content = document.querySelectorAll('.el-table__body')[0];
        // console.log(container, 123123)
        // container.top = 67;
      }, 600);
      // el-table__fixed  el-table__fixed-body-wrapper
    },
    onCancelAdd({ field }) {
      this.userOperateStatus = "";
      this.resetTableData();
    },
    onConfirmAdd({ field, _resolve, _reject }) {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.fetchNew({ _resolve, _reject });
        } else {
          this.$message.error(this.$t("lang.reg_number_error"));
        }
      });
    },
    onDelete({ field }) {
      this.$confirm(this.$t("lang.AS_detail_score_card_delete_column"), this.$t("lang.public_dialog_point"), {
        confirmButtonText: this.$t("lang.public_button_confirm"),
        cancelButtonText: this.$t("lang.public_button_cancel"),
        type: "warning",
      }).then(() => {
        // console.log(field)
        this.fetchDelete(field);
      });
    },
    /* ------------新建相关代码 end---------------*/
    setForm(field) {
      this.form = {};
      this.setFormHead(field);
      this.setFormBody(field);
      this.setRules();
    },
    //设置form的Head值
    setFormHead(field) {
      let _field = this.defaultProps["field"];
      let _percent = this.defaultProps["percent"];
      let _name = this.defaultProps["name"];
      let obj = this.tableHeadData.find((i) => i[_field] == field);
      /* field name percent status */

      if (obj) {
        this.$set(this.form, "field", obj[_field]);
        this.$set(this.form, "name", obj[_name]);
        let percentVal = "";
        if (obj[_percent]) {
          percentVal = math.eval(obj[_percent] + "*100") - 0;
        }
        this.$set(this.form, "percent", percentVal);
      }
    },
    //设置form的body值
    setFormBody(field) {
      for (let i = 0; i < this.tableData.length; i++) {
        const item = this.tableData[i];
        this.$set(this.form, item["id"], item[field]);
      }
    },
    //设置form校验规则
    setRules() {
      for (const i of this.tableData) {
        let [required, message, trigger] = [true, this.$t("lang.reg_required"), "blur"];
        this.$set(this.rules, i["id"], [{ required, message, trigger }]);
      }
    },
    /* ------------编辑相关代码 start---------------*/
    //field是这一列对于的字段名称
    onEdit({ field }) {
      // if (this.checkUserOperate()) {
      this.userOperateStatus = Editing;
      this.setForm(field);
      // }
    },
    onConfirmEdit({ field, _resolve, _reject }) {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.fetchEdit({ _resolve, _reject });
        } else {
          this.$message.error(this.$t("lang.reg_number_error"));
        }
      });
    },
    onCancelEdit({ field }) {
      this.userOperateStatus = "";
    },
    /* ------------编辑相关代码 end---------------*/
    onSortCompute({ id, type }) {
      this.fetchSortCompute({ id, type });
    },
    async fetchSortCompute({ id, type }) {
      let project_id = this.projectID;
      let url = "/scorecard/updatetitletype";
      await this.fetchCore(url, { id, type, project_id });
      this.fetchListData();
    },
    //保底基数的编辑按钮
    clickEditBaseNum() {
      this.isEditBaseNum = true;
      this.baseNumform.num = this.baseNumber;
    },
    //保底基数的确认按钮
    confirmBaseNum() {
      this.$refs["baseNumform"].validate((valid) => {
        if (valid) {
          this.fetchUpdateBaseNum();
        } else {
          this.$message.error(this.$t("lang.reg_number_error"));
        }
      });
    },
    //保底基数的取消按钮
    cancelBaseNum() {
      this.isEditBaseNum = false;
    },
    //保底基数的输入事件
    /* onInputBaseNum(val) {
      // let _val = _.trim(val);
      let _val = val.replace(/[^\d]/g, "");
      if (_val.indexOf("0") == 0) {
        _val = _val.slice(1);
      }
      this.$refs.baseNum.currentValue = _val;
      this.baseNumber_tem = _val;
    }, */
    isSpecial(obj) {
      for (let item of obj.title) {
        item.is_special = false;
        if (item.id == obj.special_id) {
          item.is_special = true;
        }
      }
    },
    async fetchListData() {
      let url = "/scorecard/sclist";
      let version = this.curVersion;
      let project_id = this.projectID;
      let data = await this.fetchCore(url, {
        project_id,
        version,
        market: this.market,
        media: this.media,
      });
      this.isSpecial(data);
      this.tableHeadData = data.title;
      this.$nextTick(() => {
        this.tableData = data.data;
        this.baseNumber = data.base_number;
      });
    },

    /**
     * row:这一行的数据 Object
     * column：这一列的数据 Object
     * rowIndex:行号 从0开始
     * columnIndex：列号 从0开始
     */
    async onSubmit() {
      if (this.checkUserOperate(this.$t("lang.reg_cannot_submit"))) {
        this.fetchCore("/scorecard/compute", {
          project_id: this.projectID,
        }).then(() => {
          this.onClose();
        });
      }
    },
    refresh() {
      this.fetchListData();
    },
    async fetchUpdateBaseNum() {
      let project_id = this.projectID;
      let url = "/scorecard/updatebasenumber";
      let base_number = this.baseNumform.num;
      // try {
      await this.fetchCore(url, { project_id, base_number });
      this.baseNumber = base_number;
      this.isEditBaseNum = false;
      this.fetchListData();
      // } catch (err) {
      // }
    },
    async fetchDelete(id) {
      let project_id = this.projectID;
      let url = "/scorecard/deletecolumn";
      await this.fetchCore(url, { project_id, id });
      this.fetchListData();
    },
    getMarketMediaById(id) {
      let obj = this.tableData.find((i) => i.id == id);
      if (obj) {
        let market = obj.market;
        let media = obj.media;
        return { market, media };
      }
      return { market: "", media: "" };
    },
    getNewParam() {
      let result = {
        project_id: this.projectID,
        title: {},
        data: [],
      };
      let { title, data } = result;
      title.type = "1";
      title.title = this.form.name;
      // title.weight = this.form.percent / 100;
      title.weight = math.eval(this.form.percent + "/100") - 0;
      // math.eval(this.form.percent + "/100") - 0 ,

      let arr = ["name", "percent", "field"];
      let keys = Object.keys(this.form).filter((i) => arr.indexOf(i) == -1);
      for (const key of keys) {
        let { market, media } = this.getMarketMediaById(key);
        let _obj = {
          id: key,
          market,
          media,
        };
        _obj["value"] = this.form[key];
        data.push(_obj);
      }
      return result;
    },
    async fetchNew({ _resolve, _reject }) {
      let project_id = this.projectID;
      let param = this.getNewParam();
      let url = "/scorecard/addcolumn";
      try {
        await this.fetchCore(url, param);
        _resolve();
        this.userOperateStatus = "";
        this.fetchListData();
      } catch (err) {
        _reject();
      }
    },
    getEditParam() {
      let result = {
        project_id: this.projectID,
        title: {},
        data: [],
      };
      let { title, data } = result;
      title.title = this.form.name;
      // title.weight = this.form.percent / 100;
      title.weight = math.eval(this.form.percent + "/100") - 0;
      title.id = this.form.field;

      let arr = ["name", "percent", "field"];
      let keys = Object.keys(this.form).filter((i) => arr.indexOf(i) == -1);
      for (const key of keys) {
        let { market, media } = this.getMarketMediaById(key);
        let _obj = {
          id: key,
          market,
          media,
        };
        _obj[this.form.field] = this.form[key];
        data.push(_obj);
      }
      return result;
    },
    async fetchEdit({ _resolve, _reject }) {
      let project_id = this.projectID;
      let param = this.getEditParam();
      let url = "/scorecard/updatecolumn";
      try {
        await this.fetchCore(url, param);
        _resolve();
        this.userOperateStatus = "";
        this.fetchListData();
      } catch (err) {
        _reject();
      }
    },
    async fetchSelectData() {
      let url = "/scorecard/selectlist";
      let data = await this.fetchCore(url, { project_id: this.projectID });
      this.marketList = data.market;
      this.mediaList = data.media;
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
    onClose() {
      this.updata_preview_log_step_status();
      // this.fetch_preview_data();
      // this.fetch_log_info();
      this.$emit("update:isShow", false);
    },
  },
};
</script>
<style scoped>
/*本地部分*/
.box {
  font-size: 12px;
  background-color: #141c29; /*(背景调换)score card编辑中搜索框背景*/
  overflow: hidden;
  /* padding-left: 28px; */
  /* padding-top: 24px; */
  box-sizing: border-box;
}
.head {
  padding: 10px 16px;
}
.head .ico {
  color: #a1a4a9;
  cursor: pointer;
  font-size: 16px;
}
.yellow {
  color: #ffcc00;
}
.green {
  color: #0aecbf;
}
</style>
<style>
.score-card .mis-dialog-body {
  /* overflow:auto; */
  margin-top: 5px;
}
.score-card .el-table {
  display: inline-block;
  background: #141c29; 
}
.score-card .hy-tabel-head > * {
  margin-right: 2px;
}
.score-card .has-gutter .cell {
  display: table-cell;
}
.score-card .el-table th div {
  line-height: initial;
}
.score-card .has-gutter .cell .hy-tabel-head {
  vertical-align: middle;
  line-height: 20px;
}

/* .score-card .hy-small-input{
  width:46px;
}
.score-card .head .el-input__inner{
  text-align: center;
  width:46px;
} */
.score-card .el-form-item--mini.el-form-item {
  margin-bottom: 0px;
}
/* 上传组件 */
.score-card .el-table th div.el-upload.el-upload--text,
.score-card .el-table th div.el-form-item.el-form-item--mini,
.score-card .el-table th div.el-form-item.el-form-item--mini div {
  padding: 0px;
}
</style>
<style lang="scss">

</style>
