<template>
  <steps class="step-area clearfix"
      :flex-size="5"
      :width=widthArr
      :disabled='disabled_c'
      @update:active="onUpdate"
      :active='activeStep' />
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";
import _ from "lodash";
import steps from "@/views/public/steps";
import fetch from "@/services/fetch";

export default {
  name: "project-step",
  components: {
    steps
  },
  data() {
    return {
      widthArr: [280, 290, 200, 230]
      // activeStep: 1
    };
  },
  watch: {},
  computed: {
    ...mapState("project", [
      "activeStep",
      "basic_info_status",
      "basic_data_status",
      "score_card_status",
      "reach_curve_status",
      "computing_status",
      "cmp_compute_status",
      "cmp_table_status",
      "schedule_table_status"
    ]),
    disabled_c() {
      if (this.basic_data_status == "disabled" && this.score_card_status == "disabled") {
        return [2, 3, 4, 5];
      }
      if (this.computing_status == "disabled") {
        return [3, 4, 5];
      }
      if (this.cmp_compute_status == "disabled") {
        return [4, 5];
      }
      if (this.cmp_table_status == "disabled" && this.schedule_table_status == "disabled") {
        return [5];
      }
      return [];
    }
  },
  created() {},
  mounted() {
    // this.fetch_log_info();
  },
  methods: {
    ...mapActions("project", ["update_active_step"]),
    onUpdate(val) {
      this.update_active_step(val);
    },
    onOpen() {
      // this.showLog = false;
    },
    // 点击收起事件
    onTakeUp() {
      // this.showLog = true;
    },
    async init(url, data, hasLoading = false) {},
    async fetchCore(url, data, hasLoading = false) {
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
    }
  }
};
</script>
<style scoped>
.step-area {
  background: #0d1115;  
  border-radius: 15px;
  padding: 3px 40px;
  margin-right: 20px;
}
</style>
<style>
</style>
