<template>
  <div>
    <progress-button :status="basic_info_status"
      :title="$t('lang.AS_detail_project_info_title')"
      :pointer-cursor="basic_info_status!='disabled'"
      @click.native="clickBlock"
      style="align-self: center;"
      :helpTitle="$t('lang.AS_detail_basic_info_helpTitle')"
      icon="icon-step-icon-info">
      <div v-if='enableWriteCreateProject'
        class="right-top-plugin small-ico"
        :class="basic_info_status"
        slot="right-top"
        @click="clickEditProject">
        <i class="iconfont icon-list-edit"
          :title="$t('lang.public_tooltip_edit')"></i>
      </div>
      <div v-else
        class="right-bottom-plugin small-ico"
        :class="basic_info_status"
        slot="right-bottom"
        @click="clickViewProject">
        <i class="iconfont icon-list-view"
          :title="$t('lang.public_tooltip_show')"></i>
      </div>
    </progress-button>

    <dialog-box v-if="show_dialog"
      :isShow.sync="show_dialog" />

    <example v-if="show_example"
      :isShow.sync="show_example" />

    <detail v-if="show_detail"
      :isShow.sync="show_detail" />
  </div>
</template>
<script>
import _ from "lodash";
import { mapState, mapGetters, mapActions } from "vuex";
import fetch from "@/services/fetch";
import progressButton from "../public/progress-button";
import dialogBox from "./index";
import example from "./example";
import detail from "./detail";
export default {
  name: "basic-info-chart",
  components: { progressButton, dialogBox, example, detail },
  data() {
    return {
      show_dialog: false,
      show_example: false,
      show_detail: false
    };
  },
  watch: {},
  computed: {
    ...mapState("project", ["basic_info_status"]),
    ...mapGetters("permissions", ["enableWriteCreateProject"])
  },
  created() {
    // console.log("--created");
  },
  mounted() {
    this.$eventHub.$on("OPEN-BASIC-INFO", () => {
      this.show_dialog = true;
    });

    this.$eventHub.$on("OPEN-BASIC-INFO-DETAIL", () => {
      this.show_detail = true;
    });
  },
  methods: {
    ...mapActions("project", ["update_active_step"]),
    clickBlock() {
      if (this.basic_info_status != "disabled") {
        this.update_active_step(1);
      }
    },
    clickEditProject() {
      this.show_dialog = true;
      this.update_active_step(1);
    },
    clickViewProject() {
      this.show_detail = true;
      this.update_active_step(1);
    },
    onHelp() {
      this.show_example = true;
    }
  }
};
</script>
<style scoped>
</style>
<style>
</style>
