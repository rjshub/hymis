<template>
  <div v-loading="isLoading">
    <div class="progress-area">
      <!-- 第一步 项目基本信息 start -->
      <div class="step-one">
        <basic-info-chart />
        <div class="line-1 line"
            :class="basic_info_status"></div>
        <div class="line-2-box">
          <div class="line-2-1 line"
              :class="basic_info_status"></div>
          <div class="line-2-2 line"
              :class="basic_info_status"></div>
        </div>

      </div>
      <!-- 第一步 项目基本信息 end -->
      <!-- 第二步  start -->
      <div class="step-two">
        <div>
          <div style="display: flex;align-items: center;">
            <basic-data-chart />
            <div class="line-4 line"
                :class="basic_data_status"></div>
            <reach-curve-chart />
          </div>
          <div style="height:27px;"></div>
          <div style="display: flex;align-items: center;">
            <div class="line-5-1 line"
                :class="basic_info_status"></div>
            <score-card-chart />
            <div class="line-5-2 line"
                :class="score_card_status"></div>
          </div>
        </div>
        <div class="line-6-box">
          <div class="line-6-1 line"
              :class="reach_curve_status"></div>
          <div class="line-6-2 line"
              :class="score_card_status"></div>
        </div>
      </div>
      <!-- 第二步  end -->
      <!-- 第三步  start -->
      <div class="step-three">
        <div class="line-7 line"
            :class="line7class"></div>

        <computing />
        <div class="line-8 line"
            :class="computing_status"></div>
      </div>
      <!-- 第三步  end -->
      <!-- 第四步 分量计算 start -->
      <div class="step-four">
        <component-compute-chart />
        <div class="line-9 line"
            :class="cmp_compute_status"></div>
        <div class="line-10-box">
          <div class="line-10-1 line"
              :class="cmp_compute_status"></div>
          <div class="line-10-2 line"
              :class="cmp_compute_status"></div>
        </div>
      </div>
      <!-- 第四步 分量计算 end -->
      <!-- 第五步  start -->
      <div class="step-five">
        <div>
          <component-table-chart />
          <div style="height:30px;"></div>
          <schedule-table-chart />
        </div>
      </div>
      <!-- 第五步 end -->
    </div>

    <!-- dialog -->
    <div>

      <!-- score-card -->
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import fetch from "@/services/fetch";

import progressButton from "./public/progress-button";
// import processUploadPlugin from "./public/process-upload-plugin";

import basicInfoChart from "./basic-info/chart";
import basicDataChart from "./basic-data/chart";
import reachCurveChart from "./reach-curve/chart";
import scoreCardChart from "./score-card/chart";
import scheduleTableChart from "./schedule-table/chart";
import computing from "./computing";
import componentComputeChart from "./component-compute/chart";
import componentTableChart from "./component-table/chart";

export default {
  name: "processing-chart",
  components: {
    progressButton,
    // processUploadPlugin,
    basicInfoChart,
    basicDataChart,
    reachCurveChart,
    scoreCardChart,
    scheduleTableChart,
    componentComputeChart,
    computing,
    componentTableChart
  },
  props: {},
  data() {
    return {
      isLoading: false
    };
  },
  computed: {
    ...mapState("project", [
      "basic_info_status",
      "basic_data_status",
      "score_card_status",
      "reach_curve_status",
      "computing_status",
      "cmp_compute_status",
      "cmp_table_status",
      "schedule_table_status",
      "projectID",
      "customerID"
    ]),
    line7class() {
      if (this.score_card_status == "active" && this.reach_curve_status == "active") {
        return "active";
      } else {
        return "disabled";
      }
    }
  },
  watch: {},
  created() {
    // console.log('created--2')
  },
  mounted() {
    this.autoOpenDialog();
    // console.log('mounted--2')
  },
  methods: {
    ...mapActions("project", [
      "fetch_step_status",
      "update_basic_info_status",
      "update_basic_data_status",
      "update_score_card_status",
      "update_reach_curve_status",
      "update_computing_status",
      "update_cmp_compute_status",
      "update_cmp_table_status",
      "update_schedule_table_status"
    ]),
    async autoOpenDialog() {
      if (this.projectID == "" && this.customerID == "") {
        //点击导航按钮过来
        this.$eventHub.$emit("OPEN-BASIC-INFO");
      } else if (this.projectID == "" && this.customerID) {
        //项目列表的新建按钮过来
        this.$eventHub.$emit("OPEN-BASIC-INFO");
      } else if (this.projectID && this.customerID) {
        //项目列表的编辑按钮过来
        // this.$eventHub.$emit();
        this.fetch_step_status();
      }
    },
    handleCreateSuccess(obj) {}
  }
};
</script>
<style scoped>

.progress-area {
  width: 90%;
  /* height: 450px; */
  height: 348px;
  display: flex;
  flex-direction: row;
  position: relative;
}
/*one*/
.progress-area .step-one {
  position: relative;
  display: flex;
  align-self: center;
}
/*two*/
.progress-area .step-two {
  display: flex;
  align-self: center;
  text-align: center;
  position: relative;
}
/*three*/
.progress-area .step-three {
  display: flex;
  align-self: center;
  text-align: center;
  position: relative;
}
/**four*/
.progress-area .step-four {
  position: relative;
  display: flex;
  align-self: center;
}
.progress-area .step-five {
  display: flex;
  align-self: center;
  text-align: center;
  position: relative;
}
.line {
  display: inline-block;
  align-self: center;
  border-color: #fff;
  border-style: solid;
  border-width: 0px;
  box-sizing: border-box;
}
.line.active,
.line.complete {
  border-color: #42a996;
}

.line.disabled,
.line.enable {
  border-color: #fff;
  opacity: 0.4;
}
.line-1 {
  height: 1px;
  width: 40px;
  border-bottom-width: 1px;
}
.line-10-box {
  font-size: 0;
  width: 32px;
  overflow: hidden;
}
.line-2-box {
  font-size: 0;
  width: 28px;
  overflow: hidden;
}
.line-2-1 {
  height: 65px;
  width: 100%;
  -ms-flex-item-align: center;
  border-left-width: 1px;
  border-top-width: 1px;
}
.line-2-2 {
  height: 65px;
  width: 100%;
  -ms-flex-item-align: center;
  border-left-width: 1px;
  /* border-bottom-width: 1px; */
}
.line-3 {
  height: 130px;
  width: 15px;
  border-top-width: 1px;
  border-bottom-width: 1px;
  -ms-flex-item-align: center;
}
.line-4 {
  width: 50px;
  height: 1px;
  border-bottom-width: 1px;
}

.line-5-1 {
  width: 112px;
  height: 1px;
  margin-left: -28px;
  border-bottom-width: 1px;
}
.line-5-2 {
  width: 136px;
  height: 1px;
  margin-right: -50px;
  border-bottom-width: 1px;
}
.line-6-box {
  width: 50px;
  font-size: 0;
}
.line-6-1 {
  height: 66px;
  width: 100%;
  border-top-width: 1px;
  /* border-bottom-width: 1px; */
  border-right-width: 1px;
  -ms-flex-item-align: center;
  margin-top: 49px;
}
.line-6-2 {
  height: 67px;
  width: 100%;
  /* border-top-width: 1px; */
  /* border-bottom-width: 1px; */
  border-right-width: 1px;
  -ms-flex-item-align: center;
}
.line-7 {
  width: 32px;
  height: 1px;
  border-bottom-width: 1px;
}

.line-8 {
  width: 32px;
  height: 1px;
  border-bottom-width: 1px;
}
.line-9 {
  height: 1px;
  width: 40px;
  border-bottom-width: 1px;
}

.line-10-1 {
  height: 65px;
  width: 100%;
  border-left-width: 1px;
  border-top-width: 1px;
  -ms-flex-item-align: center;
}
.line-10-2 {
  height: 65px;
  width: 100%;
  border-left-width: 1px;
  border-bottom-width: 1px;
  -ms-flex-item-align: center;
}
</style>
