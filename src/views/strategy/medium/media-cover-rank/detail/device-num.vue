<template>
<div class="title">
      <div class='name'>{{$t('lang.MS_uv_no_unit')}}</div>
      <div class='num-box'>
        <span class='num'>{{$formatNumber(Math.ceil(count),0,'')}}</span>
        <span class='unit'>{{$t('lang.MS_10K')}}</span>
        <span class='range' :class="{'is-up':isUp}" v-if="showRange">
          <!-- {{range}} -->
          <i v-if='isUp' class="icon-arrow-up"></i>
          <i v-else class="icon-arrow-fall"></i>
        </span>
      </div>
    </div>
</template>
<script>

export default {
  name: "device-num",
  props:{
    count: {
      type: [Number, String]
      // required: false
    },
    /* isUp:{
      type: [Boolean]
    }, */
    range: {
      // type: [Number, String]
      // required: false
    },
  },
  data() {
    return {
      
    };
  },
  watch: {},
  computed: {
    showRange(){
      return !!this.range&&(this.range!='0%')
    },
    isUp(){
      return this.range.indexOf('-')==-1
    },
  },
  created() {},
  mounted() {
    // this.init();
  },
  methods: {

  }
};
</script>
<style scoped lang="scss">
$bgcolor: #2c333f;
$marginBottom: 10px;
.title {
  height: 110px;
  background-color: $bgcolor;   
  margin-bottom: $marginBottom;
  padding-left: 20px;
  .name {
    font-size: 16px;
    padding-top: 20px;
  }
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
}
</style>
<style>

</style>
