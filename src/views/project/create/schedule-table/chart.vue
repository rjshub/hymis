<template>
  <div style="display: flex;align-items: center;"
    v-loading="isLoading">
    <progress-button :status="schedule_table_status"
      :title="$t('lang.AS_detail_schedule_table_title')"
      :pointer-cursor="schedule_table_status!='disabled'"
      @click.native="clickBlock"
      :helpTitle="$t('lang.AS_detail_schedule_table_helpTitle')"
      icon="icon-step-icon-paiqi">
      <!-- 下载 -->
      <div class="right-top-plugin small-ico"
        v-if="schedule_table_status=='active'"
        :class='schedule_table_status'
        slot="right-top"
        @click="clickDownload">
        <i class="iconfont icon-list-download"
          :title="$t('lang.public_tooltip_download')"></i>
      </div>
      <!-- 眼睛 -->
      <div class="right-bottom-plugin small-ico"
        :class='schedule_table_status'
        v-if="!enableWriteCreateProject"
        @click="clickView"
        slot="right-bottom">
        <i class="iconfont icon-list-view"
          :title="$t('lang.public_tooltip_show')"></i>
      </div>
      <!-- 编辑 -->
      <div class="right-bottom-plugin small-ico"
        v-if="enableWriteCreateProject&&(schedule_table_status!='disabled')"
        :class="schedule_table_status"
        @click="clickEdit"
        slot="right-bottom">
        <i class="iconfont icon-list-edit"
          :title="$t('lang.public_tooltip_edit')"></i>
      </div>
    </progress-button>

    <dialog-box v-if="show_dialog"
      :isShow.sync="show_dialog" />

    <edit-dialog-box v-if="show_edit_dialog"
      :isShow.sync="show_edit_dialog" />

    <example v-if="show_example"
      :isShow.sync="show_example" />
  </div>
</template>
<script>
import _ from "lodash";
import { mapState, mapGetters, mapActions } from "vuex";
import fetch from "@/services/fetch";
import progressButton from "../public/progress-button";
import dialogBox from "./index";
// import editDialogBox from "./edit";
import editDialogBox from "./edit.1";
import example from "./example";
export default {
  name: "schedule-table-chart",
  componentName: "scheduleTableChart",
  components: { progressButton, dialogBox, editDialogBox, example },
  data() {
    return {
      show_dialog: false,
      show_edit_dialog: false,
      show_example: false,
      isLoading: false
    };
  },
  watch: {},
  computed: {
    ...mapState("project", [
      "schedule_table_status",
      "projectID",
      "curVersion"
    ]),
    ...mapGetters("permissions", ["enableWriteCreateProject"])
  },
  created() {
    // this.update_schedule_table_status('enable');
  },
  mounted() {
    this.$eventHub.$on("OPEN-SCHEDULE-TABLE", () => {
      this.show_dialog = true;
    });

    this.$on("schedule-table-open-set-dialog", ()=> {
      this.show_dialog = false;
      this.$nextTick( () =>{
        this.show_edit_dialog = true;
      })
    });

    //type: close cancel  confirm
    this.$on("schedule-set-dialog", type => {
      let flag = false;
      if (type != "close") {
        if (this.schedule_table_status == "active") {
          flag = true;
        } else {
          if (type == "confirm") {
            flag = true;
          }
        }
        if (flag) {
          this.show_edit_dialog = false;
          this.$nextTick( () =>{
            this.show_dialog = true;
          })
        }
      }
    });
  },
  methods: {
    ...mapActions("project", [
      "update_active_step",
      "update_schedule_table_status"
    ]),
    clickEdit() {
      if (this.schedule_table_status == "active") {
        this.show_dialog = true;
      }else{
        this.show_edit_dialog = true;
      }
      
      this.update_active_step(5);
    },
    clickBlock() {
      if (this.schedule_table_status != "disabled") {
        this.update_active_step(5);
      }
    },
    async clickDownload() {
      this.update_active_step(5);
      try {
        let project_id = this.projectID;
        let version = this.curVersion;
        this.isLoading = true;
        let res = await fetch.post("/scheduling/downloadschedule", {
          project_id,
          version
        });
        this.$downloadFile("api/" + res);
        return res;
      } catch (err) {
        this.$message.error(err.message);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
    clickView() {
      this.update_active_step(5);
      this.show_dialog = true;
    },
    onHelp() {
      // this.update_active_step(5)
      this.show_example = true;
    }
  }
};
</script>
<style scoped>
</style>
<style>
</style>
