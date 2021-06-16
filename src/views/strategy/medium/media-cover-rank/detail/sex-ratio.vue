<template>
  <div class="sex-ratio">
    <div class='name'>{{$t('lang.MS_media_cover_rank_Gender_composition')}}
      <span style="font-size: 14px;
    padding-left: 8px;">({{$t('lang.MS_media_cover_rank_user_total')+$formatNumber(Math.ceil(gender_total),0,'')+$t('lang.MS_10K')}})</span>
    </div>
    <div class="img-box">
      <div class="item">
        <img src="~@/assets/image/man.png"
          alt="">
        <div class='sex'>{{$t('lang.public_male')}}</div>
        <!-- <div class='device-num'>{{$formatNumber(male.value,4,'')}}<span>(万台)</span></div> -->
        <div>{{male.percent}}</div>
      </div>
      <div class="item">
        <img src="~@/assets/image/woman.png"
          alt="">
        <div class="sex" style="color:#D95135">{{$t('lang.public_female')}}</div>
        <!-- <div class="device-num">{{$formatNumber(female.value,4,'')}}<span>(万台)</span></div> -->
        <div>{{female.percent}}</div>
      </div>
      <!-- <div class="item">
        <img src="~@/assets/image/unknown.png"
          alt="">
        <div class="sex unknown" style="color:#A9A9A9" >未知</div>
        <div class="device-num">{{$formatNumber(unknown.value,4,'')}}<span>(万台)</span></div>
        <div>{{unknown.percent}}</div>
      </div> -->
    </div>
  </div>
</template>
<script>
export default {
  name: "sex-ratio",
  props: {
    gender_total:{
      type: [Number,String],
      default: 0
      // required: true
    },
    male: {
      type: [Object],
      default: function () {
        return {
          "value": 0,
          "percent": "10%"
        }
      }
      // required: true
    },
    female: {
      type: [Object],
      default: function () {
        return {
          "value": 0,
          "percent": "10%"
        }
      }
      // required: true
    },
    unknown: {
      type: [Object],
      default: function () {
        return {
          "value": 0,
          "percent": "10%"
        }
      }
      // required: true
    }
  },
  data() {
    return {};
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
.sex-ratio {
  background-color: $bgcolor;  /*背景调换，媒介策略->媒介推荐->详情->人群性别占比背景*/
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-right: 5px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
}
.name {
  color: #fff;
  font-size: 16px;
}
.img-box {
  color: #fff;
  font-size: 16px;
  flex: 1;
  display: flex;
  .item {
    text-align: center;
    flex: 1;
    margin-top: 30px;
    .sex {
      color: #179484;
      margin-top: 2px;
      margin-bottom: 26px;
    }
    .device-num {
      margin-bottom: 12px;
    }
  }
}
/* .title {
  height: 110px;
  background-color: $bgcolor;
  margin-bottom: $marginBottom;
  padding-left: 20px;
  

  .num-box {
    font-size: 16px;
    padding-top: 14px;
  }
  .num {
    color: #fff;
    font-size: 34px;
  }

  .unit {
    color: #fff;
    padding-left: 6px;
    padding-right: 6px;
  }
  .range {
    color: #42A996;
    i{
      vertical-align: text-bottom;
    }
    &.is-up{
      color: #ff4343;
    }
  }
} */
</style>
<style>
</style>
