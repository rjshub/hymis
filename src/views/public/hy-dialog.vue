<template>
  <el-dialog :custom-class='hyCustomClass'
    v-if="if_c"
    :width="width"
    :visible="visible_c"
    :close-on-click-modal='closeOnClickModal'
    :close-on-press-escape='closeOnPressEscape'
    :append-to-body='appendToBody'
    :modal-append-to-body='modalAppendToBody'
    :lock-scroll='true'
    @open='_open'
    @close="_close"
    @closed="_closed"
    >
    <div class="mis-dialog-header">
      <div class="mis-dialog-title">
        <span>{{title}}</span>
        <div class="ladder"></div>
      </div>
      <i @click="onClose"
        v-show='showClose'
        class="iconfont icon-close mis-dialog-close"></i>
    </div>
    <div class="mis-dialog-main">
      <div class="mis-dialog-body" :class="autoHeightClass">
        <slot></slot>
      </div>

      <div class="el-dialog__footer mis-dialog-footer">
        <slot name="footer"
          class="dialog-footer"></slot>
      </div>

    </div>

  </el-dialog>
</template>
<script>
export default {
  name: "dialoger",
  data() {
    return {
      isShow: true
    };
  },
  props: {
    heightFillBody: {
      type: Boolean,
      default: false
    },
    lazyLoad: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: ""
    },
    visible: {
      //this.$emit('update:visible', newTitle)
      type: Boolean,
      default: true
    },
    showClose: {
      type: Boolean,
      default: true
    },
    closeOnClickModal: {
      type: Boolean,
      default: false
    },
    appendToBody: {//Dialog 自身是否插入至 body 元素上。嵌套的 Dialog 必须指定该属性并赋值为 true
      type: Boolean,
      default: true,
    },
    modalAppendToBody: {//遮罩层是否插入至 body 元素上，若为 false，则遮罩层会插入至 Dialog 的父元素上
      type: Boolean,
      default: true,
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    customClass: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: "提示"
    }
  },
  computed: {
    autoHeightClass(){
      // console.log(this.$slots.footer)
      // console.log(this.$slots.footer.length)
      if (!this.width) {
        if (this.$slots.footer&&this.$slots.footer.length) {
          return 'auto-height';
        }else{
          if (this.heightFillBody) {
            return 'fill-body';
          }
        }
      }
      
      
    },
    if_c(){
      if (this.lazyLoad) {
        return true;
      }else{
        return this.visible;
      }
    },
    visible_c(){
      if (this.lazyLoad) {
        return this.visible;
      }else{
        return true;
      }
    },
    hyCustomClass() {
      return " mis-el-dialog " + (this.width ? "mis-el-dialog-has-width" : "") + " "+this.customClass;
    }
  },
  created() {
    // console.log(this)
  },
  methods: {
    onClose() {
      this.isShow = false;
      this.$emit("update:visible", false);
      this.$emit("close");
    },
    _close() {
      this.isShow = false;
      this.$emit("update:visible", false);
      this.$emit("close");
    },

    _closed() {
      this.$emit("update:visible", false);
      this.$emit("closed");
    },
    _open() {
      // this.$emit('update:visible', true)
      // this.showdialog = true;
      this.$emit("open");
    }
  }
};
</script>
<style>
.mis-el-dialog {
  height: calc(100% - 80px);
  box-shadow: 0 0 0 transparent;
  min-height: 600px;
  width: calc(1280px - 40px);
  background-color: transparent;    /*背景调换，新建项目各个弹框背景*/
  filter: drop-shadow(2px 2px 10px rgba(255, 255, 255, 0.5));
}
.mis-el-dialog-has-width {
  min-height: initial;
  height: inherit;
}
.auto-height{
  height: calc(100% - 58px);
}
.fill-body{
  height:100%;
}
/* 隐藏原来的header */
.mis-el-dialog .el-dialog__header {
  display: none;
}
.mis-el-dialog .el-dialog__body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
  max-height: inherit;
}
.mis-el-dialog .mis-dialog-header {
  height: 34px;
  line-height: 34px;
  margin-bottom: -3px;
  margin-bottom: 0px;
}
.mis-el-dialog .mis-dialog-main {
  background-color: #141c28;   /*背景调换，新建项目弹框背景*/
  height: calc(100% - 36px);
  border: 1px solid #0a0c10;
}
/* title区 */
.mis-el-dialog .mis-dialog-title {
  min-width: 171px;
  float: left;
  background-color: #141c28;   /*背景调换，新建项目弹框title背景*/
  text-align: center;
  border-left: 1px solid #0a0c10;
  border-top: 1px solid #0a0c10;
  box-sizing: border-box;
  color: #fff;
  position: relative;
  padding: 0 10px 0 15px;
  font-size: 14px;
}
/* 梯形图标 */
.mis-el-dialog .ladder {
  -webkit-transform: rotate(270deg);
  transform: rotate(270deg);
  height: 0;
  width: 30px;
  border-top: 6px solid #141c28;   /*背景调换，新建项目弹框title梯形图标背景*/
  border-right: 6px solid transparent;
  border-left: 0px solid blue;
  border-bottom: 0px solid #9a8d1d;
  position: absolute;
  right: -20px;
  top: 14px;
}
/* 关闭按钮 */
.mis-el-dialog .mis-dialog-close {
  float: right;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
}
.mis-el-dialog .mis-dialog-close:hover {
   color: #42a996;
}
.mis-el-dialog .el-dialog__footer {
  margin: 10px 15px 20px;
  padding: 0px;
}
.mis-el-dialog .el-dialog__footer > * {
  font-size: 0px;
}
.mis-el-dialog .el-dialog__footer .el-button {
  margin: 0 5px;
}

</style>
