<template>
  <div>
    <progress-button :status="reach_curve_status"
        title="Reach Curve"
        :pointer-cursor="reach_curve_status!='disabled'"
        @click.native="clickBlock"
        :helpTitle="$t('lang.AS_detail_reach_curve_helpTitle')"
        @help='onHelp'
        :forbidden='goal_cpm_status=="active"'
        icon="icon-box">

      <div class="right-top-plugin small-ico"
          v-if="reach_curve_status=='active'"
          :class='reach_curve_status'
          slot="right-top"
          @click="clickDownload">
        <i class="iconfont icon-list-download" :title="$t('lang.public_tooltip_download')"></i>
      </div>

      <template v-if="enableWriteCreateProject">
        <div class="right-middle-plugin small-ico"
          v-if="reach_curve_status=='active'"
          :class="reach_curve_status"
          @click="clickEdit"
          slot="right-middle">
          <i class="iconfont icon-list-view" :title="$t('lang.public_tooltip_show')"></i>
        </div>
        <process-upload-plugin 
            :class='reach_curve_status'
            :status='reach_curve_status'
            class="right-bottom-plugin small-ico"
            uploadUrl='/reachcurve/importreachcurve'
            @upload-success='onUploadSuccess'
            @upload-fail='onUploadFail'
            slot="right-bottom" />
      </template>
      <template v-else>
        <div class="right-bottom-plugin small-ico"
          v-if="reach_curve_status=='active'"
          :class="reach_curve_status"
          @click="clickEdit"
          slot="right-bottom">
          <i class="iconfont icon-list-view" :title="$t('lang.public_tooltip_show')"></i>
        </div>
      </template>
      
      
    </progress-button>

    <dialog-box v-if="show_dialog"
        :isShow.sync="show_dialog" />

    <example v-if="show_example"
        :isShow.sync="show_example" />
  </div>
</template>
<script>
import _ from "lodash";
import { mapState, mapGetters, mapActions } from "vuex";
import fetch from "@/services/fetch";
import progressButton from "../public/progress-button";
import processUploadPlugin from "../public/process-upload-plugin";
import dialogBox from "./index";
import example from "./example";
export default {
  name: "reach-curve-chart",
  components: { progressButton, processUploadPlugin, dialogBox, example },
  data() {
    return {
      show_dialog: false,
      show_example: false
    };
  },
  watch: {},
  computed: {
    ...mapState("project", ["goal_cpm_status","reach_curve_status",'projectID',"curVersion"]),
    ...mapGetters("permissions", ["enableWriteCreateProject"])
  },
  created() {
    // this.update_reach_curve_status("enable");
  },
  mounted() {
    this.$eventHub.$on("OPEN-REACH-CURVE", () => {
      this.show_dialog = true;
    });
  },
  methods: {
    ...mapActions("project", [
      "updata_preview_log_step_status",
      // "fetch_step_status",
      // "fetch_preview_data",
      // "fetch_log_info",
      "update_active_step",
      "update_reach_curve_status",
    ]),
    async clickDownload() {
      this.update_active_step(2)
      // let url = "/api/basicdata/downloadbasicdata";
      // this.$downloadFile(url + "?project_id=" + this.projectID);
      try {
        let project_id = this.projectID;
        let version = this.curVersion;
        this.isLoading = true;
        let res = await fetch.post("/reachcurve/downloadrc", { project_id,version });
        this.$downloadFile('api/'+res);
        
        return res;
      } catch (err) {
        this.$message.error(err.message);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
    clickBlock(){
      if (this.reach_curve_status!='disabled') {
        this.update_active_step(2);
      }
    },
    clickEdit() {
      this.show_dialog = true;
      this.update_active_step(2);
    },
    onHelp() {
      this.show_example = true;
      // this.update_active_step(2);
    },
    onUploadSuccess(res, file) {
      // this.update_reach_curve_status("active");
      this.update_active_step(2);
      this.updata_preview_log_step_status();
    },
    onUploadFail() {
      // this.update_reach_curve_status("active");
    }
  }
};
</script>
<style scoped>
</style>
<style>
</style>
