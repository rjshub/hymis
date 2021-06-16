<template>
  <hy-dialog :visible="true"
    v-loading='isLoading'
    title="Costing Allocation Calculator"
    custom-class='component-compute'
    @close="onClose"
    :heightFillBody='true'
    :close-on-click-modal="false">
    <div class="box">
      <el-tabs v-model="activeTab"
        class="hy-tab"
        type="card"
        @edit='onTabEdit'
        @tab-remove='onTabRemove'
        @tab-click="onTabClick">
        <el-tab-pane v-for="(n,index) in tabList"
          :label="n=='adjust'? $t('lang.AS_detail_result'):$t('lang.AS_detail_initial_value')"
          :key="n"
          :closable='enableWriteCreateProject?(index!=0):false'
          :name="n">
        </el-tab-pane>
      </el-tabs>

      <keep-alive :include='includeName'>
        <component :type='activeTab'
          :key='activeTab'
          :is="activeComponent"></component>
      </keep-alive>

    </div>
    <div slot="footer"
      v-if="enableWriteCreateProject"
      v-show="showFooter">
      <!-- <el-button plain
          @click="onClose">取消</el-button> -->
      <el-button :disabled="!isShowSubmit"
        @click="onSubmit">{{$t('lang.public_button_submit')}}</el-button>
    </div>
  </hy-dialog>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";
import initialCpt from "./page";

let adjustCpt = _.cloneDeep(initialCpt);
export default {
  name: "component-compute",
  componentName: "ComponentCompute",
  components: { initialCpt, adjustCpt },
  props: {
    isShow: {
      type: [Boolean],
      required: true
    }
  },
  data() {
    return {
      isShowSubmit: true,
      isLoading: false,
      activeTab: "initial",
      includeName: ["initialCpt"]
      // tabList:['初始','调整'],
    };
  },
  computed: {
    ...mapState("project", ["projectID","curVersion"]),
    ...mapGetters("permissions", ["enableWriteCreateProject"]),
    ...mapState("project/componentCompute", ["tabList"]),
    activeComponent() {
      return this.activeTab == "initial" ? "initialCpt" : "adjustCpt";
    },
    showFooter() {
      if (this.activeTab == "initial" && this.tabList.length == 2) {
        return false;
      } else {
        return true;
      }
    }
  },
  watch: {},
  created() {
    // this.add_tab_list();
    this.$on("LOADING", val => {
      this.isLoading = val;
    });
    this.$on("ADDTAB", this.tabAdd);
    this.$on("CHANGETAB", () => {
      this.activeTab = "adjust";
    });
    this.$on("IS_SHOW_SUBMIT", value => {
      this.isShowSubmit = value;
    });

    this.add_tab_list("initial");
    this.activeTab = "initial";
    this.hasAdjust();
  },
  methods: {
    ...mapActions("project/componentCompute", [
      "pop_tab_list",
      "add_tab_list",
      "clear_tab_list"
    ]),
    ...mapActions("project", [
      "updata_preview_log_step_status",
      "fetch_step_status",
      "fetch_preview_data",
      "fetch_log_info",
      "update_cmp_table_status",
      "update_version_list",
      "update_cmp_compute_status",

    ]),

    //添加tab
    tabAdd() {
      // console.log("ADDTAB");
      this.includeName.push("adjustCpt");
      this.add_tab_list("adjust");
      this.activeTab = "adjust";
    },
    //删除tab
    async onTabRemove() {
      await this.deleteAdj();
      this.includeName.pop();
      this.pop_tab_list("adjust");
      this.activeTab = "initial";
    },
    onTabEdit(targetName, action) {
      // console.log("onTabEdit");
    },
    onTabClick() {
      // console.log("onTabClick");
    },
    //let res = await this.fetchCore(this.listUrl, { project_id: this.projectID });
    async hasAdjust() {
      let url = "/projects/cpmadj";
      let version = this.curVersion;
			console.log('TCL: hasAdjust -> version', version)
      let data = await this.fetchCore(url, { project_id: this.projectID,version });
			console.log('TCL: hasAdjust -> data-length', data.data.data.length)
      
      if (data.data.data.length) {
        //结果表不为空
        this.tabAdd();
      }
    },
    async deleteAdj() {
      let url = "/projects/deleteadj ";
      await this.fetchCore(url, { project_id: this.projectID });
    },
    async onSubmit() {
      let url = "/projects/allocationcompute";
      await this.fetchCore(url, { project_id: this.projectID });
      this.update_cmp_table_status("active");
      this.update_version_list();
      this.fetch_log_info();
      this.$message.error(this.$t('lang.AS_detail_component_compute_new_version'));
      this.onClose();
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
      // this.fetch_preview_data();
      // this.fetch_step_status();
      this.clear_tab_list();
      this.updata_preview_log_step_status();
      this.$emit("update:isShow", false);
    }
  }
};
</script>
<style scoped>
.box {
  box-sizing: border-box;
  height: 100%;
  overflow: auto;
  width: 100%;
}
</style>
<style>
.component-compute .hy-tab {
  position: absolute;
  top: 6px;
  left: 209px;
}
</style>