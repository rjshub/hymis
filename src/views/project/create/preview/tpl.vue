<template>
  <div class="item"
      @mouseleave='mouseleave'
      @mouseenter='mouseenter'>
    <div class="head clearfix">
      <div class="title-text">{{title}}</div>
      <div class="triangle-box">
        <div class="triangle"></div>
        <span class="slant-line"></span>
      </div>
    </div>
    <div class="body"
        :style="{ width: width}">
      <slot></slot>
      <i class="el-icon-search ico" @click="onClick" v-show="hasSearch&&showSearch" :title="$t('lang.public_tooltip_detail')"></i>
    </div>
  </div>
</template>
<script>
import _ from "lodash";

export default {
  name: "preview-tpl",
  props: {
    title: {
      type: [String],
      required: true
    },
    hasSearch: {
      type: [Boolean],
      default: true
    },
    width: {
      type: [String],
      default: "362px"
    }
  },
  data() {
    return {
      showSearch: false
    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {
    // this.fetch_log_info();
  },
  methods: {
    onClick(){
      this.$emit('click-event');
    },
    mouseleave() {
      this.showSearch = false;
      // console.log("mouseleave");
    },
    mouseenter() {
      this.showSearch = true;
      // console.log("mouseenter");
    },
    onOpen() {
      this.showLog = false;
    },
    // 点击收起事件
    onTakeUp() {
      this.showLog = true;
    }
  }
};
</script>
<style scoped>
.ico {
  color: #8c8f92;
  cursor: pointer;
  background: #343434;  /*(背景调换)新建项目预览区域表格搜索*/
  padding: 8px;
  position: absolute;
  right: 1px;
  bottom: 1px;
  font-size: 23px;
}
.item {
  position: relative;
  margin-top: 38px;
  margin-right: 20px;
}
.head {
  position: absolute;
  top: -20px;
}
.body {
  width: 362px;
  height: 215px;
  border: 1px solid #8c8f92;
  overflow: hidden;
  background: #4A4A4A;  /*(背景调换)新建项目预览区域表格背景*/
}
.triangle-box {
  position: relative;
  float: left;
}
.title-text {
  color: #8c8f92;
  background: #1c1c1c;  /*(背景调换)新建项目预览区域表格铭牌*/
  float: left;
  padding: 3px 11px;
  border-left: 1px solid #8c8f92;
  border-top: 1px solid #8c8f92;
}
.triangle {
  width: 0px;
  height: 0px;
  transform: rotate(270deg);
  border-color: transparent #1c1c1c;  /*(背景调换)新建项目预览区域表格铭牌*/
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
  background: #8c8f92;  /*(背景调换)新建项目预览区域表格铭牌边框*/
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
