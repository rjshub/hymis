<template>
  <div v-loading="isLoading">
    <progress-button :status="basic_data_status"
        title="Basic Data"
        :pointer-cursor="basic_data_status!='disabled'"
        @click.native="clickBlock"
        :helpTitle="$t('lang.AS_detail_basic_data_helpTitle')"
        @help='onHelp'
        icon="icon-box">
      <div class="right-top-plugin small-ico"
          v-if="showEditDownload"
          :class='basic_data_status'
          slot="right-top"
          @click="clickDownload">
        <i class="iconfont icon-list-download" :title="$t('lang.public_tooltip_download')"></i>
      </div>

      <div class="right-middle-plugin small-ico"
          v-if="enableWriteCreateProject&&showEditDownload"
          :class='basic_data_status'
          slot="right-middle"
          @click="clickEditBasicData">
        <i class="iconfont icon-list-edit" :title="$t('lang.public_tooltip_edit')"></i>
      </div>

      <div class="right-bottom-plugin small-ico"
          v-if="enableWriteCreateProject"
          :class='basic_data_status'
          slot="right-bottom"
          @click="clickUpload">
        <i class="iconfont icon-export" :title="$t('lang.public_upload')"></i>
      </div>

      <div v-else
        class="right-bottom-plugin small-ico"
        :class="basic_data_status"
        slot="right-bottom"
        @click="clickEditBasicData">
        <i class="iconfont icon-list-view"
          :title="$t('lang.public_tooltip_show')"></i>
      </div>
      <!-- <process-upload-plugin :class='basic_data_status'
          :status='basic_data_status'
          class="right-bottom-plugin small-ico"
          uploadUrl='/basicdata/importbasicdata'
          @upload-success='onUploadSuccess'
          @upload-fail='onUploadFail'
          slot="right-bottom" /> -->
    </progress-button>

    <dialog-box v-if="show_dialog"
        :isShow.sync="show_dialog" />

    <example v-if="show_example"
        :isShow.sync="show_example" />

    <upload v-if="show_upload"
        :isShow.sync="show_upload" />
  </div>
</template>
<script>
import _ from "lodash";
import { mapState, mapGetters, mapActions } from "vuex";
import fetch from "@/services/fetch";
import progressButton from "../public/progress-button";
import processUploadPlugin from "../public/process-upload-plugin";
import dialogBox from "./index";
import upload from "./upload";
import example from "./example";
export default {
  name: "basic-data-chart",
  componentName: "BasicDataChart",
  components: { progressButton, processUploadPlugin, dialogBox, example,upload },
  data() {
    return {
      show_dialog: false,
      show_example: false,
      show_upload: false,
      isLoading:false,
      showEditDownload:false,
    };
  },
  watch: {
    basic_data_status(n,o){
      if (n=='disabled') {
        this.showEditDownload = false
      }
    },
  },
  computed: {
    ...mapGetters("permissions", ["enableWriteCreateProject"]),
    ...mapState("project", ["basic_data_status", "projectID","curVersion"])
  },
  created() {
    this.getFileName();
    this.$on("updateCharIco", this.getFileName);
  },
  mounted() {
    
    this.$eventHub.$on("OPEN-BASIC-DATA", () => {
      this.show_dialog = true;
    });
  },
  methods: {

    ...mapActions("project", [
      "updata_preview_log_step_status",
      "update_active_step",
      "update_basic_data_status",
    ]),
    clickUpload(){
      if (this.basic_data_status!='disabled') {
        this.show_upload= true
      }
    },
    clickBlock(){
      if (this.basic_data_status!='disabled') {
        this.update_active_step(2);
      }
    },
    clickEditBasicData() {
      this.show_dialog = true;
      this.update_active_step(2)
    },
    async clickDownload() {
      // let url = "/api/basicdata/downloadbasicdata";
      // this.$downloadFile(url + "?project_id=" + this.projectID);
      try {
        let project_id = this.projectID;
        this.isLoading = true;
        let version= this.curVersion;
        let res = await fetch.post("/basicdata/downloadbasicdata", { project_id,version });
        this.$downloadFile('api/'+res);
        this.update_active_step(2)
        return res;
      } catch (err) {
        this.$message.error(err.message);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
    async getFileName() {
      if (this.projectID) {
        let param = {
          project_id: this.projectID
        };
        let data = await this.fetchCore("/basicdata/getfilename", param);
        
        if (data.bd_name||data.tc_name||data.rg_name) {
          this.showEditDownload = true;
        }
      }
    },
    onHelp() {
      this.show_example = true;
      // this.update_active_step(2)
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
    onUploadSuccess(res, file) {
      this.update_active_step(2)
      this.updata_preview_log_step_status();
      // this.update_basic_data_status("active");
      
    },
    onUploadFail() {
      // this.update_basic_data_status('active')
    }
  }
};
</script>
<style scoped>
</style>
<style>
</style>
