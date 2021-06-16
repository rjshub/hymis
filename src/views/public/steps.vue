<template>
  <div class="step-box " :class="{ unflex: Array.isArray(width)&&width.length }">
    <div class="step-bar"
      v-for="index in forLen"
      :style="setWidth(index)"
      :key="index">
      <div class="step-text" v-if="disabled.indexOf(index)==-1"
        @click="onClick(index)"
        :class="{active:active==index}">{{index}}</div>
      <div class="step-text" v-else
        style="cursor: no-drop;">{{index}}</div>
      <div class="step-line"></div>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
export default {
  name: "steps",
  components: {},
  props: {
    flexSize: {//flex布局，几步
      validator: function(value) {
        let _value = value - 0;
        return _.isNumber(_value) && _value > 1;
      }
    },
    active:{//当前高亮的step。
      type: [Number,String],
      required: true
    },
    width:{//代表每一步的宽度，如果数组长度是4，则代表有5部，4根线
      type: Array,
      validator: function(value) {
        return value.length > 0;
      }
    },
    disabled:{//当前高亮的step。
      type: Array,
      default: function () {
        return []
      }
    },
  },
  data() {
    return {
      // active: 1
    };
  },
  watch: {

  },
  computed: {
    forLen(){
      if (Array.isArray(this.width)&&this.width.length) {
        return this.width.length+1;
      }else{
        return this.flexSize;
      }
    }
  },
  created() {
  },
  methods: {
    setWidth(index){
      if (Array.isArray(this.width)&&this.width.length&&index<this.width.length+1) {
        let w = this.width[index-1]+"px";
        return "width:"+w;
      }
    },
    onClick(index) {
      this.$emit('update:active', index)
      this.$emit('click',index);
    }
  }
};
</script>
<style scoped>
.step-box{
  flex: 1;
  flex-direction: row;
  display: flex;
}
.unflex{
  display: block;
}
.unflex .step-bar{
  float: left;
}
.step-bar {
  display: flex;
  flex: 1;
}
.step-bar:last-child {
  display: flex;
  flex: 0;
}

.step-bar .step-text {
  display: inline-block;
  width: 25px;
  height: 25px;
  background-color: #c0c4cc;   /*背景调换，新建项目步骤条每个步骤的背景*/
  border-radius: 50%;
  text-align: center;
  line-height: 25px;
  cursor: pointer;
}
.step-bar .step-text.active {
  background-color: #42a996;   /*背景调换，新建项目步骤条当前步骤的背景*/
  color: #fff;
}
.step-bar:last-child .step-text {
  position: absolute;
  /* right: 50px; */
}
.step-bar .step-line {
  position: relative;
  top: 12px;
  flex: 1;
  height: 2px;
  background-color: #c0c4cc;  /*背景调换，新建项目步骤条线的背景*/
}
</style>
