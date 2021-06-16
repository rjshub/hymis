<template>
  <div class="preview-area"
      v-if="preview_data">
    <div class="preview-head">
      <div class="title"
          @click="handleShowOrClose">{{$t('lang.public_preview')}}
        <transition name="el-zoom-in-center">
          <i class="el-icon-arrow-up"
              v-if="isShowPreview"></i>
          <i class="el-icon-arrow-down"
              v-else></i>
        </transition>
      </div>
      <div class="line"></div>
    </div>
    <transition name="el-zoom-in-top">
      <div class="preview"
          v-if="isShowPreview">
        <basic-info :data='preview_data.Detail'
            v-if="activeStep==1&&preview_data.Detail" />
        <basic-data :data='preview_data.BD'
            v-if="activeStep==2&&preview_data.BD.length" />
        <reach-goal :data='preview_data.RG'
            v-if="activeStep==2&&preview_data.RG.length" />
        <goal-cpm :data='preview_data.TC'
            v-if="activeStep==2&&preview_data.TC.length" />
        <reach-curve :data='preview_data.RC'
            v-if="activeStep==2&&preview_data.RC" />
        <score-card :data='preview_data.SC'
            v-if="activeStep==2&&preview_data.SC.length" />
        <over-lapping :data='preview_data.OL'
            v-if="activeStep==2&&preview_data.OL.length" />
        <component-compute :data='preview_data.CpmC'
            v-if="activeStep==4&&preview_data.CpmC.length" />
        <component-table :data='preview_data.CpmR'
            v-if="activeStep==5&&preview_data.CpmR.length" />
        <schedule-table :data='preview_data.SCHE'
            v-if="activeStep==5&&preview_data.SCHE" />
      </div>
    </transition>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";
import _ from "lodash";
import fetch from "@/services/fetch";
import basicInfo from "./basic-info";
import basicData from "./basic-data";
import scoreCard from "./score-card";
import reachCurve from "./reach-curve";
import overLapping from "./over-lapping";
import componentCompute from "./component-compute";
import componentTable from "./component-table";
import scheduleTable from "./schedule-table";
import reachGoal from "./reach-goal";
import goalCpm from "./goal-cpm";

export default {
  name: "preview",
  components: {
    basicInfo,
    overLapping,
    basicData,
    reachCurve,
    scoreCard,
    componentCompute,
    componentTable,
    reachGoal,
    goalCpm,
    scheduleTable
  },
  data() {
    return {
      isLoading: false,
      isShowPreview: true
    };
  },
  watch: {
    activeStep(n, o) {
      this.fetch_preview_data();
    },

    preview_data: {
      handler: function(val) {
        this.isShowPreview = true;
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapState("project", ["activeStep", "projectID", "preview_data"])
  },
  created() {
    this.fetch_preview_data();
  },
  mounted() {
    // this.fetch_log_info();
  },
  methods: {
    ...mapActions("project", ["fetch_preview_data"]),
    handleShowOrClose() {
      this.isShowPreview = !this.isShowPreview;
    }
  }
};
</script>
<style scoped>
.preview-area .preview-head {
  position: relative;
}
.preview-head .line {
  height: 1px;
  border-top: 1px solid #2b323d;
  background: #424852;    /*（背景调换）*/
}
.preview-head .title {
  width: 80px;
  height: 28px;
  line-height: 28px;
  background: #424852;    /*（背景调换）*/
  text-align: center;
  color: #a6a9ae;
  cursor: pointer;
}
.preview-head .title > i {
  margin-right: -6px;
  padding-left: 8px;
}
.preview {
  display: flex;
  overflow-x: auto;
  padding-bottom: 6px;
}
::-webkit-scrollbar {
  height: 4px;
}
.preview .item {
  position: relative;
  /* background: darkcyan; */
  /* margin: 4px; */
  margin-top: 38px;
}
.head {
  position: absolute;
  top: -20px;
}
.body {
  width: 362px;
  height: 215px;
  border: 1px solid #8c8f92;
}
.triangle-box {
  position: relative;
  float: left;
}
.title-text {
  color: #8c8f92;
  background: #1c1c1c;    /*（背景调换）*/
  float: left;
  padding: 2px 11px;
  border-left: 1px solid #8c8f92;
  border-top: 1px solid #8c8f92;
}
.triangle {
  width: 0px;
  height: 0px;
  transform: rotate(270deg);
  border-color: transparent #1c1c1c;
  border-width: 0px 0px 14px 22px;
  border-style: solid;
  position: absolute;
  left: -4px;
  top: 3px;
}
.slant-line {
  position: absolute;
  top: 10px;
  left: -6px;
  background: #8c8f92;    /*（背景调换）*/
  /* background: red; */
  height: 1px;
  width: 25px;
  -webkit-transform: rotate(416deg);
  transform: rotate(418deg);
  display: inline-block;
}
</style>
<style>
</style>
