<template>
    <div class="mis-progress"
        :class="class_c">
        <!-- 方形盒子 start -->
        <div class="progress-button"
            :class="status">
            <!-- 按钮中间的图片和文字 start -->
            <div class="progress-icon">
                <img :src="iconUrl" v-if="iconUrl"/> <!-- 按钮中间的图片 -->
                <i :class="`iconfont ${icon}`"></i>
                <div class="title">{{title}}</div>
                <!-- 按钮中间的文字 -->
            </div>
            <!-- 按钮中间的图片和文字 end -->

            <!-- 帮助按钮 start -->
            <div class="progress-help"
                @click.stop="onHelp">
                <el-tooltip :content="helpTitle" popper-class="help-button-tooltip"
                    placement="top" :effect="tooltip_effect">
                    <!-- <img style="width: 100%;cursor: pointer;"
                        src="~@/assets/image/help.png" /> -->
                        <i class="iconfont icon-help"></i>
                </el-tooltip>
            </div>
            <!-- 帮助按钮 end -->

            <!-- 禁用蒙层 start -->
            <div class="forbidden" v-if="forbidden"></div>
            <!-- 禁用蒙层 end -->
        </div>
        <!-- 方形盒子 end -->

        <!-- 右上角按钮插槽 -->
        <slot name="right-top"></slot>
        <slot name="right-middle"></slot>

        <!-- 右下角按钮插槽 -->
        <slot name="right-bottom"></slot>

        <label v-if='uploadUrl'>
            <div class="right-bottom-plugin">
                <i class="iconfont icon-export"></i>
            </div>
            <input type="file"
                class="upload-input"
                @change="changeFile"
                name="file"
                ref="uploadRef" />
        </label>

        <!-- 上传进度条 -->
        <el-progress class="upload-progress"
            v-if="uploadProgress.status=='uploading'"
            :text-inside="true"
            :stroke-width="13"
            :percentage="uploadProgress.percent"
            :status="uploadProgress.result"></el-progress>
        <!-- 文件上传按钮 -->
        <!-- <div v-show="true">

      <div style="font-size:12px;color:#606266;">只能上传txt文件</div>
    </div> -->
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";
import $ from "jquery";
import theme from '@/views/mixin/theme/index.vue'

export default {
  name: "progress-button",
  componentName: "progressButton",
  components: {
    //子组件
  },
  mixins: [theme],
  data() {
    return {
      iconUrl: "", //矩形框中间的图标url
      buttonStyle: {},

      nomalUrl: "",
      selectUrl: "",

      labelId: "",
      file: [],
      uploadProgress: {
        percent: 0,
        status: "",
        result: ""
      }
    };
  },
  props: {
    forbidden:{
      type: [Boolean],
      default: false,
      required: false,
    },
    helpTitle: {
      type: String,
      default: "帮助"
    },
    uploadUrl: {
      type: String
    },
    icon: {
      //矩形框中间的图片名称 对应本地文件的名称
      type: String,
      required: false
    },
    status: {
      type: [Boolean, Number, String],
      required: false
    },
    title: {
      //矩形框中间的文字名称
      type: String
    },
    pointerCursor: {
      type: [Boolean],
      required: false,
      default: false
    }
  },
  computed: {
    class_c() {
      let classStr = this.status;
      if (this.pointerCursor) {
        classStr = classStr + " pointer-cursor";
      }
      return classStr;
    }
  },
  watch: {
    activeStatus: {
      handler: function(val) {
        this.handleUpdateStatus();
      },
      deep: true
    }
  },

  created() {
    this.labelId = +new Date();
    this.$on("item-upload", this.uploadFile);
  },

  mounted() {
    // this.iconUrl = require(`@/assets/image/project/step-${this.icon}.png`);
    // this.handleUpdateStatus();
  },

  methods: {
    changeFile(e) {
      this.file = e.target.files[0];
      //开始上传
      let formData = new FormData();
      formData.append("file", this.file);

      this.uploadProgress.result = "";
      fetch
        .post(this.uploadUrl, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: this.onFormatUploadPercent
        })
        .then(res => {
          // console.log("res", res);
          this.$refs.uploadRef.value = null; //可以重复上传同一张图片

          //上传成功后，隐藏进度条
          this.uploadProgress.percent = 100;
          this.uploadProgress.result = "success";
          setTimeout(() => {
            this.uploadProgress.status = "loaded";
            this.$emit("upload-success", res.data);
          }, 1000);
        })
        .catch(err => {
          this.uploadProgress.result = "exception";
          setTimeout(() => {
            this.uploadProgress.status = "loaded";
          }, 1000);
          console.error("err", err);
        });
    },
    onFormatUploadPercent(evt) {
      // console.log("onFormatUploadPercent=", evt);
      this.uploadProgress.status = "uploading";
      let percent = this.$formatNumber((evt.loaded / evt.total) * 100, 2, "");
      this.uploadProgress.percent = Number.parseFloat(percent);
    },
    onHelp() {
      this.$emit("help");
    },
    handleUpdateStatus() {
      if (this.activeStatus == 0) {
        this.iconUrl = this.nomalUrl;
        /* this.buttonStyle = {
          disabled: true,
          enable: false,
          active: false
        }; */
        //设置禁用
        for (let item of this.$children) {
          item.disabled = true;
        }
      } else if (this.activeStatus == 1) {
        this.iconUrl = this.nomalUrl;
        /* this.buttonStyle = {
          disabled: false,
          enable: true,
          active: false
        }; */

        for (let item of this.$children) {
          item.disabled = false;
        }
      } else {
        this.iconUrl = this.selectUrl;
        /* this.buttonStyle = {
          disabled: false,
          enable: false,
          active: true
        }; */

        for (let item of this.$children) {
          item.disabled = false;
        }
      }
    }
  }
};
</script>
<style scoped>
.forbidden{
  background-image: url("~@/assets/image/project/forbidden.png");
  width: 120px;
  height: 100px;
  position: absolute;
  left: -1px;
  top: -1px;
  cursor: not-allowed;
}
.pointer-cursor {
  cursor: pointer;
}
.mis-progress {
  position: relative;
  width: 120px;
  height: 100px;
  display: inline-block;
}
.mis-progress .progress-button {
  position: relative;
  width: 120px;
  height: 100px;
  border: 1px solid #fff;
  background-color: #202835;  /*(背景调换)新建项目步骤中每个方块背景*/
  z-index: 5;
  box-sizing: border-box;
  opacity: 0.4;
}
.mis-progress .progress-button.disabled {
  opacity: 0.4;
}
.mis-progress .progress-button.enable,
.mis-progress .progress-button.active {
  opacity: 0.8;
}
/* .mis-progress.disabled .progress-button {
  background-color: #202835;
  border: 1px solid #585f69;
}

.mis-progress.enable .progress-button {
  background-color: #202835;
  border: 1px solid #bbbbbb;
}

 */
.mis-progress .progress-button.active {
  background-color: #1d383f;   /*(背景调换)新建项目步骤中每个已完成方块背景*/
  border: 1px solid #42a996;
}

.mis-progress .progress-icon {
  position: absolute;
  width: 50px;
  height: 40px;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-repeat: round;
}

.mis-progress .progress-icon img {
  width: 100%;
}

.mis-progress.disabled .progress-icon img {
}

.mis-progress .progress-icon .title {
  width: 120px;
  position: absolute;
  left: -35px;
  text-align: center;
  color: #fff;
  bottom: -25px;
}

/* .mis-progress.disabled .progress-icon .title {
  color: #585f69;
}
.mis-progress.enable .progress-icon .title {
  color: #bbbbbb;
}
.mis-progress.active .progress-icon .title {
  color: #42a996;
} */

.mis-progress .progress-help {
  display: inline-block;
  width: 18px;
  position: absolute;
  right: 4px;
  top: 4px;
}

.mis-progress .small-ico {
  position: absolute;
  display: inline-block;
  width: 30px;
  height: 30px;
  right: -30px;
  background-color: #424953;  /*(背景调换)新建项目步骤中每个方块操作按钮背景*/

  color: #fff;
  opacity: 0.4;
  z-index: 1;
}
.mis-progress .small-ico.active,
.mis-progress .small-ico.enable {
  opacity: 0.8;
  cursor: pointer;
}
.mis-progress .small-ico i {
  font-size: 20px;
  padding: 4px;
  display: inline-block;
}
.mis-progress .right-top-plugin.small-ico {
  top: 0;
}
.mis-progress .right-bottom-plugin.small-ico {
  bottom: 0;
}
.mis-progress .right-middle-plugin.small-ico {
  top: 35px;
}
</style>
<style>
.upload-progress {
  text-align: left;
}

.upload-progress .el-progress-bar {
  width: 95%;
}

.upload-progress .el-progress__text {
  color: #c1c1c1;
}

.help-button-tooltip{
  max-width:350px;
}
</style>

