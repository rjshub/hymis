<template>
  <div v-loading="isLoading">
    <progress-button :status="score_card_status"
        title="Score Card"
        :pointer-cursor="score_card_status!='disabled'"
        @click.native="clickBlock"
        :helpTitle="$t('lang.AS_detail_score_card_helpTitle')"
        @help='onHelp'
        icon="icon-box">
      <!-- 下载 -->
      <div class="right-top-plugin small-ico"
          v-if="score_card_status=='active'"
          :class='score_card_status'
          slot="right-top"
          @click="clickDownload">
        <i class="iconfont icon-list-download" :title="$t('lang.public_tooltip_download')"></i>
      </div>
      <template v-if="enableWriteCreateProject">
        <!-- 编辑 -->
        <div class="right-middle-plugin small-ico"
            v-if="score_card_status=='active'"
            :class='score_card_status'
            @click="clickEdit"
            slot="right-middle">
          <i class="iconfont icon-list-edit" :title="$t('lang.public_tooltip_edit')"></i>
        </div>
        <!-- 上传 -->
        <process-upload-plugin :class='score_card_status'
            :status='score_card_status'
            class="right-bottom-plugin small-ico"
            uploadUrl='/scorecard/importscorecard'
            @upload-success='onUploadSuccess'
            @upload-fail='onUploadFail'
            slot="right-bottom" />
      </template>
      <template v-else>
        <div class="right-bottom-plugin small-ico"
            v-if="score_card_status=='active'"
            :class='score_card_status'
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

    <overlapping v-if="show_overlapping"
        :isShow.sync="show_overlapping" />
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
import overlapping from "./overlapping";
export default {
  name: "score-card-chart",
  components: { overlapping, progressButton, processUploadPlugin, dialogBox, example },
  data() {
    return {
      show_dialog: false,
      show_example: false,
      show_overlapping: false,
      isLoading: false
    };
  },
  watch: {},
  computed: {
    ...mapState("project", ["score_card_status", "projectID","curVersion"]),
    ...mapGetters("permissions", ["enableWriteCreateProject"])
  },
  created() {
    // this.update_score_card_status("enable");
  },
  mounted() {
    this.$eventHub.$on("OPEN-SCORE-CARD", () => {
      this.show_dialog = true;
    });
    this.$eventHub.$on("OPEN-OVER-LAPPING", () => {
      this.show_overlapping = true;
    });
  },
  methods: {
    ...mapActions("project", [
      "updata_preview_log_step_status",
      // "fetch_step_status",
      // "fetch_preview_data",
      // "fetch_log_info",
      "update_active_step",
      "update_score_card_status",
    ]),
    clickBlock(){
      if (this.score_card_status!='disabled') {
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
    async clickDownload() {
      // this.$downloadFile("/api/scorecard/downloadscorecard?project_id=" + this.projectID);
      try {
        let project_id = this.projectID;
        let version = this.curVersion;
        this.isLoading = true;
        let res = await fetch.post("/scorecard/downloadscorecard", { project_id,version });
        this.$downloadFile("api/" + res);
        this.update_active_step(2);
        return res;
      } catch (err) {
        this.$message.error(err.message);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
    onUploadSuccess() {
      // this.update_score_card_status("active");
        this.update_active_step(2);
        // this.fetch_preview_data();
        // this.fetch_log_info();
        this.updata_preview_log_step_status();
    },
    onUploadFail() {
      // this.update_score_card_status("active");
    }
  }
};
</script>
<style scoped>
</style>
<style>
</style>
