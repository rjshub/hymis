<template>
  <div class="sublist-box" v-loading.fullscreen='isLoading'>
    <template v-for="(item,index) in renderList">
      <sub-list-item 
        @download='onDownload'
        @detail='onDetail'
        @delete='onDelete'
        @edit='onEdit'
        @view='onView'
        @archive='onArchive'
        @active='onActive'
        :visibleBtnList='getVisibleBtnList(item.auth_type)'
        :key="item.id"
        :icon-title="item.brandName"
        :short-title="item.productName"
        :icon-Name="item.iconName"
        :status="item.status"
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
    pageType:{//ProjectManage  or   ProjectArchive
      type: [String],
      required: true
    },
    values: {
      type: [Object],
      required: false
    },
    /* loadAll: {
      type: [Boolean],
      default: false,
      required: false
    }, */
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
    ...mapState("project", ["is_fromback", "projectID"]),
    
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
          "-O" +
          item.project_number;
        let name = item.name;
        let iconUrl = item.logo;
        let iconName = item.sub_name;
        let shortName = item.product_sub_name;
        let device = item.port;
        // let device = '1,2,3,4';
        let time = item.utime;
        let status = item.status;
        let id = item.id;
        let isDraft = item.status == 0;
        let brand_name = item.brand_name;
        let product_name = item.product_name;
        let historyList = item.historylist||[];
        arr.push({
          isDraft,
          id,
          serialIndex,
          name,
          iconUrl,
          shortName,
          iconName,
          device,
          time,
          status,
          historyList,
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
        console.log('values=',n,o)
      },
      // deep: true
    },
  },
  created() {
    // console.log('created')
    if (this.is_fromback) {
      this.loadAllData = true;
      this.highlightProject = this.projectID;
      this.clearFromBack();
    }
  },
  mounted() {},
  updated(){
    this.loadAllData = false;
    this.highlightProject = '';
  },
  methods: {
    ...mapActions("project", [
      "update_is_fromback",
      "update_project_id",
      "update_customer_name",
      "update_project_name",
      "update_customer_id",
      "update_page_type",
      "update_curVersion",
    ]),
    ...mapActions("permissions", ["update_readWrite_permission"]),
    getVisibleBtnList(auth_type){
			// console.log('TCL: getVisibleBtnList -> auth_type', auth_type)
      let btns = [];
      if (this.pageType=='ProjectManage') {
        //more 默认包含delete、archive
        btns = ['detail','download','history'];
        if (auth_type==1) {
          btns.push('edit','more');
        }else{
          btns.push('view');
        }
      }else{
        btns = ['download','history','view'];
        if (auth_type==1) {
          btns.push('active');
        }
        
      }
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
      this.update_project_id("");
      this.update_project_name("");
    },
    onDetail(id) {
      this.isShowDetailDialog = true;
      this.detailData = this.values.list.find(i => i.id == id);

      this.detailData = { ...this.detailData, ...this.customerInfo };
      // console.log("this.detailData", this.detailData);
    },
    async onDownload({id,version}) {
      this.isLoading = true
      let url = "/projects/downloadall";
      if (version!=0) {
        url = "/projects/downloadhistory";
      }
      let res = await fetch.post(url, { project_id: id,version });
      this.isLoading = false;
      this.$downloadFile("api/" + res);
    },
    
    getProjectNameByid(id) {
      let obj = this.values.list.find(i => i.id == id);
      if (obj) {
        return obj.name;
      } else {
        return "";
      }
    },

    toCreatProject({ id, version,name }) {
      // let name = this.getProjectNameByid(id);
      this.update_customer_id(this.customerInfo.customer_id);
      this.update_customer_name(this.customerInfo.customer_name);
      this.update_project_id(id);
      this.update_project_name(name);
      this.update_page_type(this.pageType);//ProjectManage  or   ProjectArchive
      this.update_curVersion(version);
      // this.$router.push({ path: "/project/create", query: { plan: 'private' } });
      this.$router.push({ name: 'ProjectCreate'});
    },

    //obj { id, version,name }
    onEdit(obj) {
      // this.update_readWrite_permission(true)
      this.toCreatProject(obj);
    },
    //obj { id, version,name }
    onView(obj) {
      // this.update_readWrite_permission(false)
      this.toCreatProject(obj);
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
        text = `您确定要删除该项目（${obj.name}）吗?`
      } else if (this.$t("lang.overall_language") === 'english') {
        text = `Are you sure you want to delete this project（${obj.name}）?`
      }
      this.$confirm(text, this.$t('lang.public_dialog_point'), {
        confirmButtonText: this.$t('lang.public_button_confirm'),
        cancelButtonText: this.$t('lang.public_button_cancel'),
        type: "warning"
      })
        .then(async () => {
          await fetch.post("/projects/delete", { id: obj.id });
          this.$dispatch("ProjectManage", "delete-project", {
            customerId: this.customerInfo.customer_id,
            projectId: obj.id
          });
        })
        .catch(() => {
          // console.log("取消");
        });
    },
    onActive(obj){
      this.onArchive(obj, this.$t('lang.public_tooltip_activating'));
    },
    onArchive(obj,msg=this.$t('lang.public_tooltip_archives')) {
      let text = ''
      if (this.$t("lang.overall_language") === 'chinese') {
        text = `您确定要${msg}该项目（${obj.name}）吗?`
      } else if (this.$t("lang.overall_language") === 'english') {
        text = `Are you sure you want to ${msg} this project（${obj.name}）?`
      }

      this.$confirm(text, this.$t('lang.public_dialog_point'), {
        confirmButtonText: this.$t('lang.public_button_confirm'),
        cancelButtonText: this.$t('lang.public_button_cancel'),
        type: "warning"
      })
        .then(async () => {
          await fetch.post("/projects/fileprojects", { project_id: obj.id });
          this.$dispatch("ProjectManage", "delete-project", {
            customerId: this.customerInfo.customer_id,
            projectId: obj.id
          });
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
