<template>
  <hy-dialog :visible="true"
      title="Costing Allocation Result"
      custom-class='component-table'
      @close="onClose"
      v-loading='isLoading'
      :close-on-click-modal="false">
    <div class="box"
        style="height: 100%">
      <el-tabs v-model="activeTab"
          class="hy-tab"
          type="card"
          @tab-click="onTabClick">
        <el-tab-pane v-for="n in tabList"
            :label="n=='adjust'? $t('lang.AS_detail_result'):$t('lang.AS_detail_initial_value')"
            :key="n"
            :name="n">
        </el-tab-pane>
      </el-tabs>

      <keep-alive>
        <!-- <page v-for="(i,index) in tabList"
            :key="i"
            :data='index==0?initialData:adjustData' /> -->
        <component :type='activeTab'
            style="height: 100%;"
            :key='activeTab'
            :data='activeTab=="initial"?initialData:adjustData'
            :is="activeComponent"></component>
      </keep-alive>

    </div>

    <div slot="footer">
      <el-button plain
          @click="onGoTo4">{{$t('lang.AS_detail_back_step4')}}</el-button>
      <el-button v-if='showExport'
          @click="onDownload">{{$t('lang.AS_detail_download_excel')}}</el-button>
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
  name: "component-table",
  componentName: "ComponentTable",
  components: { initialCpt, adjustCpt },
  props: {
    isShow: {
      type: [Boolean],
      required: true
    }
  },
  data() {
    return {
      isLoading: false,
      activeTab: "initial",
      tabList: ["initial"],
      initialData: {},
      adjustData: {}
    };
  },
  computed: {
    ...mapState("project", ["projectID","curVersion"]),
    activeComponent() {
      return this.activeTab == "initial" ? "initialCpt" : "adjustCpt";
    },
    showExport() {
      let rs = true;
      if (this.tabList.length == 2) {
        if (this.activeTab == "initial") {
          rs = false;
        }
      }
      return rs;
    }
  },
  watch: {},
  created() {
    this.fetchList();
  },
  methods: {
    ...mapActions("project", ["fetch_preview_data"]),
    onTabClick() {
      // console.log("onTabClick");
    },
    async fetchList() {
      let url = "/projects/allocationlist";
      this.isLoading = true;
      try {
        let version = this.curVersion;
        let res = await fetch.post(url, { project_id: this.projectID,version });

        if (res.data) {
          if (res.data.second) {
            if (this.tabList.length == 1) {
              this.tabList.push("adjust");
            }
            this.activeTab = "adjust";
          } else {
            this.activeTab = "initial";
          }
        }
        this.initialData = res.data.first;
        this.adjustData = res.data.second;
      } catch (err) {
        this.$message.error(err.message);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
    async onDownload() {
      // this.$downloadFile('/api/projects/downloadallocation?project_id='+this.projectID)
      try {
        let project_id = this.projectID;
        let version = this.curVersion;
        this.isLoading = true;
        let res = await fetch.post("/projects/downloadallocation", { project_id,version });
        this.$downloadFile("api/" + res);
        this.onClose();
        return res;
      } catch (err) {
        this.$message.error(err.message);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
    onGoTo4() {
      this.$eventHub.$emit("OPEN-COMPONENT-COMPUTE");
      this.onClose();
    },
    onClose() {
      // this.fetch_preview_data();
      this.$emit("update:isShow", false);
    }
  }
};
</script>
<style scoped>
.box {
  box-sizing: border-box;
}
</style>
<style>
.component-table .hy-tab {
  position: absolute;
  top: 6px;
  left: 186px;
}
</style>