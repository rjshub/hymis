<template>
  <div class="log-area"
    :style="setStyle">
    <div class="title"
      v-show="showContent"
      @click="onOpen">
      <span class="info">{{firstItem[defaultProps['name']]}}</span>
      <i class="ico"></i>
    </div>
    <!-- <el-collapse-transition> -->
    <div class="content" :style="setContentHeight"
      v-show="!showContent"
      @mouseleave='mouseleave'
      @mouseenter='mouseenter'>
      <div class="list-wrap"
        :class="{ 'has-scrollbar': hasScrollBar }">
        <div class="list"
          v-if="list.length">
          <p v-for="(item,index) in list"
            :key='index'
            class="item">
            <span class="info">{{item[defaultProps['name']]}}</span>
          </p>
        </div>
      </div>
      <i class="ico iconfont icon-book-with-bookmark"
        @click="onTakeUp"></i>
    </div>
    <!-- </el-collapse-transition> -->

  </div>
</template>
<script>
import _ from "lodash";

export default {
  name: "LogWin",
  // inheritAttrs:true,
  props: {
    direction: {
      type: [String],
      default: "auto" //bottom 或者 auto
    },
    width: {
      type: [Number, String],
      required: false,
      default: 290
    },
    height: {
      type: [Number, String],
      required: false,
      default: 120
    },
    list: {
      type: Array,
      required: true
    },
    defaultProps: {
      type: Object,
      default: function() {
        return {
          name: "name"
        };
      }
    }
  },
  data() {
    return {
      showContent: true,
      hasScrollBar: false
    };
  },
  watch: {},
  computed: {
    firstItem() {
      if (this.list.length > 0) {
        return this.list[0];
      } else {
        return {};
      }
    },
    setContentHeight(){
       if(this.direction=='auto'){
        let height = this.height+'px';
        return {height}
      }
    },
    setStyle() {
      let width=this.width+'px';
      let flexDirection = this.direction=='bottom'?'column-reverse':'column';
      let styleObj = {width,flexDirection};
      if(this.direction!='auto'){
        let height = this.height+'px';
        styleObj['height'] =height;
      }
      return styleObj
    }
  },
  created() {},
  mounted() {},
  methods: {
    mouseleave() {
      this.hasScrollBar = false;
      // console.log("mouseleave");
    },
    mouseenter() {
      this.hasScrollBar = true;
      // console.log("mouseenter");
    },
    onOpen() {
      this.showContent = false;
    },
    // 点击收起事件
    onTakeUp() {
      this.showContent = true;
    }
  }
};
</script>
<style scoped lang="scss">
.ico {
  width: 16px;
  height: 16px;
  display: inline-block;
  vertical-align: middle;
  // background: url("~@/assets/image/project/step-icon-log.png");
}

.log-area {
  color: #cbced1;
  width: 290px;
  display: flex;
  flex-direction: column-reverse;
  margin-right: 10px;
}
.content {
  // width: 270px;
  height: 100%;
  padding: 15px;
  border-radius: 18px;
  border: 1px solid #1c242e;
  background: #2b323d;    /*背景调换，新建项目右下角流程信息展开背景*/
  position: relative;
  box-sizing: border-box;
  i.ico {
    cursor: pointer;
    position: absolute;
    right: 11px;
    bottom: 7px;
  }
}
.list-wrap {
  height: 100%;
  overflow: hidden;
  &.has-scrollbar {
    overflow: auto;
  }
  .item {
    padding: 2px 0;
  }
}

.title {
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
  cursor: pointer;
  // width: 270px;
  background: #2b323d;    /*背景调换，新建项目右下角流程信息默认收起背景*/
  height: 28px;
  line-height: 28px;
  border: 1px solid #1c242e;
  padding: 0 15px;
  border-radius: 15px;
  position: relative;
  i.ico {
    cursor: pointer;
    position: absolute;
    right: 11px;
    bottom: 7px;
  }
}
::-webkit-scrollbar {
  width: 2px;
}
</style>
<style>
</style>
