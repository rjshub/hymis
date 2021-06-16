<template>
    <div v-if="enableProjectList"
        class="project-list-wrap">
        <div class="clearfix breadcrumb-wrap">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/' }">
                    <span class="breadcrumb-item-line">|</span>{{isProjectManage? $t('lang.third_nav_project_list'):$t('lang.third_nav_archived_project')}}</el-breadcrumb-item>
                <!-- <el-breadcrumb-item  @click.native="newProject" :to="{ path: '/strategy/manage' }">项目列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/' }">归档项目</el-breadcrumb-item> -->
            </el-breadcrumb>
            <el-button icon="el-icon-plus"
                class="pull-right"
                v-if="isProjectManage&&project_create_permission==1"
                style="margin-top: 21px;"
                @click="newProject">{{$t('lang.third_nav_add_project')}}</el-button>
        </div>
        <div class="project-filter clearfix"
            :class="{'fixed-top':false}">
            <div style="display:flex;">
                <div>
                    <!-- :title="formatCustomerTitle(form.customer)" -->
                    <el-select v-model="form.customer"
                        :style="{width: (isProjectManage?'110px':'130px')}"
                        :placeholder="$t('lang.public_client_placeholder')"
                        size="mini"
                        filterable
                        @change="changeCustomer">
                        <!-- <div slot="prefix"
              v-if="form.customer"
              class="select-prefix">{{$t('lang.public_client_label')}}:</div> -->
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
                        :style="{width: (isProjectManage?'110px':'130px')}"
                        :disabled='brand_list.length==0'
                        :placeholder="$t('lang.public_brand_placeholder')"
                        size="mini"
                        @change="changeBrand">
                        <!-- <div slot="prefix"
              v-if="form.brand"
              class="select-prefix">{{$t('lang.public_brand_label')}}:</div> -->
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
                        :style="{width: (isProjectManage?'110px':'130px')}"
                        :placeholder="$t('lang.public_product_placeholder')"
                        size="mini"
                        @change="changeProduct">
                        <!-- <div slot="prefix"
              v-if="form.product"
              class="select-prefix">{{$t('lang.public_product_label')}}:</div> -->
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
                        :style="{width: (isProjectManage?'135px':'150px')}"
                        :placeholder="$t('lang.public_port_placeholder')"
                        @change="changePort"
                        size="mini">
                        <!-- <div slot="prefix"
              v-if="form.port"
              class="select-prefix">{{$t('lang.public_port_label')}}:</div> -->
                        <el-option key=""
                            :label="$t('lang.public_port_All')"
                            value="">
                        </el-option>
                        <el-option-group :key='item.label'
                            v-for="item in portList"
                            :label='item.label'>
                            <div slot="prefix"
                                v-if="form.port"
                                class="select-prefix">{{$t('lang.public_port_label')}}:</div>
                            <el-option :key='i.value'
                                v-for="i in item.options"
                                :value='i.value'
                                :label='i.label'></el-option>
                        </el-option-group>
                    </el-select>

                    <el-select v-model="form.project"
                        :disabled="projectList.length==0"
                        :style="{width: (isProjectManage?'111px':'150px')}"
                        :placeholder="$t('lang.public_project_placeholder')"
                        @change="changeProject"
                        size="mini">
                        <!-- <div slot="prefix"
              v-if="form.project"
              class="select-prefix">{{$t('lang.public_project_label')}}:</div> -->
                        <el-option key=""
                            :label="$t('lang.public_project_All')"
                            value="">
                        </el-option>
                        <el-option v-for="item in projectList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>

                    <el-select v-model="form.status"
                        style="width: 110px;"
                        :placeholder="$t('lang.public_status_placeholder')"
                        @change="changeStatus"
                        v-if="pageType=='ProjectManage'"
                        size="mini">
                        <!-- <div slot="prefix"
              v-if="form.status"
              class="select-prefix">{{$t('lang.public_status_label')}}:</div> -->
                        <el-option key=""
                            :label="$t('lang.public_status_All')"
                            value="">
                        </el-option>
                        <!-- <el-option v-for="item in statusList "
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option> -->
                        <el-option :label="$t('lang.public_tooltip_finish')" value="1"></el-option>
                        <el-option :label="$t('lang.public_tooltip_draft')" value="0"></el-option>
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

        <div v-if="isHasProjectList != 0"
            class="project-list"
            v-loading.fullscreen="isLoading">
            <list-item v-for="item in listData"
                :key="item.id"
                :id="item.id"
                :serial-index="item.c_id"
                :name="item.customer_name"
                @fold='onFold'
                :add-title="$t('lang.third_nav_add_project')"
                @add='onAdd'
                :hasAddBtn='hasAddBtn(item.auth_type)'
                :default-open="listData[0].id">
                <project-list slot="sublist"
                    v-if='firstFold[item.id]'
                    :pageType='pageType'
                    :values="item.project"
                    :params="getProjectFilterParams"
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
        <div class="no-data-tip"
            v-else>
            <template v-if="isProjectManage">
                <div v-if="isHasCustomerList == 0">
                    {{$t('lang.AS_no_client_point1')}}<span class="tip-link"
                        :title="$t('lang.AS_no_client_tooltip')"
                        @click="goCreatCustomer">{{$t('lang.secondary_nav_clients_manage')}}</span>{{$t('lang.AS_no_client_point2')}}
                </div>
                <div v-else>
                    {{$t('lang.AS_no_project_point1')}}<span class="tip-link"
                        :title="$t('lang.AS_no_project_tooltip')"
                        @click="newProject">+{{$t('lang.third_nav_add_project')}}</span>{{$t('lang.AS_no_project_point2')}}
                </div>
            </template>
            <template v-else>
                <div v-if="isHasCustomerList == 0">
                    {{$t('lang.AS_no_client_point1')}}<span class="tip-link"
                        :title="$t('lang.AS_no_client_tooltip')"
                        @click="goCreatCustomer">{{$t('lang.secondary_nav_clients_manage')}}</span>{{$t('lang.AS_no_client_point2')}}
                </div>
                <div v-else>
                    {{$t('lang.AS_no_archived_project')}}
                </div>
            </template>
        </div>
    </div>
    <div class="no-auth"
        v-else>{{$t('lang.AS_no_project_list_permission')}}</div>
</template>
<script>
import math from "mathjs";

import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";
import { mapState, mapActions, mapGetters } from "vuex";
import projectList from "./project-list";
import subListItem from "@/views/public/list-collapse/sub-list-item";
import listItem from "@/views/public/list-collapse/list-item";
export default {
  name: "ProjectManage",
  componentName: "ProjectManage",
  components: {
    listItem,
    subListItem,
    projectList
  },
  provide() {
    return {
      parentData: this.form
    };
  },
  data() {
    return {
      isHasProjectList: 1, //默认没有项目数据
      isHasCustomerList: 1, //默认没有客户数据
      pageType: "",
      isLoading: false,
      isShowDetailDialog: false,
      detailValues: {},
      customerList: [],
      brandList: [],
      productList: [],
      projectList: [],
      statusList: [
        { id: "1", name: "完成" },
        { id: "0", name: "草稿" }
      ],
      portList: [
        {
          label: "OTV",
          options: [
            {
              value: "1",
              label: "Phone"
            },
            {
              value: "2",
              label: "Pad"
            },
            {
              value: "3",
              label: "Pc"
            },
            {
              value: "4",
              label: "Mobile(Phone+Pad)"
            }
          ]
        },
        {
          label: "OTT",
          options: [
            {
              value: "5",
              label: "OTT"
            }
          ]
        }
      ],
      form: {
        customer: "",
        brand: "",
        product: "",
        port: "",
        project: "",
        status: "",
        dateValue: [],
        keyWords: ""
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now(); // - 24 * 60 * 60 * 1000; //禁用今天以后
        },
        shortcuts: this.$datePickerShortcuts
      },
      listData: [],
      currentPage: 1,
      pageSize: 5,
      total: 0,
      firstFold: {}, //当前打开的是哪个
      brand_list: [],
      product_list: []
      // fromBack:false,//是否点击返回回来的
      //scrollTop:0,
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
    ...mapState("permissions", ["project_create_permission", "customerManage_permission"]),
    ...mapState("project", ["customerID", "customer_list", "port_list", "is_fromback"]),
    // ...mapState(["scrollTop"]),
    ...mapGetters("permissions", ["enableProjectList"]),
    isProjectManage() {
      return this.pageType == "ProjectManage";
    },
    getProjectFilterParams() {
      return {
        customerId: this.form.customer == "0" ? "" : this.form.customer,
        brandId: this.form.brand == "0" ? "" : this.form.brand,
        productId: this.form.product == "0" ? "" : this.form.product,
        projectId: this.form.project == "0" ? "" : this.form.project,
        port: this.form.port == "0" ? "" : this.form.port,
        status: this.form.status == "0,1" ? "" : this.form.status
      };
    }
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    ...mapActions("permissions", ["update_readWrite_permission"]),
    ...mapActions("project", [
      "update_customer_id",
      "update_customer_name",
      "fetch_customer_port_list",
      "fetch_brand_list",
      "fetch_product_list",
      "update_project_id",
      "update_project_name",
      "fetch_project_list",
      "update_page_type",
      "update_curVersion"
    ]),
    hasAddBtn(auth_type) {
      if (this.isProjectManage) {
        return auth_type == 1;
      } else {
        return false;
      }
    },

    async changeCustomerEx() {
      if (this.form.customer) {
        let { brand_list } = await this.fetch_brand_list({
          customer_id: this.form.customer,
          menu: 3
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
    async changeCustomer() {
      await this.changeCustomerEx();
      await this.refresh();
    },
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
    changePort() {
      this.refresh();
    },
    changeProject() {
      this.refresh();
    },
    changeStatus() {
      this.refresh();
    },
    isCreate(id) {
      return this.firstFold[id];
    },
    onFold({ id, isOpen }) {
      // console.log(id, isOpen )
      if (isOpen) {
        this.firstFold = {};
        this.$set(this.firstFold, id, true);
      }
    },
    async onEditConfirm({ data, _resolve, _reject }) {
      // console.log("父类 onEditConfirm");
      if (data) {
        //检验名称是否合格
        //发送ajax给服务端
        try {
          let data = await this.fetchCore("/project", {}, true);
          _resolve();
        } catch (err) {
          _reject();
        }
      }
    },
    onDelete() {
      // console.log("父类 onDelete");
      // this.$router.push({ path: "/project/create" });
    },
    toCreatProject(id, version, name) {
      this.update_project_id(id);
      this.update_project_name(name);
      this.update_page_type(this.pageType); //ProjectManage  or   ProjectArchive
      this.update_curVersion(version);
      this.$router.push({ name: "ProjectCreate" });
    },
    newProject() {
      if (this.isProjectManage && this.project_create_permission == 1) {
        this.update_customer_id("");
        this.update_customer_name("");
        this.toCreatProject("", "", "");
      } else {
        this.$message({
          type: "info",
          message: this.$t('lang.AS_no_create_project_permission'),
          showClose: true
        });
      }
    },
    onAdd(id) {
      this.update_customer_id(id);
      this.update_customer_name(this.name);
      this.toCreatProject("", "", "");
    },
    setPageType() {
      this.pageType = this.$route.name; //'ProjectArchive' 或者'ProjectManage'
      // console.log('TCL: setPageType -> this.$route.name', this.$route.name)
      this.update_page_type(this.pageType);
    },
    async init() {
      this.$on("delete-project", this.deleteProject);

      this.setPageType();

      //如果是归档项目，status默认为2
      if (!this.isProjectManage) {
        this.form.status = "2";
      }
      this.fetch_check_data_list();
      // "status":"2"
      if (this.is_fromback) {
        this.form.customer = this.customerID;
        this.changeCustomerEx();
      }
      await this.fetch_customers_list();
      await this.fetch_customer_port_list({ menu: 3 });
    },
    //判断是否有数据和客户
    async fetch_check_data_list() {
      let url = "/customers/checklist";
      let data;
      if (this.isProjectManage) {
        data = await this.fetchCore(url, {}, false);
      } else {
        data = await this.fetchCore(url, { status: 2 }, false);
      }
      this.isHasProjectList = data.is_exist_project;
      this.isHasCustomerList = data.is_exist_customer;
    },
    //激活时的初始化
    /* initActivated(){
      // console.log('activated',this.$route.params)
      let params = this.$route.params;
      let project_id = params.project_id
      let customer_id = params.customer_id
      if (!project_id&&!customer_id) {
        this.resetData();
        this.init();
      }else if (project_id&&customer_id) {
        
      }
    }, */
    resetData() {
      this.form = {
        customer: "",
        brand: "",
        product: "",
        port: "",
        project: "",
        status: "",
        dateValue: [],
        keyWords: ""
      };
      this.currentPage = 1;
      this.pageSize = 5;
    },
    refresh() {
      this.currentPage = 1;
      // console.log("refresh fun");
      this.fetch_customers_list();
    },

    formatCustomerTitle(customer) {
      let obj = this.customerList.find(item => {
        return item.id == customer;
      });

      if (obj && obj.name) {
        // return "客户:" + obj.name;
        return `${this.$t('lang.public_client_label')}:` + obj.name;
      } else {
        return "";
      }
    },

    formatBrandTitle(brand) {
      let obj = this.brandList.find(item => {
        return item.id == brand;
      });

      if (obj && obj.name) {
        // return "品牌:" + obj.name;
        return `${this.$t('lang.public_brand_label')}:` + obj.name;
      } else {
        return "";
      }
    },
    formatProductTitle(product) {
      let obj = this.productList.find(item => {
        return item.id == product;
      });

      if (obj && obj.name) {
        // return "产品:" + obj.name;
        return `${this.$t('lang.public_product_label')}:` + obj.name;
      } else {
        return "";
      }
    },
    formatPortTitle(port) {
      let obj = this.portList.find(item => {
        return item.id == port;
      });

      if (obj && obj.name) {
        // return "端口:" + obj.name;
        return `${this.$t('lang.public_port_label')}:` + obj.name;
      } else {
        return "";
      }
    },
    // formatProjectTitle(project) {
    //   let obj = this.projectList.find(item => {
    //     return item.id == project;
    //   });

    //   if (obj && obj.name) {
    //     return "项目:" + obj.name;
    //   } else {
    //     return "";
    //   }
    // },

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
      let url = "/customers/lists";
      let param = {
        customer_id: this.form.customer,
        brand_id: this.form.brand,
        product_id: this.form.product,
        port: this.form.port,
        project_id: this.form.project,
        status: this.form.status,
        page: this.currentPage,
        perpage: this.pageSize,
        start_date,
        end_date,
        name: this.form.keyWords,
        type: "manage"
      };
      let data = await this.fetchCore(url, param, true);
      this.total = data.total - 0;
      if (this.total > 0) {
        //有数据
        if (this.isHasProjectList == 0) {
          this.isHasProjectList = 1;
        }
        if (this.isHasCustomerList == 0) {
          this.isHasCustomerList = 1;
        }
      }
      this.listData = data.list;
      this.setReadWritePermission(data.list);
    },
    setReadWritePermission(arr) {
      let obj = {};
      for (let item of arr) {
        if (item.project && item.project.list) {
          for (let pro of item.project.list) {
            obj[pro.id] = pro.auth_type == 1;
          }
        }
      }
      this.update_readWrite_permission(obj);
    },
    deleteProject(obj) {
      let customer = this.listData.find(item => {
        return item.id == obj.customerId;
      });

      let index = customer.project.list.findIndex(item => {
        return item.id == obj.projectId;
      });

      customer.project.list.splice(index, 1);
    },

    // /**表格行内容信息下载 */
    //     async handRowDownload({ id }) {
    //       // let data = await this.fetchCore("/project/download", { id },true);
    //       let data = {
    //         url: "/static/Uploads/download/20180831/广告主报告_2018-08-23至2018-08-29.xlsx"
    //       };
    //       this.$downloadFile(data.url);
    //     },

    async handRowRemove({ id }) {
      await this.fetchCore("/project/remove", { id }, true);
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
    handleSizeChange(val) {
      this.pageSize = val;
      this.refresh();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.fetch_customers_list();
    },
    handRowEdit({ id }) {
      this.$router.push({ path: "/project/create", query: { id } });
    },
    onCloseDialog() {
      this.isShowDetailDialog = false;
    },
    //跳转新建客户页面
    goCreatCustomer() {
      if (this.customerManage_permission != 0) {
        this.$router.push({
          name: "SystemCustomerManage",
          params: { defaultIndex: "/system/customer" }
        });
      } else {
        this.$message({
          type: "info",
          message: this.$t('lang.AS_no_create_client_permission'),
          showClose: true
        });
      }
    }
  }
};
</script>
<style scoped lang="scss">
@import "../../../assets/css/theme/mixin.scss";

.project-list-wrap {
  // margin: 0 20px;
  .breadcrumb-wrap,
  .project-filter {
    margin: 0 20px;
  }
  .project-list {
    padding: 0 20px;
  }
}
.project-filter {
  /* margin-right: 20px; */
  /* padding-top: 30px; */
  /* padding-left: 20px; */
  width: 1124px;
  /* position: sticky; */
  /* top: -30px; */
}

.project-filter.fixed-top {
  position: fixed;
  top: 46px;
  opacity: 1;
  z-index: 100;
  background-color: #131d29; /*(背景调换)项目列表搜索栏背景*/
  transition: all ease-in-out 0.3s;
}

.project-list {
  /* margin-left: 20px; */
  margin-top: 25px;
  /* margin-right: 20px; */
  /* position: sticky; */
  /* top: 1300px; */
  /* transition: all ease-in-out 2s; */
}
.pagination-wrap {
  padding: 10px 15px;
}

.detail-content {
  margin: 30px;
}

.detail-content .title {
  font-size: 17px;
  margin: 15px 0;
  color: #fff;
  opacity: 0.8;
}

.detail-content .form-item {
  font-size: 14px;
  line-height: 25px;
}

.detail-content .form-item span {
  color: #fff;
  opacity: 0.8;
}

.select-prefix {
  line-height: 28px;
}
.no-auth {
  text-align: center;
  color: #cdd4da;
  font-size: 14px;
  height: 500px;
  line-height: 500px;
}
.no-data-tip {
  text-align: center;
  color: #cdd4da;
  font-size: 14px;
  height: 300px;
  line-height: 300px;
}
.tip-link {
  border-bottom: 1px solid #42a996;
  color: #42a996;
  cursor: pointer;
}
</style>
<style>
.project-filter .el-input--prefix .el-input__inner {
  padding-left: 33px;
}
</style>
