<template>
    <div class="sublist-box brand-list"
        v-loading='isLoading'>
        <template v-if="customerManage_permission==1">
          <template v-for="item in list">
            <sub-list-item :key="item.brand_id"
                @add='onAddProduct'
                @edit='onEditBrand'
                @delete='onDeleteBrand'
                class="brand"
                :visibleBtnList="['add','edit','delete']"
                :id='item.id'
                :serialIndex="customerIndex_c+'-'+item.b_id"
                :name="item.brand_name"
                :iconUrl='item.logo'
                :icon-name="item.sub_name"
                :data-extend="item.sub_name"
                :iconTitle='item.brand_name'
                :time='item.utime'
                :add-title="$t('lang.system_client_add_new_product')">
            </sub-list-item>
            <sub-list-item v-for="(subitem, index) in item.productlists"
                class="products"
                @edit='onEditProduct'
                @delete='onDeleteProduct'
                :visibleBtnList="['edit','delete']"
                :key='subitem.id'
                :id='subitem.id'
                :serialIndex="customerIndex_c+'-'+item.b_id+'-'+subitem.r_id"
                :name="subitem.product_name"
                :shortName='subitem.sub_name'
                :shortTitle='subitem.product_name'
                :time='subitem.utime' 
                :className='set_list_class(index)'>
            </sub-list-item>
          </template>
        </template>
        <template v-else>
          <template v-for="item in list">
            <sub-list-item :key="item.brand_id"
                class="brand"
                :id='item.id'
                :serialIndex="customerIndex_c+'-'+item.b_id"
                :name="item.brand_name"
                :iconUrl='item.logo'
                :icon-name="item.sub_name"
                :data-extend="item.sub_name"
                :iconTitle='item.brand_name'
                :time='item.utime'
                :add-title="$t('lang.system_client_add_new_product')">
            </sub-list-item>
            <sub-list-item v-for="(subitem,index) in item.productlists"
                class="products"
                :key='subitem.id'
                :id='subitem.id'
                :serialIndex="customerIndex_c+'-'+item.b_id+'-'+subitem.r_id"
                :name="subitem.product_name"
                :shortName='subitem.sub_name'
                :shortTitle='subitem.product_name'
                :time='subitem.utime' 
                :className='set_list_class(index)'>
            </sub-list-item>
          </template>
        </template>
        <div class="nodata"
            v-if="list.length==0">{{noDataText}}</div>
        <get-more v-if="isShowMore"
            class="brand-more"
            :title="$t('lang.public_load_more')"
            @more='onGetMore' />
        <get-more v-else
            class="brand-more"
            :title="$t('lang.public_fold')"
            :direction='false'
            @more='onTakeUp' />
        <brand-product-create-edit v-if="isShowBrandProductDiag"
            v-bind="editContent"
            :isShow.sync="isShowBrandProductDiag" />

    </div>
</template>
<script>
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";
import { mapState, mapActions } from "vuex";
// import projectDetail from "./detail";
import brandProductCreateEdit from "./brand&product-create-edit";
import subListItem from "@/views/public/list-collapse/sub-list-item";
import getMore from "@/views/public/list-collapse/get-more";
import listClass from '@/views/mixin/project-table'

export default {
  name: "BrandList",
  componentName: "BrandList",
  components: {
    subListItem,
    getMore,
    brandProductCreateEdit
    // projectDetail
  },
  mixins: [listClass],
  // inject: ['parentData'],
  props: {
    customerIndex: {
      //客户编号，
      type: [String, Number],
      required: true
    },
    id: {
      type: [String, Number],
      required: true
    },
    brand: {
      type: [String, Number],
      required: true
    },
    product: {
      type: [String, Number],
      required: true
    },
    dateRange: {
      type: [Array],
      required: true
    },
    /* keyWords: {
      type: [String],
      required: true
    } */
  },
  data() {
    return {
      isShowMore: true,
      editContent: {
        id: "",
        name: "",
        url: "",
        shortName: "",
        type: "", //brand 或者 product
        isNew: false //是否是新建 或者编辑
      },
      keyWords:'',
      noDataText: this.$t('lang.public_empty_list_text'),
      isShowBrandProductDiag: false,
      isLoading: false,
      list: [], //项目列表
      currentPage: 1,
      pageSize: 5,
      total: 0
    };
  },
  watch: {
    brand(n, o) {
      this.fetchBrandList();
    },
    product(n, o) {
      this.fetchBrandList();
    },
    dateRange(n, o) {
      this.fetchBrandList();
    },
  },
  computed: {
    ...mapState("permissions", ["customerManage_permission"]),
    customerIndex_c() {
      let str = this.customerIndex + "";
      if (str.length == 1) {
        return "0" + str;
      } else {
        return str;
      }
    }
  },
  created() {
    this.$eventHub.$on("addBrand", id => {
      if (id == this.id) {
        this.init();
      }
    });

    // 监听来自brand&product-create-edit.vue的事件
    this.$on("refresh", this.init);

    // 监听来自index.vue的事件
    this.$on("onSearch", keyWords=>{
      this.keyWords = keyWords;
      this.fetchBrandList();
    });

    // console.log(this.parentData);
    // console.log('parentData',this.parentData)
    // console.log(this.product)
    // console.log(this.dateRange)
    // console.log(this.keyWords)
  },
  mounted() {
    this.init();
  },
  methods: {
    onAddProduct(id) {
      this.editContent.type = "product";
      this.editContent.isNew = true;
      this.editContent.id = id;

      this.isShowBrandProductDiag = true;
    },

    onDownload() {},
    onEditBrand({ id, name, shortName, iconUrl, dataExtend }) {
      //
      // console.log("onEditBrand");
      this.editContent.id = id;
      this.editContent.name = name;
      this.editContent.url = iconUrl;
      this.editContent.shortName = dataExtend;
      this.editContent.type = "brand";
      this.editContent.isNew = false;

      this.isShowBrandProductDiag = true;
    },
    onEditProduct({ id, name, shortName, iconUrl }) {
      // console.log("onEditProduct");
      this.editContent.id = id;
      this.editContent.name = name;
      this.editContent.shortName = shortName;
      this.editContent.isNew = false;
      this.editContent.type = "product";

      this.isShowBrandProductDiag = true;
    },

    onGetMore() {
      this.isLoading = true;
      this.pageSize = this.pageSize + 5;
      this.fetchBrandList();
    },
    onTakeUp() {
      this.$eventHub.$emit("TAKE-UP-EVENT", this.id);
    },

    init() {
      this.fetchBrandList();
    },
    confirmDiag(msg) {
      return new Promise((resolve, reject) => {
        this.$confirm(msg, this.$t('lang.public_dialog_point'), {
          confirmButtonText: this.$t('lang.public_button_confirm'),
          cancelButtonText: this.$t('lang.public_button_cancel'),
          type: "warning"
        })
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    async onDeleteBrand({ id, name }) {
      try {
        await this.confirmDiag(this.$t('lang.system_client_delete_brand_confirm1') + name + this.$t('lang.system_client_delete_brand_confirm2'));
        try {
          let data = await fetch.post("/brands/delete", { id });
          this.fetchBrandList();
        } catch (err) {
          this.$message.error(err.message);
        } finally {
          this.isLoading = false;
        }
      } catch (err) {}
    },
    async onDeleteProduct({ id, name }) {
      try {
        await this.confirmDiag(this.$t('lang.system_client_delete_product_confirm1') + name + this.$t('lang.system_client_delete_product_confirm2'));
        try {
          let data = await fetch.post("/products/delete", { id });
          this.fetchBrandList();
        } catch (err) {
          this.$message.error(err.message);
        } finally {
          this.isLoading = false;
        }
      } catch (err) {}
    },
    async fetchBrandList() {
      this.noDataText = this.$t('lang.public_loading');
      let parm = {
        customer_id: this.id,
        brand_id: this.brand,
        product_id: this.product,
        start_day: this.dateRange[0],
        end_day: this.dateRange[1],
        name: this.keyWords,
        page: this.currentPage,
        perpage: this.pageSize
      };
      this.isLoading = true;
      try {
        let data = await fetch.post("/brands/brandproductlists", parm);
        this.list = data.list;

        if (data.list.length < Number.parseInt(data.total)) {
          this.isShowMore = true;
        } else {
          this.isShowMore = false;
        }

        if (data.list.length == 0) {
          this.noDataText = this.$t('lang.public_empty_list_text');
        } else {
          this.noDataText = "";
        }
      } catch (err) {
        this.noDataText = this.$t('lang.public_request_fail');
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>
<style scoped>
.nodata {
  height: 48px;
  line-height: 48px;
  background-color: #2c323e;    /*背景调换，系统管理->角色管理*/
  color: #fffeff;
  font-size: 14px;
  text-align: center;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 25px 100%);
}
.brand {
  padding-left: 15px;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 25px 100%);
}
.medium-item.products {
  margin-left: 26px;
  background-color: #2c323e;   /*背景调换，系统管理->角色管理*/
}
.brand-more {
  margin-left: 26px;
}
</style>
<style>
.brand-list .brand-more.more {
  background-color: #2c323e;  /*背景调换，系统管理->角色管理*/
}
</style>
