<template>
    <head-fold title="STEP1:项目基本信息配置">
        <div class="clearfix base-info"
            v-loading="isLoading">
            <el-form size='mini'
                ref="form"
                style="height: 100%;"
                :inline="true"
                :model="form"
                :rules="rules"
                class="form"
                label-width="105px">

                <el-form-item label="项目名称："
                    prop="projectName">
                    <el-input v-model.trim="form.projectName"
                        style="width:400px;"
                        placeholder="请输入项目名称"></el-input>
                </el-form-item>

                <el-form-item label="所属客户："
                    prop="customer">
                    <el-select v-model="form.customer"
                        style="width:400px;"
                        size="mini"
                        filterable
                        clearable
                        @change='onChangeCustomer'
                        placeholder="请选择所属客户">
                        <el-option v-for="item in customer_list"
                            :key="item.id"
                            :label="item.customer_name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="项目周期："
                    prop="cycle">
                    <el-date-picker size="mini"
                        style="width: 400px;"
                        v-model="form.cycle"
                        prefix-icon="el-icon-time"
                        type="daterange"
                        align="right"
                        :clearable="true"
                        unlink-panels
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="所属品牌："
                    prop="brand">
                    <el-select v-model="form.brand"
                        style="width:400px;"
                        size="mini"
                        filterable
                        clearable
                        @change='onChangeBrand'
                        placeholder="请选择所所属品牌">
                        <el-option v-for="item in brand_list"
                            :key="item.id"
                            :label="item.brand_name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="项目预算："
                    prop="budget">
                    <el-input style="width:400px"
                        placeholder="请输入项目预算"
                        v-model="form.budget">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>

                <el-form-item label="所属产品："
                    class="form-item-even"
                    prop="product">
                    <el-select v-model="form.product"
                        style="width:400px;"
                        size="mini"
                        filterable
                        clearable
                        @change='onChangeProduct'
                        placeholder="请选择所属产品">
                        <el-option v-for="item in product_list"
                            :key="item.id"
                            :label="item.product_name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="端口："
                    prop="port"
                    style="position:relative">
                    <el-select v-model="form.port"
                        style="width:400px;"
                        size="mini"
                        multiple
                        clearable
                        @change='onChangePort'
                        placeholder="请选择端口">
                        <el-option v-for="(item,index) in port_list"
                            :key="index"
                            :label="item"
                            :value="item">
                        </el-option>
                    </el-select>
                    <div v-if="isShowTip"
                        class="port-target-tip">您选择的端口中包含PC/WAP,不支持TA目标人群函数</div>
                </el-form-item>

                <el-form-item label="目标函数："
                    prop="target">
                    <el-select v-if="!isShowTargetTa"
                        v-model="form.target"
                        style="width:190px;"
                        size="mini"
                        filterable
                        clearable
                        @change='onChangeTarget'
                        placeholder="请选择目标">
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
                        placeholder="请选择目标">
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
                        placeholder="请输入最低目标值"></el-input>
                    <el-input v-else
                        v-model.trim="form.targetFunc"
                        style="width:197px;"
                        placeholder="请输入最低目标值">
                        <template slot="append">%</template></el-input>
                </el-form-item>

                <el-form-item label="目标人群："
                    class="form-item-odd"
                    v-if="isShowTargetInput"
                    prop="targetPopulation">
                    <div class="crowd-box">
                        <div class="crowd-title">性别</div>
                        <el-radio-group v-model="form.gender">
                            <el-radio label="0">全部</el-radio>
                            <el-radio label="sex_male_rate">男</el-radio>
                            <el-radio label="sex_female_rate">女</el-radio>
                        </el-radio-group>
                        <div class="crowd-title">年龄</div>
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
  components: { headFold },
  data() {
    let self = this;
    let validateProjectName = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error("请输入项目名称"));
      } else {
        if (!this.$constReg.name2.test(value)) {
          callback(new Error("只允许数字、英文、中文、下划线 30个字符以内"));
        } else {
          callback();
        }
      }
    };
    let validateTarget = (rule, value, callback) => {
      if(this.form.target == "cpuv"){
        if (!this.$constReg.num23.test(this.form.targetFunc)) {
        callback(new Error("CPUV为正数、最多保留3位小数")); 
        }else{
          callback();
        }
      }else{
        if (!this.$constReg.positiveInt.test(this.form.targetFunc)) {
        callback(new Error("请输入正整数的最低目标值")); 
        }else{
          callback();
        }
      }   
    };
    let validateBudget = (rule, value, callback) => {
      if (this.$constReg.num4.test(value)) {
        callback();
      } else {
        callback(new Error("仅支持正数最多保留4位小数"));
      }
    };

    let validateTargetPopulation = (rule, value, callback) => {
      // console.log("TCL: validateRelationPbs -> value", value)
      let errorStr = "";
      let ageFlag = true;
      let genderFlag = true;
      if (self.checkedAge.length == 0 && !self.form.gender) {
        callback(new Error("请选择性别和年龄"));
      } else {
        if (!self.form.gender) {
          callback(new Error("请选择性别"));
        }
        if (self.checkedAge.length == 0) {
          callback(new Error("请选择年龄"));
        }
        callback();
      }
    };
    return {
      ageRange: [
        { name: "全部", value: "all", checked: false },
        { name: "19岁以下", value: "age_19_rate", checked: false },
        { name: "19-25岁", value: "age_19_25_rate", checked: false },
        { name: "26-30岁", value: "age_26_30_rate", checked: false },
        { name: "31-40岁", value: "age_31_40_rate", checked: false },
        { name: "41-50岁", value: "age_41_50_rate", checked: false },
        { name: "50岁以上", value: "age_50_rate", checked: false }
      ],
      port_list: ["APP", "PC", "WAP"],
      target_list: [
        {lable:"UV覆盖数",value:"uv"},
        {lable: "曝光数",value:"win"},
        {lable:"Leads",value:"leads"},
        {lable:"CPM",value:"cpm"},
        {lable:"CPC",value:"cpc"},
        {lable:"CPL",value:"cpl"},
        {lable:"CPUV",value:"cpuv"},
        {lable:"CTR",value:"ctr"},
      ],
      target_mobile_list: [
        {lable:"TA占比",value:"ta"},
        {lable:"UV覆盖数",value:"uv"},
        {lable: "曝光数",value:"win"},
        {lable:"Leads",value:"leads"},
        {lable:"CPM",value:"cpm"},
        {lable:"CPC",value:"cpc"},
        {lable:"CPL",value:"cpl"},
        {lable:"CPUV",value:"cpuv"},
        {lable:"CTR",value:"ctr"},
      ],
      brand_list: [],
      product_list: [],
      isLoading: false,
      rules: {
        cycle: [
          {
            required: true,
            message: "请选择项目周期",
            trigger: ["change"]
          }
        ],
        projectName: [
          {
            required: true,
            validator: validateProjectName,
            trigger: ["blur", "change"]
          }
        ],
        budget: [
          {
            required: true,
            validator: validateBudget,
            trigger: ["blur", "change"]
          }
        ],
        customer: [
          { required: true, message: "请选择所属客户", trigger: "change" }
        ],
        brand: [
          { required: true, message: "请选择所属品牌", trigger: "change" }
        ],
        product: [
          { required: true, message: "请选择所属产品", trigger: "change" }
        ],
        targetPopulation: [
          {
            required: true,
            validator: validateTargetPopulation,
            trigger: "change"
          }
        ],
        port: [{ required: true, message: "请选择端口", trigger: "change" }],
        target: [
          { required: true, message: "请选择目标函数", trigger: "change" }
        ],
        targetFunc: [
          {
            required: true,
            validator: validateTarget,
            trigger: ["blur", "change"]
          }
        ]
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
        target: "" //目标函数项
      }
    };
  },
  watch: {},
  computed: {
    ...mapState("project", ["customer_list"]),
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
        if (
          this.form.port.indexOf("PC") > -1 ||
          this.form.port.indexOf("WAP") > -1
        ) {
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
      let vals = [
        "age_19_rate",
        "age_19_25_rate",
        "age_26_30_rate",
        "age_31_40_rate",
        "age_41_50_rate",
        "age_50_rate"
      ];
      let index = this.ageRange.findIndex(i => i.checked && i.value == "all");
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
    }
  },
  created() {},
  mounted() {
    // this.init();
  },
  methods: {
    ...mapActions("project", [
      "fetch_customer_port_list",
      "fetch_brand_list",
      "fetch_product_list"
    ]),
    onSubmit() {
      return new Promise((resolve, reject) => {
        this.$refs["form"].validate(async valid => {
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
        days: [this.form.cycle]
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
          customer_id: this.form.customer
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
          brand_id
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
    async init(url, data, hasLoading = false) {
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
    //修改端口
    onChangePort() {
      this.form.target = "";
      this.$emit("currentPort", this.form.port.join(","));
    },
    //修改目标函数
    onChangeTarget() {
      this.form.targetFunc = "";
      this.$refs.form.validateField("targetFunc", function(error) {});
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
    }
  }
};
</script>
<style scoped lang='scss'>
.base-info {
  margin-top: 30px;
  .crowd-box {
    background-color: #212936;   /*（背景调换）选择TA占比，下拉框背景*/
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
    top: 25px;
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
        background-color: #39af97;  /*（背景调换）选择TA占比，年龄动态颜色*/
        color: #fff;
      }
    }
    .el-form-item:nth-child(even),
    .el-form-item.form-item-even {
      padding-left: 60px;
    }
    .el-form-item.form-item-odd {
      padding-left: 0px;
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
