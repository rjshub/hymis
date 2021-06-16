<template>
  <div class="region-rank">
    <div class="box">
      <div class="item" v-for="(item,index) in list" :key="index">
        <div class="type">{{index+1}}.{{item.name}}</div>
        <el-progress :percentage="item.percent"
          color="#179484"
          class="progress"></el-progress>
        <!-- <div class="device">{{$formatNumber(item.value,4,'')}}<span>万台</span></div> -->
      </div>

    </div>
  </div>
</template>
<script>
export default {
  name: "region-rank",
  props: {
    list: {
      type: [Array]
    }
  },
  data() {
    return {
      
    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {
    // this.init();
  },
  methods: {}
};
</script>
<style scoped lang="scss">
$bgcolor: #2c333f;
$marginBottom: 10px;
.region-rank {
  background-color: $bgcolor;   /*背景调换，媒介策略->媒介推荐->详情->地图右侧背景*/
  flex: 1;
  display: flex;
  flex-direction: column;
  // margin-right: 5px;
  padding-left: 0px;
  padding-right: 0px;
  padding-top: 20px;
  margin-left: 0px;
}
.name {
  color: #fff;
  font-size: 16px;
}
.box {
  color: #acadb0;
  font-size: 14px;
  margin-top: 18px;
  margin-right: 22px;
  .item {
    flex: 1;
    display: flex;
    flex-direction: row;
    overflow: hidden;
    .type {
      text-align: left;
      width: 62px;
    }
    .device {
      width: 148px;
      // margin-right: 12px;
    }
    .type,
    .device {
      line-height: 42px;
    }
    .progress {
      flex: 1;
      margin-left: 6px;
    }
  }
}
</style>
<style lang="scss">
.region-rank {
  .el-progress {
    line-height: 3;
    .el-progress-bar {
      padding-right: 66px;
      margin-right: -74px;
    }
    .el-progress-bar__outer {
      height: 18px !important;
      border-radius: initial;
      background-color: #43485287;     /*背景调换，媒介策略->媒介推荐->详情->地图右侧进度条背景*/
      .el-progress-bar__inner {
        background-color: #179484;   /*背景调换，媒介策略->媒介推荐->详情->地图右侧进度条背景*/
        border-radius: initial;
      }
    }
    .el-progress__text {
      margin-left: 20px;
      color: #fff;
    }
  }
}
</style>
