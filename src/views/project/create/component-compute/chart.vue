<template>
  <div>
    <progress-button :status="cmp_compute_status"
        :title="$t('lang.AS_detail_component_compute_title')"
        :pointer-cursor="cmp_compute_status!='disabled'"
        @click.native="clickBlock"
        style="align-self: center;"
        :helpTitle="$t('lang.AS_detail_component_compute_helpTitle')"
        icon="icon-step-icon-fenliangjisuan">
      <div class="right-top-plugin small-ico"
          v-if="cmp_compute_status=='active'"
          :class='cmp_compute_status'
          slot="right-top"
          @click="clickDownload">
        <i class="iconfont icon-list-download"
            :title="$t('lang.public_tooltip_download')"></i>
      </div>
      <!-- 编辑 -->
      <template v-if="enableWriteCreateProject">
        <div class="right-bottom-plugin small-ico"
          v-if="cmp_compute_status!='disabled'"
          :class="cmp_compute_status"
          @click="clickEdit"
          slot="right-bottom">
          <i class="iconfont icon-list-edit"
              :title="$t('lang.public_tooltip_edit')"></i>
        </div>
      </template>
      <template v-else>
        <div class="right-bottom-plugin small-ico"
          v-if="cmp_compute_status!='disabled'"
          :class="cmp_compute_status"
          @click="clickEdit"
          slot="right-bottom">
          <i class="iconfont icon-list-view"
              :title="$t('lang.public_tooltip_show')"></i>
        </div>
      </template>
      
      <!-- <div class="right-bottom-plugin small-ico"
          slot="right-bottom">
        <i class="iconfont mis-export-o"></i>
      </div> -->
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
import dialogBox from "./index";
import example from "./example";
export default {
  name: "component-compute-chart",
  components: { progressButton, dialogBox, example },
  data() {
    return {
      show_dialog: false,
      show_example: false
    };
  },
  watch: {},
  computed: {
    ...mapGetters("permissions", ["enableWriteCreateProject"]),
    ...mapState("project", ["cmp_compute_status",'projectID',"curVersion"])
  },
  created() {
    // this.update_cmp_compute_status('enable')
  },
  mounted() {
    this.$eventHub.$on("OPEN-COMPONENT-COMPUTE", () => {
      this.show_dialog = true;
    });
  },
  methods: {
    ...mapActions("project", ["update_active_step", "update_cmp_compute_status"]),
    async clickDownload() {
      // let url = "/api/basicdata/downloadbasicdata";
      // this.$downloadFile(url + "?project_id=" + this.projectID);
      this.update_active_step(4);
      try {
        let project_id = this.projectID;
        let version = this.curVersion;
        this.isLoading = true;
        let res = await fetch.post("/projects/downloadcpm", { project_id,version });
        this.$downloadFile("api/" + res);
        
        return res;
      } catch (err) {
        this.$message.error(err.message);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
    clickBlock() {
      if (this.cmp_compute_status != "disabled") {
        this.update_active_step(4);
      }
    },
    clickEdit() {
      this.show_dialog = true;
      this.update_active_step(4);
    },
    onHelp() {
      this.show_example = true;
      // this.update_active_step(4)
    }
  }
};
</script>
<style scoped>
</style>
<style>
</style>
