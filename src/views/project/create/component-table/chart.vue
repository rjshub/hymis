<template>
  <div style="display: flex;align-items: center;" v-loading="isLoading">
    <progress-button :status="cmp_table_status"
        :title="$t('lang.AS_detail_component_table_title')"
        :pointer-cursor="cmp_table_status!='disabled'"
        @click.native="clickBlock"
        :helpTitle="$t('lang.AS_detail_component_table_helpTitle')"
        icon="icon-step-icon-fenliangbiao">
      <div class="right-top-plugin small-ico"
          v-if="cmp_table_status=='active'"
          :class='cmp_table_status'
          slot="right-top"
          @click="clickDownload">
        <i class="iconfont icon-list-download" :title="$t('lang.public_tooltip_download')"></i>
      </div>
      <div class="right-bottom-plugin small-ico"
          :class='cmp_table_status'
          v-if="cmp_table_status=='active'"
          @click="clickView"
          slot="right-bottom">
        <i class="iconfont icon-list-view" :title="$t('lang.public_tooltip_show')"></i>
      </div>
      <!-- <div class="right-bottom-plugin"
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
  name: "component-table-chart",
  components: { progressButton, dialogBox, example },
  data() {
    return {
      show_dialog: false,
      show_example: false,
      isLoading:false,
    };
  },
  watch: {},
  computed: {
    ...mapState("project", ["cmp_table_status","projectID","curVersion"])
  },
  created() {},
  mounted() {
    this.$eventHub.$on("OPEN-COMPONENT-TABLE", () => {
      this.show_dialog = true;
    });
  },
  methods: {
    ...mapActions("project", ["update_active_step"]),
    clickBlock(){
      if (this.cmp_table_status!='disabled') {
        this.update_active_step(5);
      }
    },
    clickView() {
      this.show_dialog = true;
      this.update_active_step(5)
    },
    async clickDownload(){
      this.update_active_step(5)
      // this.$downloadFile('/api/projects/downloadallocation?project_id='+this.projectID)
      try {
        let project_id = this.projectID;
        let version = this.curVersion;
        this.isLoading = true;
        let res = await fetch.post("/projects/downloadallocation", { project_id,version });
        this.$downloadFile('api/'+res);
        return res;
      } catch (err) {
        this.$message.error(err.message);
        throw err;
      } finally {
        this.isLoading = false;
      }
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
