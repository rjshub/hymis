<template>
  <div class="sublist-box" v-loading.fullscreen='isLoading'>
    <template v-for="(item,index) in renderList">
      <sub-list-item 
        @download='onDownload'
        @detail='onDetail'
        @delete='onDelete'
        @edit='onEdit($event, item.brandId)'
        :visibleBtnList='getVisibleBtnList()'
        :key="item.id"
        :icon-title="item.brandName"
        :short-title="item.productName"
        :icon-Name="item.iconName"
        :status="item.status"
        :device="item.device"
        :highlight='highlightProject==item.id'
        :className="set_list_class(index)"
        v-bind="item">
      </sub-list-item>

    </template>

    <div class="nodata"
      v-if="renderList.length==0">{{$t('lang.public_empty_list_text')}}</div>
    <get-more v-if="isShowMore"
      :title="$t('lang.public_load_more')"
      @more='onGetMore' />
    <get-more v-else
      :title="$t('lang.public_fold')"
      :direction='false'
      @more='onTakeUp' />

    <projectDetail v-if='isShowDetailDialog'
      :values="detailData"
      :isShow.sync="isShowDetailDialog" />
  </div>
</template>
<script>
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";
import { mapState, mapActions } from "vuex";
import projectDetail from "./detail";
import subListItem from "@/views/public/list-collapse/sub-list-item";
import getMore from "@/views/public/list-collapse/get-more";
import listClass from '@/views/mixin/project-table'

export default {
  name: "ProjectList",
  components: {
    subListItem,
    getMore,
    projectDetail
  },
  mixins: [listClass],
  inject: ["parentData"],
  props: {
    values: {
      type: [Object],
      required: false
    },
    params: {
      type: [Object],
      required: false
    },
    customerInfo: {
      type: [Object],
      required: false
    }
  },
  data() {
    return {
      isShowDetailDialog: false,
      detailData: [],
      isLoading: false,
      currentPage: 1,
      pageSize: 5,
      loadAllData: false,
      highlightProject: ""
    };
  },

  computed: {
    ...mapState("budget", ["is_fromback", "budgetID", "customerID","selectValue"]),
    
    paginationList() {
      if (this.loadAllData) {
        return this.values.list;
      } else {
        return this.values.list.slice(0, this.pageSize);
      }
    },
    isShowMore() {
      if (this.loadAllData) {
        return false;
      } else {
        return this.pageSize < this.values.total;
      }
    },
    renderList() {
      let arr = [];
      for (const item of this.paginationList) {
        let serialIndex =
          this.customerIndexAddZero(item.customer_number) +
          "-" +
          item.brand_number +
          "-" +
          item.product_number +
          "-D" +
          item.project_number;
        let name = item.project_name;
        let iconUrl = item.logo;
        let iconName = item.sub_name;
        let shortName = item.product_sub_name;
        let device = item.port;
        // let device = '1,2,3,4';
        let time = item.utime || '--';
        let status = 1;
        let id = item.id;
        let isDraft = false;
        let brand_name = item.brand_name;
        let brandId = item.brand_id
        let product_name = item.product_name;
        // let historyList = item.historylist||[];
        arr.push({
          isDraft,
          id,
          serialIndex,
          name,
          iconUrl,
          shortName,
          status,
          iconName,
          device,
          time,
          brandId,
          // historyList,
          brandName: brand_name,
          productName: product_name,
          auth_type: item.auth_type
        });
      }
      // console.log("arr", arr);
      return arr;
    }
  },
  watch: {
    values: {
      handler: function (n,o) {
        // console.log('values=',n,o)
      },
      // deep: true
    },
  },
  created() {
    // console.log('created')
    if (this.is_fromback) {
      this.loadAllData = true;
      this.highlightProject = this.budgetID;
      this.clearFromBack();
    }
  },
  mounted() {},
  updated(){
    this.loadAllData = false;
    this.highlightProject = '';
  },
  methods: {
    ...mapActions("budget", [
      "update_is_fromback",
      "update_budget_name",
      "update_budget_id",
      "update_customer_name",
      "update_customer_id",
      "update_handle_type",
      "update_select_value"
    ]),
    ...mapActions("permissions", ["update_readWrite_permission"]),
    getVisibleBtnList(auth_type){
      let btns = ['detail','edit','download','delete'];
      return btns;
    },
    customerIndexAddZero(index) {
      var index = index - 0;
      return index > 9 ? index : "0" + index;
    },
    clearFromBack() {
      this.update_is_fromback(false);
      this.update_customer_id("");
      this.update_customer_name("");
      this.update_budget_id("");
      this.update_budget_name("");
    },
    onDetail(id) {
      this.isShowDetailDialog = true;
      this.detailData = this.values.list.find(i => i.id == id);
      this.detailData = { ...this.detailData, ...this.customerInfo };
      if (this.detailData.ta_item) {
        this.detailData.ta_item = JSON.parse(this.detailData.ta_item)
      }
      // console.log("this.detailData", this.detailData);
    },
    async onDownload({id,version}) {
      // this.isLoading = true
      let url = "/algorithm/download";
      let res = await fetch.post(url, { id: id }, true);
      // this.isLoading = false;
      this.$downloadFile("api/" + res);
    },

    toCreatProject({ id, version,name }) {
      // let name = this.getProjectNameByid(id);
      this.update_customer_id(this.customerInfo.customer_id);
      this.update_customer_name(this.customerInfo.customer_name);
      this.update_budget_id(id);
      this.update_budget_name(name);
      // this.$router.push({ path: "/project/create", query: { plan: 'private' } });
    },

    //obj { id, version,name }
    onEdit(obj, id) {
      // this.update_readWrite_permission(true)
      this.get_select_list(id)
      this.toCreatProject(obj);
      this.update_handle_type('edit')
      
    },
    async get_select_list(brand = '') {
      const url = '/projects/selectlists'
      const param = {
        customer_id: this.customerInfo.customer_id,
        brand_id: brand
      }
      const data = await this.fetchCore(url, param, false)
      if (data) {
        this.update_select_value(data)
        this.$router.replace("/budget/create");
      }
    },
    onTakeUp() {
      this.$eventHub.$emit("TAKE-UP-EVENT", this.customerInfo.customer_id);
    },
    onGetMore() {
      this.pageSize = this.pageSize + 5;
    },
    onDelete(obj) {
      let text = ''
      if (this.$t("lang.overall_language") === 'chinese') {
        text = `您确定要删除该预算分配（${obj.name}）吗?`
      } else if (this.$t("lang.overall_language") === 'english') {
        text = `Are you sure you want to delete this budget allocation（${obj.name}）?`
      }
      this.$confirm(text, this.$t('lang.public_dialog_point'), {
        confirmButtonText: this.$t('lang.public_button_confirm'),
        cancelButtonText: this.$t('lang.public_button_cancel'),
        type: "warning"
      })
        .then(async () => {
          const data = await fetch.post("/algorithm/delete", { id: obj.id });
          if (data) {
            this.$emit('delete_success')
          }
        })
        .catch(() => {
          // console.log("取消");
        });
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
<style scoped>
.nodata {
  height: 48px;
  line-height: 48px;
  background-color: #2c323e;    /*(背景调换)*/
  color: #fffeff;
  font-size: 14px;
  text-align: center;
}
.sort-item {
  /* transition: all 0.5s; */
}
</style>
<style>
</style>
