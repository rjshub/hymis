<template>
  <div style="height:100%;" class="costing-allocation">
    <div class="head">
      <el-select v-model="market"
        @click.native="onClickSelect"
        class="select"
        :disabled='disabledFilter_c'
        style=" margin-right: 6px;"
        size="mini"
        filterable
        @change="refresh"
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
        @click.native="onClickSelect"
        :disabled='disabledFilter_c'
        size="mini"
        style=" margin-right: 12px;"
        filterable
        @change="refresh"
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
    </div>
    <el-form size="mini"
      ref="form"
      :model="form"
      style=""
      :show-message='false'
      :rules="rules">
      <el-table :data="tableData_c"
        cell-class-name='component-compute-cell'
        style="">
        <el-table-column prop="market"
          width="80px"
          label="Market">
        </el-table-column>
        <el-table-column prop="media"
          min-width="80px"
          label="Media">
        </el-table-column>
        <el-table-column prop="ranking"
          min-width="60px"
          label="Ranking">
        </el-table-column>
        <el-table-column prop="goal_cpm"
          width="85px"
          :label="$t('lang.AS_detail_component_compute_table.target_CPM')">
          <template slot-scope="scope">
            {{goalCpmVal(scope)}}
          </template>
        </el-table-column>
        <el-table-column prop="media_supply"
          :label="$t('lang.AS_detail_component_compute_table.media_inventory')">
          <template slot-scope="scope">
            {{$formatNumber(scope.row.media_supply,0,'')}}
          </template>
        </el-table-column>
        <el-table-column prop="supply_discount"
          :render-header='renderHeader'
          label-class-name='hy-cell'
          :label="$t('lang.AS_detail_component_compute_table.inventory_discount')">
          <template slot-scope="scope">
            <el-form-item :prop="scope.row.id"
              v-if="writable">
              <el-input class="hy-small-padding-input"
                style="width:50px;"
                size="mini"
                v-model="form[scope.row.id]">
                <!-- placeholder="基数" -->
              </el-input>
            </el-form-item>
            <span v-else>{{$formatNumber(scope.row.supply_discount,4,'')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="compute_supply"
          width="90px"
          :label="$t('lang.AS_detail_component_compute_table.calculated_inventory')">
          <template slot-scope="scope">
            {{$formatNumber(scope.row.compute_supply,4,'')}}
          </template>
        </el-table-column>
        <el-table-column prop="component_int"
          :label="$t('lang.AS_detail_component_compute_table.Round_off_number')">
          <template slot-scope="scope">
            {{$formatNumber(scope.row.component_int,0,'')}}
          </template>
        </el-table-column>
        <el-table-column prop="cpm_differ"
          label-class-name='yellow'
          width="70px"
          :render-header='renderGAPHeader'
          :label="$t('lang.AS_detail_component_compute_table.GAP')">
          <template slot-scope="scope">
            {{GAPVal(scope)}}
          </template>
        </el-table-column>
        <el-table-column prop="media_cpm"
          v-if="enableMediaCpm"
          :label="$t('lang.AS_detail_component_compute_table.CPM_nit_cost_for_media')">
          <template slot-scope="scope">
            {{$formatNumber(scope.row.media_cpm,0,'')}}
          </template>
        </el-table-column>
        <el-table-column prop="media_total_price"
          v-if="enableMediaCpm"
          min-width="100px"
          :label="$t('lang.AS_detail_component_compute_table.total_cost_for_media')">
          <template slot-scope="scope">
            {{$formatNumber(scope.row.media_total_price,4,'')}}
          </template>
        </el-table-column>
        <el-table-column prop="customer_cpm"
          :label="$t('lang.AS_detail_component_compute_table.CPM_unit_cost_for_client')">
          <template slot-scope="scope">
            {{$formatNumber(scope.row.customer_cpm,0,'')}}
          </template>
        </el-table-column>
        <el-table-column prop="customer_total_price"
          min-width="100px"
          :label="$t('lang.AS_detail_component_compute_table.total_cost_for_client')">
          <template slot-scope="scope">
            {{$formatNumber(scope.row.customer_total_price,4,'')}}
          </template>
        </el-table-column>

      </el-table>
    </el-form>

    <el-button plain
      v-if="type == 'initial'"
      :disabled="!enableWriteCreateProject?true:disabledIntoCostSetBtn"
      style="font-size:12px;margin:10px;"
      class="now"
      @click="intoCostSet">
      <i class="iconfont icon-backward-sorting"></i>{{$t('lang.AS_detail_component_compute_Target_cost_setting')}}</el-button>

    <div style="margin-top:14px;font-size:12px;color:#fff">
      <div class="cost-title">{{$t('lang.AS_detail_component_compute_COST_Goal_Settings')}}</div>
      <template v-if="type == 'initial'">
        <span class="min-inventory-discount">{{$t('lang.AS_detail_component_compute_Minimum_inventory_discount')}}</span>
        <el-input-number size="mini"
          @blur='onInputNumberBlur'
          :disabled='!editCost'
          style="margin:0 10px"
          :precision="2"
          :step="0.01"
          :max="1"
          :min='0'
          v-model="minDiscount"></el-input-number>
        <span>(0~1)</span>
        <el-upload style="float: right;"
          :disabled="!editCost"
          :data='{project_id:projectID}'
          action="/api/projects/importgoalcost"
          :show-file-list="false"
          accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'
          :on-error='handleError'
          :before-upload='handleBeforeUpload'
          :on-success="handleSuccess">
          <el-button plain
            class="now"
            :disabled="!editCost">{{$t('lang.AS_detail_component_compute_upload_target_cost')}}</el-button>
        </el-upload>
        <u class="down-tpl"
          @click="downTpl">{{$t('lang.AS_detail_download_form_template')}}</u>
      </template>

      <!-- <span style="color:#ffcc00;padding-left:10px">库存折扣最小值设置过高，系统分量无解</span> -->
    </div>
    <el-form size="mini"
      ref="costForm"
      :model="costForm"
      style=""
      :inline-message='true'
      :show-message='false'
      :rules="costRules">
      <el-table :data="costTableData"
        :show-summary='false'
        :summary-method="getSummaries"
        style="width: 100%">
        <el-table-column prop="media"
          label="Media">
        </el-table-column>

        <el-table-column prop="customer_total_price"
          :label="$t('lang.AS_detail_component_compute_table.total_cost_for_client')">
          <template slot-scope="scope">
            {{$formatNumber(scope.row.customer_total_price,4,'')}}
          </template>
        </el-table-column>

        <el-table-column prop="cost_percent"
          label="cost%">
          <template slot-scope="scope">
            {{formatNum(scope.row.cost_percent)}}
          </template>
        </el-table-column>

        <el-table-column prop="goal_cost_percent"
          :label="$t('lang.AS_detail_component_compute_table.target_cost')">
          <template slot-scope="scope">
            <template v-if="scope.$index!=costTableData.length-1">
              <el-form-item :prop="scope.row.media"
                v-if="editCost">
                <el-input class="hy-small-padding-input"
                  style="width:50px;"
                  size="mini"
                  @blur='onBlur'
                  v-model="costForm[scope.row.media]">
                  <!-- placeholder="基数" -->
                </el-input>
              </el-form-item>
              <span v-else>
                {{formatNum(scope.row.goal_cost_percent)}}
              </span>
            </template>
            <template v-else>
              <template v-if="editCost">
                <span v-if="goalCostTotal==100">
                  {{$formatNumber(goalCostTotal,2,'')}}
                </span>
                <!-- <span style="color:#fee01a" -->
                <span :style="remind_text"
                  v-else>
                  {{$formatNumber(goalCostTotal,2,'')}}
                  <span style="padding-left: 20px;">
                    {{validateError?validateError: $t('lang.reg_cost_sum_not_100')}}
                  </span>
                </span>
              </template>
              <template v-else>
                {{$formatNumber(goalCostTotal,2,'')}}
              </template>

            </template>
          </template>
        </el-table-column>

      </el-table>
    </el-form>
    <el-button style="margin:10px 0 0 10px;"
      v-if="type == 'initial'"
      class="next"
      :disabled='!editCost'
      @click="onCalculate">{{$t('lang.AS_detail_component_compute_Calculation')}}</el-button>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import _ from "lodash";
import moment from "moment";
import math from "mathjs";
import fetch from "@/services/fetch";
import theme from '@/views/mixin/theme/remind-text.vue'

export default {
  // 不能使用这个name属性,不然局部的名字就无效了，因为使用了keep-alive
  // name: "component-compute-page",
  components: {},
  props: {
    type: {
      type: [String],
      required: true
    }
  },
  mixins: [theme],
  data() {
    return {
      disabledAll: false,
      // disabled: true,
      minDiscount: 0,
      market: "",
      marketList: [],
      media: "",
      mediaList: [],
      tableData: [],
      costTableData: [],
      isLoading: false,
      form: {},
      rules: {},
      costForm: {},
      costRules: {},
      writable: false, //库存折扣的编辑状态 或者开关
      editCost: false //目标cost的编辑状态 或者开关
    };
  },
  computed: {
    ...mapState("project", ["projectID","curVersion"]),
    ...mapState("project/componentCompute", ["tabList"]),
    ...mapGetters("permissions", [
      "enableMediaCpm",
      "enableWriteCreateProject"
    ]),
    validateError() {
      let vals = Object.values(this.costForm);
      return this.validateCostForm(vals);
    },
    goalCostTotal() {
      let vals = Object.values(this.costForm);
      let total = 0;
      for (const val of vals) {
        if (this.$constReg.num.test(val)) {
          total = math.eval(total + "+" + (val - 0)) - 0;
        }
      }
      return total;
    },
    listUrl() {
      let url = "/projects/cpmorig";
      if (this.type == "adjust") {
        url = "/projects/cpmadj";
      }
      return url;
    },
    //是否显示库存折扣编辑按钮
    isShowDiscountEditBtn() {
      if (this.type == "initial") {
        return this.tabList.length == 1;
      } else {
        return true;
      }
    },
    //是否禁用 进入目标cost设置按钮
    disabledIntoCostSetBtn() {
      // console.log('this.type',this.type)
      if (this.type == "initial") {
        // console.log('this.tabList.length',this.tabList.length)
        return this.tabList.length == 2;
      }
    },
    //库存折扣的url
    discountUrl() {
      // let url = "/projects/saveorig";
      let url = "/projects/updatesupplydiscount";
      if (this.type == "adjust") {
        url = "/projects/savediscountadj";
      }
      return url;
    },
    double_disabled() {
      // return this.disabledAll || this.disabled;
    },
    //是否禁用2个过滤下拉
    disabledFilter_c() {
      return this.writable;
    },
    tableData_c() {
      let rs = [];
      rs = this.tableData.filter(i => {
        return this.market ? i.market == this.market : true;
      });
      rs = rs.filter(i => {
        return this.media ? i.media == this.media : true;
      });
      return rs;
    },
    spanRows() {
      let tem = {};
      let rs = [];
      let arr = this.tableData_c;
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if (!tem[item.market]) {
          tem[item.market] = true;
          rs.push(i);
        }
      }
      rs.push(arr.length);
      return rs;
    }
  },
  watch: {
    tabList: {
      handler: function(val, oldVal) {
        // console.log(val, oldVal)
        if (this.type == "initial") {
          if (val.length == 2) {
            // this.disabledAll = true;
            this.writable = false;
            this.editCost = false;
          } else {
            // this.disabledAll = false;
          }
        }
      },
      deep: true,
      immediate: true
    },
    isLoading(n, o) {
      this.$dispatch("ComponentCompute", "LOADING", n);
    }
  },
  activated() {
    /* if (this.type == "initial") {
      if (this.tabList.length == 2) {
        this.disabledAll = true;
      } else {
        this.disabledAll = false;
      }
    } */
  },
  async created() {
    // this.update_project_id("2");
    await this.fetchList();
    this.setCostData();
  },
  mounted() {},
  methods: {
    ...mapActions("project", ["update_project_id"]),
    ...mapActions("project/componentCompute", ["update_target_cost"]),
    validateCostForm(vals){
      let msg = "";
      for (const val of vals) {
        if (this.$constReg.num.test(val)) {
          if (val - 0 > 100) {
            msg = this.$t('lang.reg_cost_sum_not_100');
            break;
          }
        } else {
          msg = this.$t('lang.reg_target_cost_positive_number_error_msg');
          break;
        }
      }
      return msg;
    },
    checkGoalCostVal(str){
      if (this.$constReg.num.test(str)&&(str - 0) < 100) {
        return true;
      }else{
        return false;
      }
    },
    checkValidateCostForm(diff){
      let arr = Object.values(this.costForm);
      arr = arr.filter(i=>{
        return i!=diff;
      })
      return this.validateCostForm(arr)=='';
    },
    getEmptyDataFromCostForm(){
      let arr = Object.values(this.costForm);
      let rs = arr.filter(i=>{
        return (i==0||_.trim(i)=='')
      })
      return rs;
    },
    hasOnlyOneEmpty(){
      let arr = this.getEmptyDataFromCostForm();
      return arr.length==1;
    },
    onBlur(){
      let valArr = Object.values(this.costForm);
      if (this.hasOnlyOneEmpty(valArr)) {
        let target = this.getEmptyDataFromCostForm()[0];
        if (this.checkValidateCostForm(target)&&this.goalCostTotal<100) {
          this.autoFillLastInput();
        }
      }
    },
    //自动填充最后一个input  但是这个有前置条件，请看调用的地方
    autoFillLastInput(){
      let keysArr = Object.keys(this.costForm);
      let total = 0;
      let emptyKey = '';
      for (let key of keysArr) {
        let val = this.costForm[key];
        if (this.checkGoalCostVal(val)) {
          // console.log('val=',val)
          total = math.eval(total+"+"+this.costForm[key])-0;
        }else{
          emptyKey = key;
        }
      }
      // console.log('total',total)
      
      this.$set(this.costForm, emptyKey, math.eval("100-"+total)-0);
    },
    //因为需求改变  该方法废弃
    getSummaries(param) {
      // console.log('param',param)
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "Total";
          return;
        }
        if (index === 2) {
          sums[index] = "100.00";
          return;
        }
        if (index === 1) {
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return math.eval(prev + "+" + curr) - 0;
              } else {
                return prev;
              }
            }, 0);
            sums[index] = this.$formatNumber(sums[index], 4, "");
          } else {
            sums[index] = "N/A";
          }
          return;
        }
        if (index === 3) {
          if (this.editCost) {
            let values = Object.values(this.costForm);
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return math.eval(prev + "+" + curr) - 0;
                } else {
                  return prev;
                }
              }, 0);
              sums[index] = this.$formatNumber(sums[index], 2, "");
            } else {
              sums[index] = "N/A";
            }
          } else {
            //chart.vue
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return math.eval(prev + "+" + curr) - 0;
                } else {
                  return prev;
                }
              }, 0);
              sums[index] = this.$formatNumber(sums[index] * 100, 2, "");
            } else {
              sums[index] = "N/A";
            }
            // sums[index] = "100.00";
          }
          return;
        }
      });

      return sums;
    },
    downTpl() {
      let lang = ''
      if (this.$t('lang.overall_language') === 'chinese') {
        lang = ''
      } else {
        lang = 'en/'
      }
      // this.$downloadFile("/static/目标cost%导入-format.xlsx");
      this.$downloadFile(`/static/${lang}target cost format.xlsx`);
    },
    handleBeforeUpload() {
      this.isLoading = true;
    },
    handleError(err, file, fileList) {
      this.isLoading = false;
      this.$message.error(err.msg || this.$t('lang.public_upload_fail'));
    },
    handleSuccess(res, file) {
      if (res && res.ret == 0) {
        let obj = res.data;
        let keys = Object.keys(obj);
        for (const key of keys) {
          this.costForm[key] = this.multiplied100(obj[key]);
        }
        this.$message.success(this.$t('lang.public_upload_success'));
      } else {
        this.$message.error(res.msg || this.$t('lang.public_upload_fail'));
      }
      this.isLoading = false;
    },
    formatNum(val) {
      let v = this.multiplied100(val);
      return this.$formatNumber(v, 2, "");
    },
    setCostData() {
      this.setCostForm();
      this.setCostRules();
    },
    goalCpmVal({ $index, row }) {
      if (this.spanRows.indexOf($index) !== -1) {
        return this.$formatNumber(row.goal_cpm, 0, "");
      }
    },
    GAPVal({ $index, row }) {
      if (this.spanRows.indexOf($index) !== -1) {
        return this.$formatNumber(row.cpm_differ, 0, "");
      }
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 3 || columnIndex == 8) {
        let arr = this.spanRows;
        // console.log(arr)
        for (let i = 0; i < arr.length; i++) {
          if (i !== arr.length - 1) {
            const item = arr[i];
            const nextItem = arr[i + 1];
            if (rowIndex == item) {
              return [nextItem - item, 1];
            } else if (rowIndex < nextItem && rowIndex > item) {
              return [0, 0];
            }
          }
        }
      }
    },

    multiplied100(num) {
      return math.eval(num + "*100") - 0 + "";
    },
    onInputNumberBlur() {
      // console.log("onInputNumberBlur");
    },
    //进入目标COST设置 按钮
    intoCostSet() {
      this.$dispatch("ComponentCompute", "IS_SHOW_SUBMIT", false);
      if (this.type == "initial") {
        if (this.tabList.length == 1) {
          if (!this.editCost) {
            this.setCostForm();
            this.editCost = true;
            this.$nextTick(() => {
              this.$refs["costForm"].validate();
            });
          }
        } else {
          this.$message.error(
            this.$t('lang.AS_detail_component_compute_cannot_cost_setting')
          );
        }
      } else {
        this.$message.error(
          this.$t('lang.AS_detail_component_compute_cannot_cost_setting')
        );
      }
    },
    costEqual100() {
      let arr = Object.values(this.costForm);
      let mathStr = "0";
      for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        mathStr = mathStr + "+" + item;
      }
      let rs = math.eval(mathStr) - 0;
      // console.log(rs);
      return rs == 100;
    },
    setCostByForm() {
      let tem = _.cloneDeep(this.costTableData);
      for (let item of tem) {
        if (this.costForm.hasOwnProperty(item.media)) {
          item.goal_cost_percent =
            math.eval(this.costForm[item.media] + "/100") - 0;
        }
      }
      this.costTableData = tem;
    },
    onCalculate() {
      if (this.minDiscount == undefined) {
        this.$message.error(this.$t('lang.reg_Minimum_inventory_discount_required'));
        return;
      }
      if (this.writable) {
        this.$message.error(this.$t('lang.AS_detail_component_compute_finish_ID_modification_first'));
      } else {
        this.$refs["costForm"].validate(async valid => {
          if (valid) {
            if (this.costEqual100()) {
              let res = await this.fetchSaveGoalCost();
              //字符串 代表无解
              if (_.isString(res)) {
                let msg = this.$t('lang.AS_detail_component_compute_inventory_discount_tooHigh');
                if (this.minDiscount == 0) {
                  msg = this.$t('lang.AS_detail_component_compute_fine_tune_cost');
                }
                this.$message.error(msg);
              } else if (_.isPlainObject(res)) {
                //其实这个判断也没有必要  因为现在只有初始页才有分量计算的按钮
                if (this.type == "initial") {
                  this.editCost = false;
                  this.setCostByForm();
                  this.$dispatch("ComponentCompute", "IS_SHOW_SUBMIT", true);
                  this.$dispatch("ComponentCompute", "ADDTAB");
                  /* if (this.tabList.length == 2) {
                    this.$dispatch("ComponentCompute", "CHANGETAB");
                  } else {
                    this.$dispatch("ComponentCompute", "ADDTAB");
                  } */
                }
              }
            } else {
              this.$message.error(this.$t('lang.reg_cost_sum_not_100'));
            }
          } else {
            // this.$message.error("请正确填写页面中的数据");
            this.$message.error(this.$t('lang.reg_number_error'));
          }
        });
      }
    },

    formatCostPercent(value) {
      return math.eval(value + "*100") - 0;
    },
    setForm() {
      for (const item of this.tableData) {
        this.$set(this.form, item.id, item.supply_discount);
      }
    },
    setCostForm() {
      for (const item of this.costTableData) {
        let percent = "0";
        if (item.goal_cost_percent) {
          percent = math.eval(item.goal_cost_percent + "*100") - 0 + "";
        }
        if (item.id) {
          this.$set(this.costForm, item.media, percent);
        }
      }
    },
    costValidator() {
      // console.log('costValidator--')
      return (rule, val, callback) => {
        // console.log('val==',val)
        if (this.$constReg.num.test(val)) {
          if (val - 0 > 100) {
            callback(new Error(this.$t('lang.reg_cost_sum_not_100')));
          } else {
            callback();
          }
        } else {
          callback(new Error(this.$t('lang.reg_positive_number_two_decimal')));
        }
      };
    },
    validator() {
      return (rule, val, callback) => {
        // console.log('val==',val)
        if (this.$constReg.num3.test(val)) {
          callback();
        } else {
          callback(new Error(this.$t('lang.reg_between_0_1_two_decimal')));
        }
      };
    },
    setCostRules() {
      let obj = this.costRules;
      //要除去最后一行  总计行
      let arr = this.costTableData.slice(0, this.costTableData.length - 1);
      for (const i of arr) {
        let [required, trigger] = [true, "blur"];
        let validator = this.costValidator();
        this.$set(obj, i.media, [{ required, validator, trigger }]);
      }
    },
    setRules() {
      let obj = this.rules;
      let arr = this.tableData;
      for (const i of arr) {
        let [required, trigger] = [true, "blur"];
        let validator = this.validator();
        this.$set(obj, i.id, [{ required, validator, trigger }]);
      }
    },
    clickEditBtn() {
      this.writable = true;
      this.setForm();
    },
    clickConfirmBtn() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.writable = false;
          this.fetchSaveOrig();
        } else {
          this.$message.error(
            this.$t('lang.reg_decimal_0_four_decimal')
          );
        }
      });
    },
    clickCancelBtn() {
      this.writable = false;
    },
    refresh() {},
    onClickSelect() {
      if (this.writable) {
        this.$message.error(this.$t('lang.AS_detail_component_compute_cannot_to_filter'));
      }
    },
    getOrigParam() {
      let keys = Object.keys(this.form);
      let rs = [];
      for (const key of keys) {
        let tem = {};
        tem.id = key;
        tem.supply_discount = this.form[key];
        rs.push(tem);
      }
      return { project_id: this.projectID, data: rs };
    },
    setTableData({ cost_percent, data }) {
      this.tableData = data;
      this.costTableData = cost_percent;
      this.costTableAddTitleRow();
    },
    costTableAddTitleRow() {
      let arr = _.cloneDeep(this.costTableData);
      let customer_p = 0;
      let cost_percent = 0;
      let goal_cost = 0;
      for (let item of arr) {
        customer_p =
          math.eval(customer_p + "+" + item.customer_total_price) - 0;
        cost_percent = math.eval(cost_percent + "+" + item.cost_percent) - 0;
        goal_cost = math.eval(goal_cost + "+" + item.goal_cost_percent) - 0;
      }

      let obj = {
        media: "Total",
        cost_percent,
        goal_cost_percent: goal_cost,
        customer_total_price: customer_p
      };
      this.costTableData.push(obj);
    },
    getGoalCostParam() {
      let param = {
        project_id: this.projectID,
        min_discount: this.minDiscount
      };

      let keys = Object.keys(this.costForm);
      let rs = [];
      for (const key of keys) {
        let tem = {};

        tem.id = this.costTableData.find(i => {
          return i.media == key;
        }).id;
        tem.media = key;
        // tem.goal_cost_percent = math.eval(this.costForm[key] + "/100") - 0 ;
        tem.goal_cost_percent = this.costForm[key];
        rs.push(tem);
      }
      param.data = rs;
      return param;
    },
    //保存目标cost
    async fetchSaveGoalCost() {
      let param = this.getGoalCostParam();
      let res = await this.fetchCore("/projects/savegoalcost", param);
      // console.log(res);
      return res;
      // this.setTableData(res.data);
    },
    //保存库存折扣
    async fetchSaveOrig() {
      let param = this.getOrigParam();
      await this.fetchCore(this.discountUrl, param);
      await this.fetchList();
    },
    setSelectList(arr) {
      for (const item of arr) {
        this.marketList.push(item.market);
        this.mediaList.push(item.media);
      }
      this.marketList = _.uniq(this.marketList);
      this.mediaList = _.uniq(this.mediaList);
    },
    async fetchList() {
      let version = this.curVersion;
      let res = await this.fetchCore(this.listUrl, {
        project_id: this.projectID,version
      });
      let data = res.data.data;
      let cost_percent = res.data.cost_percent;
      this.minDiscount = res.data.min_discount;
      this.setSelectList(data);
      this.setTableData({ cost_percent, data });
      this.setRules();
      // this.setCostForm();
      // this.setCostRules();
      return res.data;
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
    renderGAPHeader(h, { column, $index }) {
      // 目标与实际分量CPM差异(GAP)
      return h(
        "span",
        {
          class: "yellow",

          attrs: {
            title: this.$t('lang.AS_detail_component_compute_table.GAP_title')
          }
        },

        ["GAP"]
      );
    },
    renderHeader(h, { column, $index }) {
      let child = [];
      if (this.writable) {
        child = [
          h("el-button", {
            style: "margin-left:2px",
            on: {
              click: this.clickConfirmBtn
            },
            props: {
              icon: "el-icon-check",
              size: "mini"
            }
          }),
          h("el-button", {
            style: "margin-left:2px",
            on: {
              click: this.clickCancelBtn
            },
            props: {
              icon: "el-icon-close",
              size: "mini",
              plain: true
            }
          })
        ];
      } else {
        if (this.enableWriteCreateProject && this.isShowDiscountEditBtn) {
          child = [
            h("i", {
              class: "iconfont icon-list-edit",
              style: "vertical-align: middle;cursor: pointer;margin-left:8px",
              domProps: {
                title: this.$t('lang.public_tooltip_edit')
              },
              on: {
                click: this.clickEditBtn
              }
            })
          ];
        }
      }
      return h(
        "div",
        {
          class: "hy-table-header"
        },
        [this.$t('lang.AS_detail_component_compute_table.inventory_discount'), ...child]
      );
    }
  }
};
</script>
<style scoped>
.head {
  padding: 10px;
}
.cost-title {
  height: 26px;
  line-height: 26px;
  font-size: 12px;
  background-color: #585e67;  
  color: #b2b3b7;
  padding: 0 10px;
  display: inline-block;
  margin-right: 25px;
}
.down-tpl {
  margin-right: 10px;
  line-height: 27px;
  cursor: pointer;
  float: right;
  color: #44ab97;
}
</style>
<style>
.component-compute .yellow {
  color: #ffcc00;
}

.component-compute .el-table th div.hy-table-header {
  line-height: initial;
  white-space: initial;
  padding: 0px;
  /* height: 26px; */
  line-height: 26px;
  vertical-align: inherit;
}
.component-compute .el-table th > .cell.hy-cell {
  padding-right: 0px;
}
.component-compute .el-form-item--mini.el-form-item {
  margin-bottom: 0px;
}
.component-compute .component-compute-cell {
  padding: 10px 0;
  height: 24px;
  line-height: 24px;
  overflow: hidden;
}
</style>