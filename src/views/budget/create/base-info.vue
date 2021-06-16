<template>
    <head-fold :title="`STEP1:${$t('lang.budget_step1_title')}`">
        <div class="clearfix base-info"
            v-loading="isLoading">
            <el-form size='mini'
                ref="form"
                style="height: 100%;margin-bottom: 10px"
                :inline="true"
                :model="form"
                :rules="rules"
                class="form"
                label-width="105px">

                <el-form-item :label="`${$t('lang.public_project_name')}：`"
                    prop="projectName">
                    <el-input v-model.trim="form.projectName"
                        style="width:400px;"
                        :placeholder="$t('lang.public_project_name_placeholder')"></el-input>
                </el-form-item>

                <el-form-item :label="`${$t('lang.public_client_label')}：`"
                    prop="customer">
                    <el-select v-model="form.customer"
                        style="width:400px;"
                        size="mini"
                        filterable
                        clearable
                        @change='onChangeCustomer'
                        :placeholder="$t('lang.public_client_placeholder')">
                        <el-option v-for="item in customer_list"
                            :key="item.id"
                            :label="item.customer_name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item :label="`${$t('lang.public_period_label')}：`"
                    prop="cycle">
                    <el-date-picker size="mini"
                        style="width: 400px;"
                        v-model="form.cycle"
                        prefix-icon="el-icon-time"
                        type="daterange"
                        align="right"
                        :clearable="true"
                        unlink-panels
                        :range-separator="$t('lang.public_DatePicker_between')"
                        :start-placeholder="$t('lang.public_DatePicker_start')"
                        :end-placeholder="$t('lang.public_DatePicker_end')"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>

                <el-form-item :label="`${$t('lang.public_brand_label')}：`"
                    prop="brand">
                    <el-select v-model="form.brand"
                        style="width:400px;"
                        size="mini"
                        filterable
                        clearable
                        @change='onChangeBrand'
                        :placeholder="$t('lang.public_brand_placeholder')">
                        <el-option v-for="item in brand_list"
                            :key="item.id"
                            :label="item.brand_name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item :label="`${$t('lang.public_budget_label')}：`"
                    prop="budget">
                    <el-input style="width:400px"
                        :placeholder="$t('lang.public_budget_placeholder')"
                        v-model="form.budget">
                        <template slot="append">{{$t('lang.AS_detail_basic_info_money_unit')}}</template>
                    </el-input>
                </el-form-item>

                <el-form-item :label="`${$t('lang.public_product_label')}：`"
                    class="form-item-even"
                    prop="product">
                    <el-select v-model="form.product"
                        style="width:400px;"
                        size="mini"
                        filterable
                        clearable
                        @change='onChangeProduct'
                        :placeholder="$t('lang.public_product_placeholder')">
                        <el-option v-for="item in product_list"
                            :key="item.id"
                            :label="item.product_name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="`${$t('lang.public_port_label')}：`"
                    prop="port"
                    style="position:relative">
                    <el-select v-model="form.port"
                        style="width:400px;"
                        size="mini"
                        multiple
                        clearable
                        @change='onChangePort'
                        :placeholder="$t('lang.public_port_placeholder')">
                        <el-option v-for="(item,index) in port_list"
                            :key="index"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                    <div v-if="isShowTip"
                        class="port-target-tip">{{$t('lang.budget_port_change_fail')}}</div>
                </el-form-item>

                <el-form-item :label="`${$t('lang.public_target_label')}：`"
                    prop="target">
                    <el-select v-if="!isShowTargetTa"
                        v-model="form.target"
                        style="width:190px;"
                        size="mini"
                        filterable
                        clearable
                        @change='onChangeTarget'
                        :placeholder="$t('lang.public_target_placeholder')">
                        <el-option v-for="(item,index) in target_list"
                            :key="index"
                            :label="item.lable"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-else
                        v-model="form.target"
                        style="width:190px;"
                        size="mini"
                        filterable
                        clearable
                        @change='onChangeTarget'
                        :placeholder="$t('lang.public_target_placeholder')">
                        <el-option v-for="(item,index) in target_mobile_list"
                            :key="index"
                            :label="item.lable"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label=""
                    prop="targetFunc">
                    <el-input v-if="(!isShowTargetInput && form.target != 'ctr')"
                        v-model.trim="form.targetFunc"
                        style="width:197px;"
                        :placeholder="target_input_text()"></el-input>
                    <el-input v-else
                        v-model.trim="form.targetFunc"
                        style="width:197px;"
                        :placeholder="target_input_text()">
                        <template slot="append">%</template></el-input>
                </el-form-item>
                <el-form-item :label="`${$t('lang.public_target_audience_label')}：`"
                    class="form-item-odd"
                    label-width="120px"
                    v-if="isShowTargetInput"
                    prop="targetPopulation">
                    <div class="crowd-box">
                        <div class="crowd-title">{{$t('lang.public_gender')}}</div>
                        <el-radio-group v-model="form.gender">
                            <el-radio label="0">{{$t('lang.public_all')}}</el-radio>
                            <el-radio label="sex_male_rate">{{$t('lang.public_male')}}</el-radio>
                            <el-radio label="sex_female_rate">{{$t('lang.public_female')}}</el-radio>
                        </el-radio-group>
                        <div class="crowd-title">{{$t('lang.public_age')}}</div>
                        <div class="age-box">
                            <el-tag size="small"
                                :class="{active:item.checked}"
                                type="info"
                                @click.native='onClickAge(item)'
                                v-for="(item,index) in ageRange"
                                :key="index">{{item.name}}</el-tag>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
        </div>
    </head-fold>
</template>
<script>
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";
import headFold from "@/views/public/head-fold";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
export default {
  name: "base-info",
  props: {
    edit_info: {
      type: Object,
    },
    selectList: {
      type: Object
    }
  },
  components: { headFold },
  data() {
    let self = this;
    let validateProjectName = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error(this.$t("lang.public_project_name_placeholder")));
      } else {
        if (!this.$constReg.name2.test(value)) {
          callback(new Error(this.$t("lang.reg_name_error_msg")));
        } else {
          callback();
        }
      }
    };
    let validateTarget = (rule, value, callback) => {
      if (this.form.target == "cpuv") {
        if (!this.$constReg.num23.test(this.form.targetFunc)) {
          callback(new Error(this.$t("lang.reg_CPUA_error_msg")));
        } else {
          callback();
        }
      } else {
        if (!this.$constReg.positiveInt.test(this.form.targetFunc)) {
          callback(new Error(this.target_error_text()));
        } else {
          callback();
        }
      }
    };
    let validateBudget = (rule, value, callback) => {
      if (this.$constReg.num4.test(value)) {
        callback();
      } else {
        callback(new Error(this.$t("lang.reg_positive_number_four_decimal")));
      }
    };

    let validateTargetPopulation = (rule, value, callback) => {
      // console.log("TCL: validateRelationPbs -> value", value)
      let errorStr = "";
      let ageFlag = true;
      let genderFlag = true;
      if (self.checkedAge.length == 0 && !self.form.gender) {
        callback(new Error(this.$t("lang.public_age_gender_placeholder")));
      } else {
        if (!self.form.gender) {
          callback(new Error(this.$t("lang.public_audience_placeholder")));
        }
        if (self.checkedAge.length == 0) {
          callback(new Error(this.$t("lang.public_age_placeholder")));
        }
        callback();
      }
    };
    return {
      ageRange: [
        { name: this.$t("lang.public_all"), value: "all", checked: false },
        { name: this.$t("lang.public_under_19"), value: "age_19_rate", checked: false },
        { name: `19-25 ${this.$t("lang.AS_detail_years_old")}`, value: "age_19_25_rate", checked: false },
        { name: `26-30 ${this.$t("lang.AS_detail_years_old")}`, value: "age_26_30_rate", checked: false },
        { name: `31-40 ${this.$t("lang.AS_detail_years_old")}`, value: "age_31_40_rate", checked: false },
        { name: `41-50 ${this.$t("lang.AS_detail_years_old")}`, value: "age_41_50_rate", checked: false },
        { name: this.$t("lang.public_over_50"), value: "age_50_rate", checked: false },
      ],
      port_list: ["APP", "PC", "WAP"],
      target_list: [
        { lable: `UV${this.$t("lang.budget_coverage_label")}`, value: "uv" },
        { lable: this.$t("lang.budget_exposures_label"), value: "win" },
        { lable: "Leads", value: "leads" },
        { lable: "CPM", value: "cpm" },
        { lable: "CPC", value: "cpc" },
        { lable: "CPL", value: "cpl" },
        { lable: "CPUV", value: "cpuv" },
        { lable: "CTR", value: "ctr" },
      ],
      target_mobile_list: [
        { lable: this.$t('lang.budget_ta_percent'), value: "ta" },
        { lable: `UV${this.$t("lang.budget_coverage_label")}`, value: "uv" },
        { lable: this.$t("lang.budget_exposures_label"), value: "win" },
        { lable: "Leads", value: "leads" },
        { lable: "CPM", value: "cpm" },
        { lable: "CPC", value: "cpc" },
        { lable: "CPL", value: "cpl" },
        { lable: "CPUV", value: "cpuv" },
        { lable: "CTR", value: "ctr" },
      ],
      brand_list: [],
      product_list: [],
      isLoading: false,
      rules: {
        cycle: [
          {
            required: true,
            message: this.$t("lang.public_project_period_placeholder"),
            trigger: ["change"],
          },
        ],
        projectName: [
          {
            required: true,
            validator: validateProjectName,
            trigger: ["blur", "change"],
          },
        ],
        budget: [
          {
            required: true,
            validator: validateBudget,
            trigger: ["blur", "change"],
          },
        ],
        customer: [{ required: true, message: this.$t("lang.public_client_placeholder"), trigger: "change" }],
        brand: [{ required: true, message: this.$t("lang.public_brand_placeholder"), trigger: "change" }],
        product: [{ required: true, message: this.$t("lang.public_product_placeholder"), trigger: "change" }],
        targetPopulation: [
          {
            required: true,
            validator: validateTargetPopulation,
            trigger: "change",
          },
        ],
        port: [{ required: true, message: this.$t("lang.public_port_placeholder"), trigger: "change" }],
        target: [{ required: true, message: this.$t("lang.public_Goal_placeholder"), trigger: "change" }],
        targetFunc: [
          {
            required: true,
            validator: validateTarget,
            trigger: ["blur", "change"],
          },
        ],
      },
      form: {
        gender: "",
        projectName: "",
        customer: "",
        brand: "",
        product: "",
        cycle: "",
        budget: "",
        targetFunc: "",
        port: [], //端口
        target: "", //目标函数项
      },
    };
  },
  watch: {},
  computed: {
    ...mapState("budget", ["customerID", "customer_list","handle_type","selectValue"]),
    ...mapState("user", ["languageInfo"]),
    //设置目标函数的显示
    isShowTargetTa() {
      return this.form.port.length == 1 && this.form.port.indexOf("APP") > -1;
    },
    //设置目标函数的输入框显示
    isShowTargetInput() {
      return this.isShowTargetTa && this.form.target == "ta";
    },
    //设置提示信息展示
    isShowTip() {
      if (this.form.port.length > 0) {
        if (this.form.port.indexOf("PC") > -1 || this.form.port.indexOf("WAP") > -1) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    checkedAge() {
      let rs = [];
      let vals = ["age_19_rate", "age_19_25_rate", "age_26_30_rate", "age_31_40_rate", "age_41_50_rate", "age_50_rate"];
      let index = this.ageRange.findIndex((i) => i.checked && i.value == "all");
      if (index != -1) {
        rs = vals;
      } else {
        for (let item of this.ageRange) {
          if (item.checked) {
            rs.push(item.value);
          }
        }
      }
      return rs;
    },
    checkedGender() {
      if (this.form.gender == "0") {
        return ["sex_male_rate", "sex_female_rate"];
      } else {
        return [this.form.gender];
      }
    },
  },
  created() {},
  mounted() {
    // this.init();
    if (this.handle_type === "edit") {
      this.$nextTick(() => {
        this.set_edit_form();
        this.set_select_list()
      });
    }
    if (this.handle_type === 'create' && this.customerID) {
      this.set_select_list()
    }
    this.form.customer = this.customerID;
  },
  methods: {
    ...mapActions("budget", ["fetch_customer_port_list", "fetch_brand_list", "fetch_product_list"]),
    set_edit_form(param) {
      this.form = this.edit_info;
    },
    set_select_list() {
      this.brand_list = this.selectValue.brandlists || []
      this.product_list = this.selectValue.productlists || []
    },
    update_ageRange(age) {
      this.ageRange.forEach((item) => {
        if (item.value === age) {
          item.checked = true;
        }
      });
    },
    onSubmit() {
      return new Promise((resolve, reject) => {
        this.$refs["form"].validate(async (valid) => {
          if (valid) {
            resolve(this.getData());
          } else {
            reject();
          }
        });
      });
    },
    getData() {
      let obj = {
        project_name: this.form.projectName,
        customer_id: this.form.customer,
        brand_id: this.form.brand,
        product_id: this.form.product,
        total_price: this.form.budget,
        ta_item: [...this.checkedAge, ...this.checkedGender],
        port: this.form.port.join(","),
        taper_key: this.form.target,
        taper_value: this.form.targetFunc,
        days: [this.form.cycle],
      };
      return obj;
    },
    onClickAge(obj) {
      obj.checked = !obj.checked;
      this.$refs.form.validateField("targetPopulation");
    },
    async onChangeCustomer() {
      if (this.form.customer) {
        this.isLoading = true;
        let { brand_list } = await this.fetch_brand_list({
          customer_id: this.form.customer,
        });
        this.brand_list = brand_list;
        this.isLoading = false;
      } else {
        this.brand_list = [];
      }
      this.form.brand = "";
      this.form.product = "";
      this.product_list = [];
      // this.fetchList();
    },
    async onChangeBrand() {
      if (this.form.brand) {
        this.isLoading = true;
        let customer_id = this.form.customer;
        let brand_id = this.form.brand;
        let { product_list } = await this.fetch_product_list({
          customer_id,
          brand_id,
        });
        this.product_list = product_list;
        this.isLoading = false;
      } else {
        this.product_list = [];
      }
      this.form.product = "";
      // this.fetchList();
    },
    onChangeProduct() {},
    init() {
      
    },
    //修改端口
    onChangePort() {
      this.form.target = "";
      this.$emit("currentPort", this.form.port.join(","));
    },
    //修改目标函数
    onChangeTarget() {
      this.target_input_text()
      this.form.gender = ''
      this.ageRange.forEach(item => {
        item.checked = false
      })
      this.form.targetFunc = "";
      this.$refs.form.validateField("targetFunc", function (error) {});
    },
    target_input_text() {
      let text = this.$t('lang.budget_Maximum_target')
      const minList = ['ta', 'uv', 'win', 'leads', 'ctr']
      // const maxList = ['cpm', 'cpc', 'cpl', 'cpuv']
      if (minList.includes(this.form.target)) {
        text = this.$t('lang.budget_Minimum_target')
      } else {
        text = this.$t('lang.budget_Maximum_target')
      }
      return text
    },
    target_error_text() {
      let text = this.$t('lang.reg_target_max_positiveInt')
      const minList = ['ta', 'uv', 'win', 'leads', 'ctr']
      // const maxList = ['cpm', 'cpc', 'cpl', 'cpuv']
      if (minList.includes(this.form.target)) {
        text = this.$t('lang.reg_target_min_positiveInt')
      } else {
        text = this.$t('lang.reg_target_max_positiveInt')
      }
      return text
    },
    async fetchCore(url, data, hasLoading = false) {
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
  },
};
</script>
<style scoped lang='scss'>
.base-info {
  margin-top: 30px;
  .crowd-box {
    background-color: #212936;
    border: 1px dashed #59616c;
    width: 940px;
    height: 118px;
    padding: 16px 18px;
    .crowd-title {
      font-size: 12px;
      color: #fff;
    }
  }
  .target-val {
    display: inline-block;
  }
  .target-icon {
    color: #fff;
    display: inline-block;
    width: 10px;
  }
  .target-start {
    display: inline-block;
    width: 127px;
    margin-left: 6px;
  }
  .target-end {
    display: inline-block;
    width: 127px;
  }
  .port-target-tip {
    position: absolute;
    left: -2px;
    font-size: 12px;
    line-height: 12px;
    top: 30px;
    color: orange;
  }
}
</style>
<style lang='scss'>
.base-info {
  .el-form--inline {
    .age-box .el-tag {
      cursor: pointer;
      margin-right: 10px;
      user-select: none;
      &.active {
        background-color: #39af97;
        color: #fff;
      }
    }
    .el-form-item:nth-child(even),
    .el-form-item.form-item-even {
      // padding-left: 60px;
      padding-left: 50px;
    }
    .el-form-item.form-item-odd {
      padding-left: 0px;
      .el-form-item__label {
        width: 120px;
      }
    }
    .el-form-item {
      margin-bottom: 20px;
    }
    .el-input-group__append {
      padding: 0 10px;
    }
    .el-form-item.target-func {
      padding-left: 0;
      .el-form-item__label {
        width: 81px !important;
      }
    }
  }

  /* .relation-pbs-form-item{
    height: calc(100% - 10px - 147px);
    margin-bottom:10px;
    &.isEdit{
      height: calc(100% - 10px - 147px - 36px);
    }
  }
  .relation-pbs-form-item .el-form-item__content {
    height: 100%;
  } */
}
</style>
