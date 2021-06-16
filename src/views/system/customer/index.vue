<template>
    <div class="customer-content">
        <div class="clearfix breadcrumb-wrap content-header">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '' }">
                    <span class="breadcrumb-item-line">|</span>{{$t('lang.secondary_nav_clients_manage')}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="project-filter clearfix content-header">
            <div class="pull-left">
                <el-button icon="el-icon-plus"
                    v-if="customerManage_permission==1"
                    :disabled="isAdding"
                    @click="onAddCustomer">{{$t('lang.system_client_add_title')}}</el-button>
            </div>
            <div class="pull-right clearfix">
                <el-select v-model="industry"
                    style="width: 150px;"
                    class="hy-input-with-title"
                    :placeholder="$t('lang.public_industry_placeholder')"
                    size="mini"
                    filterable
                    @change="changeIndustry">
                    <!-- <div slot="prefix"
                        class="select-prefix">{{$t('lang.public_industry_label')}}:</div> -->
                    <el-option key=""
                        :label="$t('lang.public_industry_All')"
                        :title="$t('lang.public_all')"
                        value="">
                    </el-option>
                    <el-option v-for="item in industry_list "
                        :key="item.id"
                        :title="item.name"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
                <el-select v-model="customer"
                    :title="formatCustomerTitle(customer)"
                    style="width: 150px;"
                    class="hy-input-with-title"
                    :placeholder="$t('lang.public_client_placeholder')"
                    size="mini"
                    :disabled='customer_list.length==0'
                    @change="changeCustomer">
                    <!-- <div slot="prefix"
                        class="select-prefix">{{$t('lang.public_client_label')}}:</div> -->
                    <el-option key=""
                        :label="$t('lang.public_client_All')"
                        :title="$t('lang.public_all')"
                        value="">
                    </el-option>
                    <el-option v-for="item in customer_list "
                        :key="item.id"
                        :title="item.customer_name"
                        :label="item.customer_name"
                        :value="item.id">
                    </el-option>
                </el-select>

                <el-select v-model="brand"
                    class="hy-input-with-title"
                    style="width: 150px;"
                    :placeholder="$t('lang.public_brand_placeholder')"
                    :disabled='brand_list.length==0'
                    size="mini"
                    @change="changeBrand">
                    <!-- <div slot="prefix"
                        class="select-prefix">{{$t('lang.public_brand_label')}}:</div> -->
                    <el-option key=""
                        :label="$t('lang.public_brand_All')"
                        :title="$t('lang.public_all')"
                        value="">
                    </el-option>
                    <el-option v-for="item in brand_list "
                        :key="item.id"
                        :label="item.brand_name"
                        :title="item.brand_name"
                        :value="item.id">
                    </el-option>
                </el-select>

                <el-select v-model="product"
                    :title="formatProductTitle(product)"
                    class="hy-input-with-title"
                    style="width: 150px;"
                    :disabled='product_list.length==0'
                    :placeholder="$t('lang.public_product_placeholder')"
                    size="mini"
                    @change="changeProduct">
                    <!-- <div slot="prefix"
                        class="select-prefix">{{$t('lang.public_product_label')}}:</div> -->
                    <el-option key=""
                        :label="$t('lang.public_product_All')"
                        :title="$t('lang.public_all')"
                        value="">
                    </el-option>
                    <el-option v-for="item in product_list "
                        :key="item.id"
                        :label="item.product_name"
                        :title="item.product_name"
                        :value="item.id">
                    </el-option>
                </el-select>

                <el-date-picker size="mini"
                    style="width: 180px;vertical-align: top;"
                    v-model="dateRange"
                    type="daterange"
                    align="right"
                    unlink-panels
                    :clearable="false"
                    :range-separator="$t('lang.public_DatePicker_between')"
                    :start-placeholder="$t('lang.public_DatePicker_start')"
                    :end-placeholder="$t('lang.public_DatePicker_end')"
                    :picker-options="pickerOptions"
                    value-format="yyyy-MM-dd"
                    @change="changeDate()">
                </el-date-picker>

                <el-input size="mini"
                    style="width:160px;vertical-align:bottom;"
                    :placeholder="$t('lang.public_key_words')"
                    v-model="keyWords"
                    @keyup.enter.native="onSearch">
                    <i slot="prefix"
                        class="el-input__icon el-icon-search"
                        @click="onSearch"
                        style="cursor: pointer;"></i>
                </el-input>
            </div>
        </div>

        <div class="customer-list content-body"
            v-loading.fullscreen="isLoading">
            <list-item v-if="isAdding"
                :id="addData.id"
                :serial-index="addData.c_id"
                :name="addData.customer_name"
                :industry="addData.industry_id"
                :industryList="industry_list"
                @add-confirm='onAddConfirm'
                @add-cancel='onAddCancel'
                :default-open="addData.id">
            </list-item>
            <template v-if="customerManage_permission==1">
                <list-item v-for="item in listData"
                    :update-time="item.utime"
                    :key="item.id"
                    :id="item.id"
                    :serial-index="item.c_id"
                    :name="item.customer_name"
                    :industry="item.industry_id"
                    :industryList="industry_list"
                    @edit-confirm='onEditConfirm'
                    @edit-cancel='onEditCancel'
                    @add='onAddBrand'
                    @delete='onDelete'
                    :default-open="defaultOpenId"
                    @fold='onFold'
                    :hasAddBtn='true'
                    :add-title="$t('lang.system_client_add_new_brand')">
                    <brand-list slot="sublist"
                        v-if='firstFold[item.id]'
                        :brand='brand'
                        :product='product'
                        :dateRange='dateRange'
                        :customerIndex='item.c_id'
                        :id='item.id' />
                </list-item>
            </template>
            <template v-else>
                <list-item v-for="item in listData"
                    :update-time="item.utime"
                    :key="item.id"
                    :id="item.id"
                    :serial-index="item.c_id"
                    :name="item.customer_name"
                    :default-open="defaultOpenId"
                    @fold='onFold'
                    :add-title="$t('lang.system_client_add_new_brand')">
                    <brand-list slot="sublist"
                        v-if='firstFold[item.id]'
                        :brand='brand'
                        :product='product'
                        :dateRange='dateRange'
                        :customerIndex='item.c_id'
                        :id='item.id' />
                </list-item>
            </template>

            <div class="pagination-wrap clearfix">
                <el-pagination background
                    @size-change="onSizeChange"
                    class="pull-right"
                    @current-change="onCurrentChange"
                    :current-page="currentPage"
                    :page-sizes="[5, 10, 20]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
        </div>

        <brand-product-create-edit v-if="isShowBrandDiag"
            type='brand'
            :isShow.sync="isShowBrandDiag"
            :id='editCustomerId'
            :isNew='true' />
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import moment from "moment";
import brandList from "./brand-list";
import brandProductCreateEdit from "./brand&product-create-edit";
import listItem from "@/views/public/list-collapse/list-item";
import fetch from "@/services/fetch";

export default {
  name: "customer-manage",
  componentName: "CustomerManage",
  components: {
    listItem,
    brandList,
    brandProductCreateEdit,
  },
  data() {
    return {
      defaultOpenId: "",
      isAdding: false, //是否处于添加状态
      addData: {}, //添加的数据
      industry: "",
      // editType:'',//brand 或者 product
      editCustomerId: "",
      isShowBrandDiag: false,
      isLoading: false,
      customer: "",
      customer_list: [],
      brand: "",
      brand_list: [],
      product: "",
      product_list: [],
      dateRange: [],
      keyWords: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now(); // - 24 * 60 * 60 * 1000; //禁用今天以后
        },
        shortcuts: this.$datePickerShortcuts,
      },
      firstFold: {},
      listData: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
    };
  },

  props: {
    values: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    ...mapState("system", ["agent_id"]),
    ...mapState("permissions", ["customerManage_permission"]),
    ...mapState("project", ["industry_list"]),
    disableNew() {
      if (this.listData && this.listData.length) {
        return !this.listData[0]["id"];
      } else {
        return false;
      }
    },
  },
  watch: {
    agent_id(n, o) {
      this.reset();
    },
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    ...mapActions("project", ["fetch_industry_list", "fetch_customer_port_list", "fetch_brand_list", "fetch_product_list"]),
    onSearch() {
      this.refresh();
      this.$broadcast("BrandList", "onSearch", this.keyWords);
    },
    //行业切换
    async changeIndustry() {
      if (this.industry) {
        this.isLoading = true;
        let { customer_list } = await this.fetch_customer_port_list({ industry_id: this.industry });
        this.customer_list = customer_list;
        this.isLoading = false;
      } else {
        this.customer_list = [];
      }
      this.brand_list = [];
      this.product_list = [];
      this.brand = "";
      this.product = "";
      this.customer = "";
      this.refresh();
    },
    async changeCustomer() {
      if (this.customer) {
        this.isLoading = true;
        let { brand_list } = await this.fetch_brand_list({ customer_id: this.customer });
        this.brand_list = brand_list;
        this.isLoading = false;
      } else {
        this.brand_list = [];
      }
      this.product_list = [];
      this.brand = "";
      this.product = "";

      this.refresh();
    },
    async changeBrand() {
      if (this.brand) {
        this.isLoading = true;
        let customer_id = this.customer;
        let brand_id = this.brand;
        let { product_list } = await this.fetch_product_list({ customer_id, brand_id });
        this.product_list = product_list;
        this.isLoading = false;
      } else {
        this.product_list = [];
      }
      this.product = "";
      this.refresh();
    },
    changeProduct() {
      this.refresh();
    },
    onEditCancel(id) {
      // console.log("onEditCancel", id);
    },
    validateName(name, industry) {
      let result = false;
      if (name.length && industry) {
        if (name.length > 50) {
          this.$message.error(this.$t("lang.reg_client_name_length_error"));
        } else {
          if (!this.$constReg.cnenName4.test(name)) {
            this.$message.error(this.$t("lang.reg_client_name_error_msg"));
          } else {
            result = true;
          }
        }
      } else {
        let mes = !name.length ? this.$t("lang.reg_client_name_required") : this.$t("lang.public_industry_placeholder");
        this.$message.error(mes);
      }
      return result;
    },
    initFilter() {
      this.customer = "";
      this.brand_list = [];
      this.product_list = [];
      this.brand = "";
      this.product = "";
      this.keyWords = "";
      this.dateRange = [];
    },
    //新建保存确认事件
    async onAddConfirm({ name, industry, _resolve, _reject }) {
      if (this.validateName(name, industry)) {
        try {
          await this.fetchCustomerCreate(name, industry);
          _resolve();
          this.isAdding = false;
          this.initFilter();
          this.fetchCustomersList();
        } catch (err) {
          _reject();
        }
      } else {
        _reject();
      }
    },
    async onEditConfirm({ id, name, industry, _resolve, _reject }) {
      if (this.validateName(name, industry)) {
        try {
          await this.fetchCustomerEdit(name, id, industry);
          let obj = this.listData.find((i) => i.id == id);
          if (obj) {
            obj.customer_name = name;
            obj.industry_id = industry;
          }
          _resolve();
          // this.init();
        } catch (err) {
          _reject();
        }
      } else {
        _reject();
      }
    },
    onAddCancel(id) {
      this.isAdding = false;
      this.defaultOpenId = this.listData[0].id;
      // this.listData.splice(0, 1);
    },
    newSerialIndex() {
      if (this.listData && this.listData.length) {
        // console.log(this.listData[0]['c_id'])
        return this.listData[0]["c_id"] - 0 + 1;
      } else {
        return 1;
      }
    },
    // getSerialIndex() {
    //   let str = "";
    //   let index = this.newSerialIndex();
    //   // console.log(index)
    //   if (index < 10) {
    //     return (str = "0" + index);
    //   }
    //   return str + index;
    // },

    onSizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.refresh();
    },
    onCurrentChange(val) {
      this.currentPage = val;
      this.fetchCustomersList();
    },
    async init() {
      this.customer = "";
      this.brand = "";
      this.product = "";
      this.keyWords = "";
      this.firstFold = {};
      this.fetchCustomersList();
      this.fetch_industry_list();
    },
    async reset() {
      this.dateRange = [];
      this.industry = "";
      this.customer = "";
      this.changeIndustry();
      this.brand = "";
      this.product = "";
      this.keyWords = "";
      this.firstFold = {};
      this.fetchCustomersList();
      this.fetch_customer_port_list({ industry_id: this.industry });
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
    async fetchCustomersList() {
      let data = await this.fetchCore(
        "/customers/lists",
        {
          industry_id: this.industry,
          customer_id: this.customer,
          page: this.currentPage,
          perpage: this.pageSize,
          start_date: this.dateRange[0],
          end_date: this.dateRange[1],
          name: this.keyWords,
        },
        true
      );
      this.listData = data.list;
      this.total = data.total - 0;
      this.defaultOpenId = this.isAdding ? "" : this.listData[0] ? this.listData[0].id : "";
    },
    async fetchCustomerCreate(name, industry_id) {
      let data = await this.fetchCore("/customers/add", { name, industry_id }, true);
      return data;
    },
    async fetchCustomerEdit(name, id, industry_id) {
      let param = { name, id, industry_id };
      let data = await this.fetchCore("/customers/edit", param, true);
      return data;
    },
    onFold({ id, isOpen }) {
      if (isOpen) {
        this.$set(this.firstFold, id, true);
      }
    },
    async onAddCustomer() {
      let data = await this.fetchCore("/customers/getmaxid");
      this.isAdding = true;
      this.defaultOpenId = "";
      let c_id = data.max_id;
      this.addData = {
        id: "",
        c_id,
        customer_name: "",
        industry_id: "", //新增客戶行业
      };
    },

    onDelete({ id, name }) {
      this.$confirm(
        this.$t("lang.system_client_delete_client_confirm1") + name + this.$t("lang.system_client_delete_client_confirm2"),
        this.$t("lang.public_dialog_point"),
        {
          confirmButtonText: this.$t("lang.public_button_confirm"),
          cancelButtonText: this.$t("lang.public_button_cancel"),
          type: "warning",
        }
      )
        .then(async () => {
          let data = await this.fetchCore("/customers/delete", { id }, true);
          this.fetchCustomersList();
        })
        .catch(() => {
          // console.log("catch");
        });

      // this.$router.push({ path: "/project/create" });
    },
    onAddBrand(id) {
      this.isShowBrandDiag = true;
      this.editCustomerId = id;
      // this.editType = 'brand';
      // this.$router.push({ path: "/project/create" });
    },
    changeDate() {
      this.refresh();
    },
    refresh() {
      this.currentPage = 1;
      this.fetchCustomersList();
    },
    formatTitle(arr, id, titleStr) {
      return;
      let obj = arr.find((item) => {
        return item.id == id;
      });

      if (obj && obj.name) {
        return titleStr + ":" + obj.name;
      } else {
        return "";
      }
    },
    formatBrandTitle(id) {
      this.formatTitle(this.brandList, id, this.$t('lang.public_brand_label'));
    },
    formatCustomerTitle(id) {
      this.formatTitle(this.customerList, id, this.$t('lang.public_client_label'));
    },
    formatProductTitle(id) {
      this.formatTitle(this.productList, id, this.$t('lang.public_product_label'));
    },
  },
};
</script>
<style scoped lang="scss">
.customer-content {
  .content-header,
  .content-body {
    padding: 0 20px;
  }
}
.select-prefix {
  line-height: 28px;
  height: 28px;
}
.customer-list {
  margin-top: 30px;
}
.project-filter {
  /* padding-top: 33px; */
}
</style>
<style>
/*全局部分*/
</style>