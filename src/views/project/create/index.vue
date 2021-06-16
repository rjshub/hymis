<template>
  <div class="box">
    <back />
    <!-- 步骤区 start -->
    <step />
    <!-- 步骤区 end -->

    <!-- main  start-->
    <div class="processing-chart-area">
      <processing-chart />
    </div>
    <!-- main  end-->

    <!-- 预览区 start -->
    <preview />
    <!-- 预览区 end -->

    <!-- 日志区 start-->
    <run-log v-if="projectID" />
    <!-- 日志区 end-->
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";
import processingChart from "./processing-chart";
import runLog from "./run-log";
import preview from "./preview";
import step from "./step";
import back from "./back";

export default {
  name: "create-project",
  componentName: "CreateProject",
  components: {
    processingChart,
    step,
    runLog,
    preview,
    back
  },
  data() {
    return {
      widthArr: [280, 300, 200, 250],
      activeStep: 1
    };
  },
  beforeRouteLeave(to, from, next) {
    this.init();
    next();
  },
  computed: {
    ...mapState("project", ["projectID","is_fromback"])
  },
  watch: {},
  created() {
    this.$on("change-version", async version=>{
      await this.fetch_step_status();
      this.setHasMediaCpm();
      this.fetch_preview_data();
    });
    this.setHasMediaCpm();
  },
  mounted() {
    // this.$eventHub.$on("NAV-CREATE-PROJECT", this.newCreateProject);
    // console.log('mounted--1')
  },
  methods: {
    ...mapActions("permissions", ["setMediaCpmPermission"]),
    ...mapActions("project", [
      "fetch_preview_data",
      "update_project_id",
      "update_project_name",
      "update_customer_id",
      "update_customer_name",
      "reset_all_status",
      "fetch_step_status",
      "curVersion"
    ]),
    async setHasMediaCpm() {
      if (this.projectID) {
        let data = await this.fetchCore("/projects/projectdetail", {
          project_id: this.projectID,
          version:this.curVersion
        });

        this.setMediaCpmPermission(data.product_id);
      } else {
        this.setMediaCpmPermission("");
      }
    },
    init() {
      if (!this.is_fromback) {
        this.update_customer_id("");
        this.update_customer_name("");
        this.update_project_id("");
        this.update_project_name('');
      }
      
      this.reset_all_status();
    },
    //已废弃
    newCreateProject() {
      this.$confirm("是否放弃当前项目的操作？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.init();
          this.$eventHub.$emit("OPEN-BASIC-INFO");
          this.fetch_preview_data();
        })
        .catch(() => {
          // console.log("取消");
        });
    },
    async fetchCore(url, data) {
      // hasLoading && (this.isLoading = true);
      try {
        let _data = await fetch.post(url, data);
        return _data;
      } catch (err) {
        this.$message.error(err.message);
        throw err;
      } finally {
        // hasLoading && (this.isLoading = false);
      }
    }
  }
};
</script>
<style scoped>
/*本地部分*/
.box {
  padding-left: 20px;
  /* padding-top: 24px; */
  box-sizing: border-box;
}

</style>
<style>
/*全局部分*/
</style>