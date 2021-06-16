<template>
  <div class="age-ratio">
    <div class='name'>{{$t('lang.MS_media_cover_rank_Age_composition')}}
      <span style="font-size: 14px;
        MS_10K: '万台',
    padding-left: 8px;">({{$t('lang.MS_media_cover_rank_user_total')}}{{$formatNumber(Math.ceil(age_total),0,'')}}{{$t('lang.MS_10K')}})</span>
    </div>
    <div class="box">

      <div class="item" v-for="(item,index) in list" :key='index'>
        <div class="type" :style="set_name_width()">{{item.name}}</div>
        <el-progress :percentage="item.percent"
          color="#179484"
          class="progress"></el-progress>
      </div>

    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "age-ratio",
  props: {
    list: {
      type: [Array]
    },
    age_total:{
      type: [Number,String],
      default: 0
      // required: true
    },
  },
  data() {
    return {
    };
  },
  watch: {},
  computed: {
    ...mapState('user', ['languageInfo']),
    
  },
  created() {},
  mounted() {
    this.init();
  },
  methods: {
    set_name_width() {
      if (this.languageInfo === 'zh') {
        return 'width: 58px'
      } else {
        return 'width: 120px'
      }
    },
    init() {
      this.set_name_width()
    }
  }
};
</script>
<style scoped lang="scss">
$bgcolor: #2c333f;
$marginBottom: 10px;
.age-ratio {
  background-color: $bgcolor;   /*背景调换。媒介策略->媒介推荐->详情->人群年龄占比背景*/
  flex: 1;
  display: flex;
  flex-direction: column;
  // margin-right: 5px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
  margin-left: 5px;
}
.name {
  color: #fff;
  font-size: 16px;
}
.box {
  color: #acadb0;
  font-size: 14px;
  margin-top: 18px;
  .item {
    flex: 1;
    display: flex;
    flex-direction: row;
    overflow: hidden;
    .type{
      width: 58px;
      // width: auto;
      text-align: right;
      line-height: 42px;
    }
    .progress {
      flex: 1;
      margin-left: 14px;
    }
  }
}
</style>
<style lang="scss">
.age-ratio {
.el-progress {
  line-height: 3;
  .el-progress-bar {
    padding-right: 71px;
    margin-right: -75px;

  }
  .el-progress-bar__outer {
    height: 18px !important;
    border-radius: initial;
    background-color: #43485287;  /*背景调换，进度条背景色*/
    .el-progress-bar__inner {
      background-color: #179484;   /*背景调换，进度条颜色*/
      border-radius: initial;
    }
   
  }
   .el-progress__text{
      margin-left: 20px;
      color: #fff;
    }
}
}
</style>
