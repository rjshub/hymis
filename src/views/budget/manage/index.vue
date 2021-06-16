<template>
    <div v-if="budgetManage_permission!=0"
        class="budget-list-wrap">
        <!-- 面包屑导航 -->
        <div class="clearfix breadcrumb-wrap">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/budget/manage' }">
                    <span class="breadcrumb-item-line">|</span>{{$t('lang.third_nav_budget_list')}}</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button icon="el-icon-plus"
                class="pull-right"
                style="margin-top: 21px;"
                @click="add_new_budget">{{$t('lang.third_nav_add_budget')}}</el-button>
        </div>
        <!-- 过滤 -->
        <div class="budget-filter clearfix"
            :class="{'fixed-top':false}">
            <div style="display:flex;">
                <div>
                    <el-select v-model="form.customer"
                        style="width:110px"
                        :placeholder="$t('lang.public_client_placeholder')"
                        size="mini"
                        filterable
                        @change="changeCustomer">
                        <el-option key=""
                            :label="$t('lang.public_client_All')"
                            value="">
                        </el-option>
                        <el-option v-for="item in customer_list"
                            :key="item.id"
                            :label="item.customer_name"
                            :value="item.id">
                        </el-option>
                    </el-select>

                    <el-select v-model="form.brand"
                        style="width:110px"
                        :disabled='brand_list.length==0'
                        :placeholder="$t('lang.public_brand_placeholder')"
                        size="mini"
                        @change="changeBrand">
                        <el-option key=""
                            :label="$t('lang.public_brand_All')"
                            value="">
                        </el-option>
                        <el-option v-for="item in brand_list "
                            :key="item.id"
                            :label="item.brand_name"
                            :value="item.id">
                        </el-option>
                    </el-select>

                    <el-select v-model="form.product"
                        :disabled="product_list.length==0"
                        style="width:110px"
                        :placeholder="$t('lang.public_product_placeholder')"
                        size="mini"
                        @change="changeProduct">
                        <el-option key=""
                            :label="$t('lang.public_product_All')"
                            value="">
                        </el-option>
                        <el-option v-for="item in product_list "
                            :key="item.id"
                            :label="item.product_name"
                            :value="item.id">
                        </el-option>
                    </el-select>

                    <el-select v-model="form.port"
                        style="width:128px"
                        :placeholder="$t('lang.public_port_placeholder')"
                        @change="changePort"
                        multiple
                        collapse-tags
                        size="mini">
                        <el-option key=""
                            :label="$t('lang.public_port_All')"
                            value="All">
                        </el-option>
                        <el-option :key='item'
                            v-for="item in portList"
                            :label='item' :value="item">
                        </el-option>
                    </el-select>

                    <el-select v-model="form.project"
                        :disabled="projectList.length==0"
                        style="width:110px"
                        :placeholder="$t('lang.public_project_placeholder')"
                        @change="changeProject"
                        size="mini">
                        <el-option key=""
                            :label="$t('lang.public_project_All')"
                            value="">
                        </el-option>
                        <el-option v-for="item in projectList"
                            :key="item.id"
                            :label="item.project_name"
                            :value="item.id">
                        </el-option>
                    </el-select>

                    <el-select v-model="form.target"
                        style="width: 120px;"
                        :placeholder="$t('lang.public_Goal_placeholder')"
                        @change="changeTarget"
                        size="mini">
                        <el-option key=""
                            :label="$t('lang.public_all_Target')"
                            value="">
                        </el-option>
                        <el-option v-for="item in target_list"
                            :key="item.id"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-date-picker size="mini"
                        style="width: 230px;vertical-align: bottom;"
                        v-model="form.dateValue"
                        type="daterange"
                        align="right"
                        unlink-panels
                        :range-separator="$t('lang.public_DatePicker_between')"
                        :start-placeholder="$t('lang.public_DatePicker_start')"
                        :end-placeholder="$t('lang.public_DatePicker_end')"
                        @change="refresh"
                        :picker-options="pickerOptions">
                    </el-date-picker>

                    <el-input size="mini"
                        style="width:180px;vertical-align:bottom;"
                        :placeholder="$t('lang.public_key_words')"
                        v-model="form.keyWords"
                        @keyup.enter.native="refresh">
                        <i slot="prefix"
                            @click="refresh"
                            class="el-input__icon el-icon-search"
                            style="cursor: pointer;"></i>
                    </el-input>
                </div>
            </div>

        </div>
        <!-- 列表 -->
        <div v-if="isHasBudgetList != 0"
            class="budget-list"
            v-loading.fullscreen="isLoading">
            <list-item v-for="item in listData"
                :key="item.id"
                :id="item.id"
                :serial-index="item.c_id"
                :name="item.customer_name"
                @fold='onFold'
                :add-title="$t('lang.third_nav_add_budget')"
                @add='onAdd'
                :hasAddBtn='true'
                :default-open="listData[0].id">
                <project-list slot="sublist"
                    ref="customer_project"
                    v-if='firstFold[item.id]'
                    :values="item.project"
                    :params="getProjectFilterParams"
                    @delete_success="delete_success"
                    :customer-info="{customer_id:item.id,customer_name:item.customer_name}" />
            </list-item>

            <div v-if="listData.length==0"
                style="text-align: center;
          color: #cdd4da;
          font-size: 14px;">{{$t('lang.public_empty_list_text')}}</div>

            <div class="pagination-wrap clearfix">
                <el-pagination background
                    @size-change="handleSizeChange"
                    class="pull-right"
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[5, 10, 20]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
        </div>

    </div>
    <div class="no-auth"
        v-else>{{$t('lang.AS_no_project_list_permission')}}</div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import math from "mathjs";
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";
import projectList from "./project-list";
import subListItem from "@/views/public/list-collapse/sub-list-item";
import listItem from "@/views/public/list-collapse/list-item";

export default {
  components: {
    projectList,
    subListItem,
    listItem
  },
  provide() {
    return {
      parentData: this.form
    };
  },
  data() {
    return {
      isLoading: false,
      isHasBudgetList: 1, //默认没有项目数据
      isHasCustomerList: 1, //默认没有客户数据
      // 详情
      isShowDetailDialog: false,
      detailValues: {},
      // 过滤
      form: {
        customer: "",
        brand: "",
        product: "",
        port: [],
        project: "",
        target: "", // 目标函数
        dateValue: [],
        keyWords: "",
      },
      portList: ["APP", "PC", "WAP"],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now(); // - 24 * 60 * 60 * 1000; //禁用今天以后
        },
        shortcuts: this.$datePickerShortcuts,
      },
      listData: [],
      projectList: [],
      firstFold: {}, //当前打开的是哪个
      brand_list: [],
      product_list: [],
      target_list: [
        {label: this.$t('lang.budget_ta_percent'), value: "ta" },
        {label:`UV${this.$t('lang.budget_coverage_label')}`,value:"uv"},
        {label: this.$t('lang.budget_exposures_label'),value:"win"},
        {label:"Leads",value:"leads"},
        {label:"CPM",value:"cpm"},
        {label:"CPC",value:"cpc"},
        {label:"CPL",value:"cpl"},
        {label:"CPUV",value:"cpuv"},
        {label:"CTR",value:"ctr"},
      ],
      currentPage: 1,
      pageSize: 5,
      total: 0,
    };
  },
  watch: {
    agent_id(n, o) {
      this.resetData();
      this.init();
    }
  },
  computed: {
    ...mapState("system", ["agent_id"]),
    ...mapState("permissions", ["budgetManage_permission"]),
    ...mapState("permissions", ["project_create_permission", "customerManage_permission"]),
    ...mapState("budget", ["customerID", "customer_list", "port_list", "is_fromback"]),
    getProjectFilterParams() {
      return {
        customerId: this.form.customer == "0" ? "" : this.form.customer,
        brandId: this.form.brand == "0" ? "" : this.form.brand,
        productId: this.form.product == "0" ? "" : this.form.product,
        projectId: this.form.project == "0" ? "" : this.form.project,
        port: this.form.port == [] ? "" : this.form.port,
        target: this.form.target == "" ? "" : this.form.target
      };
    }
  },
  methods: {
    ...mapActions("budget", [
      "fetch_customer_port_list",
      "fetch_brand_list",
      "fetch_product_list",
      "fetch_project_list",
      "update_customer_id",
      "update_customer_name",
      "update_handle_type"
    ]),
    add_new_budget() {
      this.update_customer_id('')
      this.update_customer_name('')
      this.$router.replace("/budget/create");
      this.update_handle_type('create')
    },
    // 过滤
    // 改变客户
    async changeCustomer() {
      await this.changeCustomerEx();
      await this.refresh();
    },
    async changeCustomerEx() {
      if (this.form.customer) {
        let { brand_list } = await this.fetch_brand_list({
          customer_id: this.form.customer,
          // menu: 3
        });
        this.brand_list = brand_list;
      } else {
        this.brand_list = [];
      }
      this.product_list = [];
      this.projectList = [];
      //客户选择全部，则品牌、产品也切换为全部
      this.form.brand = "";
      this.form.product = "";
      this.form.project = "";
    },
    // 改变品牌
    async changeBrand() {
      if (this.form.brand) {
        let customer_id = this.form.customer;
        let brand_id = this.form.brand;
        let { product_list } = await this.fetch_product_list({
          customer_id,
          brand_id,
          menu: 3
        });
        this.product_list = product_list;
      } else {
        this.product_list = [];
      }
      this.projectList = [];

      //品牌选择全部，则产品也切换为全部
      this.form.product = "";
      this.form.project = "";
      this.refresh();
    },
    // 改变产品
    async changeProduct() {
      if (this.form.product) {
        let customer_id = this.form.customer;
        let brand_id = this.form.brand;
        let product_id = this.form.product;
        let { project_list } = await this.fetch_project_list({
          customer_id,
          brand_id,
          product_id,
          menu: 3
        });
        this.projectList = project_list;
      } else {
        this.projectList = [];
      }

      this.form.project = "";
      this.refresh();
    },
    // 端口
    changePort(param) {
      if (param.includes('All')) {
        this.form.port = this.portList
      }
      this.refresh();
    },
    // 项目
    changeProject() {
      this.refresh();
    },
    // 状态
    changeTarget() {
      this.refresh();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetch_customers_list();
    },
    // 查数据
    /**获取项目列表数据 */
    async fetch_customers_list() {
      let start_date = "";
      let end_date = "";

      if (this.form.dateValue && this.form.dateValue.length > 0) {
        start_date = moment(this.form.dateValue[0]).format("YYYY-MM-DD");
        end_date = moment(this.form.dateValue[1]).format("YYYY-MM-DD");
      } else {
        start_date = "";
        end_date = "";
      }
      let url = "/algorithm/lists";
      let param = {
        customer_id: this.form.customer,
        brand_id: this.form.brand,
        product_id: this.form.product,
        port: this.form.port,
        project_id: this.form.project,
        target: this.form.target,
        page: this.currentPage,
        perpage: this.pageSize,
        start_date,
        end_date,
        name: this.form.keyWords,
      };
      let data = await this.fetchCore(url, param, true);
      this.total = data.total - 0;
      if (this.total > 0) {
        //有数据
        if (this.isHasBudgetList == 0) {
          this.isHasBudgetList = 1;
        }
        if (this.isHasCustomerList == 0) {
          this.isHasCustomerList = 1;
        }
      }
      this.listData = data.list;
      // this.setReadWritePermission(data.list);
    },
    init() {
      // this.fetch_check_data_list()
      if (this.is_fromback) {
        this.form.customer = this.customerID;
        this.changeCustomerEx();
      }
      this.fetch_customers_list();
      this.fetch_customer_port_list({ menu: 3 });
    },
    // 列表操作
    onFold({ id, isOpen }) {
      if (isOpen) {
        this.firstFold = {};
        this.$set(this.firstFold, id, true);
      }
    },
    onAdd(id) {
      let name = ''
      this.update_customer_id(id);
      const index = this.listData.findIndex(obj => {
        return obj.id === id
      })
      name = this.listData[index].customer_name
      this.update_customer_name(name);
      this.update_handle_type('create')
      this.$refs.customer_project[0].get_select_list()
    },
    delete_success() {
      this.fetch_customers_list();
    },
    // 重置
    resetData() {
      this.form = {
        customer: "",
        brand: "",
        product: "",
        port: "",
        project: "",
        target: "",
        dateValue: [],
        keyWords: ""
      };
      this.currentPage = 1;
      this.pageSize = 5;
    },
    refresh() {
      this.currentPage = 1;
      this.fetch_customers_list();
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
  mounted() {
    this.init()
  },
};
</script>
<style>
.project-filter .el-input--prefix .el-input__inner {
  padding-left: 33px;
}
</style>
<style lang='scss' scoped>
.budget-list-wrap {
  // margin: 0 20px;
  .breadcrumb-wrap,
  .budget-filter {
    margin: 0 20px;
  }
  .budget-filter {
    width: 1124px;
    .fixed-top {
      position: fixed;
      top: 46px;
      opacity: 1;
      z-index: 100;
      background-color: #131d29; /*(背景调换)项目列表搜索栏背景*/
      transition: all ease-in-out 0.3s;
    }
  }
  .budget-list {
    padding: 0 20px;
    margin-top: 25px;
  }
}
.no-auth {
  text-align: center;
  color: #cdd4da;
  font-size: 14px;
  height: 500px;
  line-height: 500px;
}
</style>