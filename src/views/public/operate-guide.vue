<template>
    <hy-dialog :visible.sync="isVisible"
        custom-class='operate-guide'
        :title="$t('lang.public_operation_manual')"
        :show-close="true"
        @close="onClose"
        :close-on-click-modal="false">
        <steps class="help-step"
            :flex-size="stepLen"
            :active='activePage'
            @click="updateStep" />

        <div class="help-carousel">
            <div class="left-arrow">
                <transition enter-active-class="animated fadeInLeft faster"
                    leave-active-class="animated fadeOutLeft faster">
                    <i class="el-icon-arrow-left"
                        @click="prev"
                        @mouseenter="showArrow"
                        @mouseleave="hideArrow"
                        v-show="isShowArrow"></i>
                </transition>
            </div>
            <div class="help-carousel-content">
                <transition-group mode="out-in"
                    :enter-active-class="enterClass">
                    <div v-for="(item,index) in guideValue"
                        v-if="index==(activePage-1)"
                        style="height:100%;"
                        :key="index"
                        @mouseenter="showArrow"
                        @mouseleave="hideArrow">
                        <div class="guide-img clearfix">
                            <img :src="item.url" />
                        </div>
                        <div class="guide-text">
                            <div class="text-area">
                                <div class="title">{{item.content.title}}</div>
                                <div v-for="(text,index) in item.content.text"
                                    class="item"
                                    :key="index">
                                    <p>{{text}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </transition-group>
            </div>
            <div class="right-arrow">
                <transition enter-active-class="animated fadeInRight faster"
                    leave-active-class="animated fadeOutRight faster">
                    <i class="el-icon-arrow-right"
                        v-show="isShowArrow"
                        @click="next"
                        @mouseenter="showArrow"
                        @mouseleave="hideArrow"></i>
                </transition>
            </div>
        </div>

        <div slot="footer">
            <el-button class="pull-right"
                @click="onClose">{{$t('lang.public_start')}}</el-button>
        </div>
    </hy-dialog>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";
import steps from "@/views/public/steps";

export default {
  name: "operate-guide",
  data() {
    return {
      isVisible: true,
      oldActivePage: 1,
      activePage: 1,
      isShowArrow: false, //是否展示左右得箭头
      isActiveArrow: false, //
      enterClass: "animated fadeInRight faster", //过度效果
      timer: "", //自动轮播定时器

      guideValue: [
        {
          url: require("@/assets/image/guide/guide-one.png"),
          content: {
            title: "创建项目",
            text: [
              "选择主导航【创建项目】或【项目管理】列表中对应客户下的【创建项目】icon，点击后进入项目信息编辑弹框界面； ",
              "填写项目相关内容，包括：项目名称、Campaign周期、所属客户、所属品牌、所属产品、目标人群、端口后，点击保存可创建项目。"
            ]
          }
        },
        {
          url: require("@/assets/image/guide/guide-two.png"),
          content: {
            title: "上传资料",
            text: [
              "根据【创建项目】步骤指示完成原始计算表格上传，包括：Basic Data、Reach Curve、Score Card，如有附加计算需求可在Basic Data基础上添加辅助表Overlapping Data；",
              "表格上传完成后，可在线预览与编辑，直到数据符合需求后提交进入下一步系统计算。"
            ]
          }
        },
        {
          url: require("@/assets/image/guide/guide-three.png"),
          content: {
            title: "分量计算",
            text: [
              "根据STEP2中上传原始表，系统计算出【分量计算表（初始）】内容；",
              "用户可手动调整初始表中‘库存折扣’指数，来重新分配资源；",
              "用户可通过设定媒体‘目标cost%’指数，选择系统计算‘库存折扣’指数，并自动分配资源，产出【分量计算表（调整）】，计算结果最大化接近‘目标cost%’；",
              "注意：系统分量计算可能会出现无解，届时可选择人工调整‘目标cost%’浮动来重新计算；系统计算完毕后，一旦用户后续手动再进行‘库存折扣’调整，系统将以用户调整为准产出【分量表】。"
            ]
          }
        },
        {
          url: require("@/assets/image/guide/guide-four.png"),
          content: {
            title: "排期结果",
            text: [
              "根据STEP3中的计算调整最终分量结果，产出初始【分量表】和结果【分量表】，可查看、下载excel格式的分量数据文档；",
              "用户配置【排期表】分量周期、广告名称，系统产出最终分量结果的【排期表】，可查看、下载excel格式的分量数据文档。"
            ]
          }
        }
      ]
    };
  },
  props: {
    isShow: {
      type: Boolean,
      required: false
    }
  },
  computed: {
    stepLen() {
      return this.guideValue.length;
    }
  },

  watch: {
    isShow: {
      handler: function(val) {
        this.isVisible = this.isShow;
      },
      deep: true
    }
  },

  methods: {
    onClose() {
      this.$emit("update:isShow", false);
    },

    /**改变step-bar */
    updateStep(index) {
      this.oldActivePage = this.activePage;
      this.activePage = index;
      if (this.oldActivePage < this.activePage) {
        this.enterClass = "animated fadeInRight faster";
      } else {
        this.enterClass = "animated fadeInLeft faster";
      }

      this.stopTimer();
    },

    /**下一页 */
    prev() {
      this.enterClass = "animated fadeInLeft faster";
      this.setActivePage(false);

      this.stopTimer();
    },
    /**上一页 */
    next() {
      this.enterClass = "animated fadeInRight faster";
      this.setActivePage();

      this.stopTimer();
    },
    showArrow() {
      this.isShowArrow = true;
      this.isActiveArrow = true;
    },
    hideArrow() {
      this.isActiveArrow = false;
      setTimeout(() => {
        if (!this.isActiveArrow) {
          this.isShowArrow = false;
        }
      }, 500);
    },

    stopTimer() {
      clearInterval(this.timer);
      //3s 秒后如果不操作，会继续自动轮播
      this.timer = setTimeout(() => {
        this.startTimer();
      }, 10000000);
    },
    startTimer() {
      this.timer = setInterval(() => {
        // if (this.activePage == this.guideValue.length - 1) {
        //   // clearInterval(this.timer);
        // } else {
        this.enterClass = "animated fadeInRight faster";
        this.setActivePage();
        // }
      }, 3000);
    },
    //type为真：加  为假：减
    setActivePage(type = true) {
      if (type) {
        this.activePage++;
        if (this.activePage > this.stepLen) {
          this.activePage = 1;
        }
      } else {
        this.activePage--;
        if (this.activePage < 1) {
          this.activePage = this.stepLen;
        }
      }
    }
  },

  mounted() {
    this.startTimer();
  },

  destroyed () {
    clearInterval(this.timer); //组件销毁时清楚定时器
  },

  components: { steps }
};
</script>
<style scoped>
.help-step {
  margin: 60px 50px 30px 50px;
}
/* .help-step .step-bar {
  display: flex;
  flex: 1;
}
.help-step .step-bar:last-child {
  display: flex;
  flex: 0;
}

.help-step .step-bar .step-text {
  display: inline-block;
  width: 25px;
  height: 25px;
  background-color: #c0c4cc;
  border-radius: 50%;
  text-align: center;
  line-height: 25px;
  cursor: pointer;
}
.help-step .step-bar .step-text.active {
  background-color: #42a996;
  color: #fff;
}

.help-step .step-bar .step-line {
  position: relative;
  top: 12px;
  flex: 1;
  height: 1px;
  background-color: #c0c4cc;
} */

.help-carousel {
  display: flex;
  /* height: calc(60vh); */
  height: calc(100% - 115px);
  /* display: none; */
}
.help-carousel .left-arrow {
  width: 80px;
  display: flex;
  flex-direction: column;
  align-self: center;
}
.help-carousel .left-arrow i {
  font-size: 70px;
  cursor: pointer;
}
.help-carousel .right-arrow {
  width: 80px;
  display: flex;
  flex-direction: column;
  align-self: center;
}
.help-carousel .right-arrow i {
  font-size: 70px;
  cursor: pointer;
}

.help-carousel .help-carousel-content {
  flex: 1;
  position: relative;
}

.help-carousel-content .guide-img {
  position: relative;
  top: 50%;
  width: 50%;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  -webkit-transform: translateY(-40%);
  transform: translateY(-50%);
}

.help-carousel-content .guide-img img {
}

.help-carousel-content .guide-text {
  position: absolute;
  top: 50%;
  right: 0;
  width: 50%;
  transform: translate(0px, -50%);
}
.guide-text .text-area {
}
.guide-text .title {
  font-size: 32px;
  color: rgba(66, 169, 150, 1);
}

.guide-text .item {
  position: relative;
  margin: 10px 0;
}
.guide-text .item p {
  font-size: 14px;
  line-height: 18px;
}

.guide-text .item:before {
  position: absolute;
  content: "";
  width: 6px;
  height: 6px;
  background-color: #606266;   /*背景调换，操作指南每行LI前的标识符*/
  top: 5px;
  left: -10px;
}
</style>
<style>
.operate-guide .mis-dialog-body {
  overflow: hidden;
  height: calc(100% - 58px);
  margin-top: 5px;
}
</style>