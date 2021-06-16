<template>
  <div class="head-fold-area">
    <div class="head">
      <div class="title"
          @click="onToggle">{{title}}
        <transition name="el-zoom-in-center">
          <i class="el-icon-arrow-up"
              v-if="isShow"></i>
          <i class="el-icon-arrow-down"
              v-else></i>
        </transition>
      </div>
      <div class="line"></div>
    </div>
    <transition name="el-zoom-in-top">
      <div class="content-box" v-show="isShow">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>
<script>
import _ from "lodash";

export default {
  name: "head-fold",
  components: {

  },
  props:{
    title: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isShow: true
    };
  },
  watch: {

  },
  computed: {
  },
  created() {
  },
  mounted() {
    // this.fetch_log_info();
  },
  methods: {
    onToggle() {
      this.isShow = !this.isShow;
    }
  }
};
</script>
<style scoped lang='scss'>
@import "../../assets/css/theme/mixin.scss";

.head-fold-area{
  .head {
    position: relative;
    .title {
          /* width: 80px; */
      height: 28px;
      line-height: 28px;
      background: #424852;    /*背景调换，预览区title*/
      text-align: center;
      color: #a6a9ae;
      cursor: pointer;
      display: inline-block;
      padding: 0 7px 0 10px;
      >i {
        // margin-right: -6px;
        // padding-left: 8px;
      }
    }
    .line {
      height: 1px;
      border-top: 1px solid #2b323d;
      background: #424852;    /*背景调换，预览区下边框*/
    }
  }
}


</style>
<style>
</style>
