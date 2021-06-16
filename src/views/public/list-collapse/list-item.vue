<template>
  <div class="list-collapse">
    <!-- 绿色区域 客户名称一行 start-->
    <div class="list-bar">
      <div class="list-bar-background"
        :class="{active:isOpen}">

        <!-- 左侧数字标号 -->
        <div class="large-serial-num"
          :data-index="serialIndex_c"></div>

        <!-- 中间部分 -->
        <div class="main-area">

          <span class="name"
            v-show="!showEditInput_c">{{name}}</span>

          <div class="input-box"
            v-show='showEditInput_c'>
            <el-input size="mini"
              style="width:200px"
              @focus="focusNewInput"
              v-model="old_name"
              :placeholder="$t('lang.public_input_client_placeholder')">
            </el-input>
            <el-select v-model="old_industry"
              style="width:200px;"
              size="mini"
              filterable
              clearable
              :placeholder="$t('lang.public_industry_placeholder')">
              <el-option v-for="item in industryList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
          </el-select>
            <template v-if="!isOpen">
              <el-button class="hy-button-small-padding"
                icon="el-icon-check"
                @click="onInputConfirm"></el-button>
              <el-button plain
                @click="onInputCancle"
                class="hy-button-small-padding"
                icon="el-icon-close"></el-button>
            </template>
            <template v-else>
              <el-button class="hy-button-small-padding hy-transparent"
                icon="el-icon-check"
                @click="onInputConfirm"></el-button>
              <el-button plain
                @click="onInputCancle"
                class="hy-button-small-padding hy-transparent"
                icon="el-icon-close"></el-button>
            </template>
          </div>

          <div v-if="updateTime"
            class="customer-time">{{updateTime}}</div>

          <span class="operate"
            v-show="!isNew_c">
            <!-- 编辑按钮 -->
            <i class="iconfont icon-list-edit"
              :title="$t('lang.public_tooltip_edit')"
              v-if="showEditBtn"
              style="font-size: 26px;"
              @click="onEdit"></i>

            <slot name="ico"></slot>

            <!-- 添加按钮 -->
            <i class="iconfont icon-list-Add"
              :title="addTitle"
              v-if="showAddBtn"
              @click="onAdd">
            </i>

            <!-- 删除按钮 -->
            <i class="iconfont icon-trash"
              :title="$t('lang.public_tooltip_delete')"
              v-if="showDeleteBtn"
              @click="onDelete">
            </i>

            <!-- 向下 -->
            <i class="iconfont icon-list-down"
              :title="$t('lang.public_unfold')"
              v-show="!isOpen"
              @click="onFold"></i>
            <!-- 向上 -->
            <i class="iconfont icon-list-up"
              :title="$t('lang.public_fold')"
              v-show="isOpen"
              @click="onFold"></i>

          </span>
        </div>
        <!-- 最右侧的缺角 -->
        <div class="bevel-angle"></div>

      </div>
    </div>
    <!-- 绿色区域 客户名称一行 end-->

    <!-- 内容区 start -->
    <!-- <transition mode="out-in" name="el-zoom-in-top"> -->

    <el-collapse-transition>
      <div class="list-content"
        v-if="isOpen">
        <slot name="sublist">
        </slot>
      </div>
    </el-collapse-transition>
    <!-- </transition> -->

  </div>
</template>

<script>
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";

export default {
  name: "list-item",
  data() {
    return {
      old_name: "",
      old_industry: "",//旧的行业
      showEditInput: false, //是否显示编辑输入框
      showEditBtn: false,
      showAddBtn: false,
      showDeleteBtn: false,
      isOpen: false, //是否是展开状态  true是展开
      isLoadingMore: false,
      isShow2: false,
      tableValues2: []
    };
  },

  props: {
    updateTime: {
      type: [String],
      required: false
    },
    accordion: {
      //是否为手风琴，即每次之展开一个
      type: Boolean,
      default: true
    },
    addTitle: {
      type: String
    },
    serialIndex: {
      //序号
      type: String,
      required: true
    },
    id: {
      type: [String, Number],
      required: true
    },
    name: {
      type: String,
      required: true
    },
    defaultOpen: {
      type: [Number, String],
      required: false
    },
    hasAddBtn: {
      type: Boolean
    },
    //行业
    industry:{
      type: [Number, String]
    },
    //行业列表
    industryList:{
      type:Array,
      required:false
    }
  },

  computed: {
    isNew_c() {
      return !this.id;
    },
    serialIndex_c() {
      if (this.serialIndex.length == 1) {
        return "0" + this.serialIndex;
      } else {
        return this.serialIndex;
      }
    },
    showEditInput_c() {
      if (!this.isNew_c) {
        return this.showEditInput;
      } else {
        return true;
      }
    }
  },

  watch: {
    defaultOpen: {
      handler: function(n, o) {
        if (n == this.id) {
          this.isOpen = true;
          this.$emit("fold", { id: this.id, isOpen: true });
        } else {
          this.isOpen = false;
          this.$emit("fold", { id: this.id, isOpen: false });
        }
      },
      immediate: true
    }
  },
  created() {
    // 展开事件
    this.$eventHub.$on("FOLD-EVENT", this.foldEventFn);
    // 收起事件
    this.$eventHub.$on("TAKE-UP-EVENT", this.takeUpEventFn);
    //初始化,无法操作dom
  },
  mounted() {
    this.initBtn();
  },
  components: {
    //子组件
  },
  methods: {
    focusNewInput() {
      if (this.isNew_c) {
        this.isOpen = true;
        this.$eventHub.$emit("FOLD-EVENT", this.id);
      }
    },
    initBtn() {
      this.showAddBtn = this.hasAddBtn;
      // this.showAddBtn = !!this.$listeners.add;
      this.showDeleteBtn = !!this.$listeners.delete;
      this.showEditBtn = !!this.$listeners["edit-confirm"];
    },
    // 折叠事件的回调
    foldEventFn(id) {
      // console.log('foldEventFn',id)
      if (this.accordion && id != this.id) {
        this.isOpen = false;
      }
    },
    takeUpEventFn(id) {
      if (this.accordion && id == this.id) {
        this.isOpen = false;
        this.$emit("fold", { id: this.id, isOpen: this.isOpen });
      }
    },
    //折叠事件
    onFold() {
      this.isOpen = !this.isOpen;
      this.$emit("fold", { id: this.id, isOpen: this.isOpen });
      this.$eventHub.$emit("FOLD-EVENT", this.id);
    },
    onInputCancle() {
      let eventName = "edit-cancel";
      if (this.isNew_c) {
        eventName = "add-cancel";
      }
      this.showEditInput = false;
      this.$emit(eventName, this.id);
    },
    //点击input的确认按钮
    onInputConfirm() {
      let _resolve;
      let _reject;
      let _promise = new Promise((resolve, reject) => {
        _resolve = resolve;
        _reject = reject;
      });
      _promise
        .then(r => {
          this.showEditInput = false;
        })
        .catch(e => {
          // this.showEditInput = false;
        });
      /* let data = {
          old_name:this.old_name,
          id:this.id
        }; */
      let eventName = "edit-confirm";
      if (this.isNew_c) {
        eventName = "add-confirm";
      }
      this.$emit(eventName, {
        id: this.id,
        name: this.old_name,
        industry:this.old_industry,
        _resolve,
        _reject
      });
    },
    onAdd() {
      this.$emit("add", this.id);
    },
    onDelete() {
      this.$emit("delete", { id: this.id, name: this.name });
    },
    //点击编辑按钮
    onEdit() {
      this.showEditInput = !this.showEditInput;
      if (this.showEditInput) {
        this.old_name = this.name;
        this.old_industry = this.industry;
      }
    }
  }
};
</script>
<style scoped lang="scss">
@import "../../../assets/css/theme/mixin.scss";
.list-collapse {
  margin-bottom: 10px;
  user-select: none;
}

.list-bar-background {
  display: flex;
}

.list-bar-background .large-serial-num {
  position: relative;
  width: 82px;
  height: 88px;
  background-image: url("~@/assets/image/project/list-normal-dark-1.png");
  background-repeat: no-repeat;
}
.list-bar-background.active .large-serial-num {
  position: relative;
  width: 82px;
  height: 88px;
  background-image: url("~@/assets/image/project/list-select-1.png");
  background-repeat: no-repeat;
}

.large-serial-num:before {
  content: attr(data-index);
  position: absolute;
  left: 16px;
  top: 14px;
  width: 60px;
  height: 40px;
  text-align: center;
  color: white;
  font-size: 30px;
  font-weight: normal;
  font-family: "Microsoft YaHei UI Light";
}

.list-bar-background .main-area {
  position: relative;
  height: 88px;
  background-image: url("~@/assets/image/project/list-normal-dark-2.png");
  background-repeat: repeat-x;
  flex: 1;
}
.list-bar-background.active .main-area {
  position: relative;
  height: 88px;
  background-image: url("~@/assets/image/project/list-select-2.png");
  background-repeat: repeat-x;
  flex: 1;
}

.main-area > .name {
  color: white;
  margin-top: 52px;
  font-size: 16px;
  font-weight: normal;
  text-indent: 10px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 770px;
}
.input-box {
  float: left;
  margin-top: 50px;
  margin-left: 10px;
}

.customer-time {
  color: white;
  font-size: 14px;
  font-weight: normal;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  position: absolute;
  top: 43px;
  right: 200px;
  height: 40px;
  line-height: 40px;
}

.list-bar-background .main-area .operate {
  position: absolute;
  top: 44px;
  right: 0px;
  height: 40px;
  line-height: 40px;
}
.operate > i {
  margin-left: 20px;
  cursor: pointer;
  opacity: 0.6;
  display: inline-block;
  color: white;
  font-size: 24px;
  width: 24px;
  height: 24px;
  line-height: 12px;
}
.operate i:hover {
  opacity: 0.8;
}
.list-bar-background .bevel-angle {
  width: 20px;
  height: 88px;
  background-image: url("~@/assets/image/project/list-normal-dark-3.png");
  background-repeat: no-repeat;
}

.list-bar-background.active .bevel-angle {
  width: 20px;
  height: 88px;
  background-image: url("~@/assets/image/project/list-select-3.png");
  background-repeat: no-repeat;
}

/* 添加按钮 */
.mis-add-r-o {
  color: white;
  font-size: 36px;
  cursor: pointer;
}
/* 向下展开按钮 */
.mis-unie621,
.mis-unie624 {
  display: inline-block;
  color: white;
  font-size: 35px;
  cursor: pointer;
  margin-left: 20px;
}
/* 向上收起按钮 */

.list-content {
  margin-left: 26px;
}

.more {
  position: relative;
  z-index: 1;
  height: 18px;
  text-align: center;
  border-top: 1px solid black;
  background-color: #434a54;    /*(背景调换)，暂无此class*/
  margin-top: -1px;
  padding: 15px 0;
}

.more .loading-more {
  display: inline-block;
  cursor: pointer;
}

.medium-item {
  background-color: #434a54;   /*(背景调换)暂无此class*/
  display: flex;
  height: 48px;
  line-height: 48px;
  color: #fffeff;
  font-size: 14px;
  border-top: 1px solid #161c28;
}
.medium-item:hover {
  background-color: #265454;   /*(背景调换)暂无此class*/
}
.medium-item .name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;
}
.medium-item .name-text {
  max-width: calc(100% - 70px);
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.medium-item .serial-num {
  padding-left: 18px;
  padding-right: 28px;
}
.time,
.operate-box {
  margin-right: 14px;
}
.device {
  padding-right: 14px;
  width: 30px;
  text-align: center;
}

.draft-name {
  font-size: 12px;
  background-color: rgba(0, 0, 0, 0.4);   /*(背景调换)暂无此class*/
  border-radius: 20px;
  display: inline-block;
  width: 40px;
  text-align: center;
  height: 16px;
  line-height: 16px;
  margin-left: 5px;
  position: absolute;
  top: calc(50% - 8px);
}
.operate-button {
  width: 40px;
  display: inline-block;
  text-align: center;
}
.operate-button i {
  cursor: pointer;
  opacity: 0.6;
}
.operate-button i:hover {
  opacity: 1;
}
.product-short {
  display: table;
  margin-right: 14px;
}
.dotted-box {
  width: 30px;
  height: 30px;
  border: 1px dashed #fff;
  display: inline-block;
  vertical-align: middle;
  line-height: 30px;
  text-align: center;
}
.brand-ico {
  width: 30px;
  height: 30px;
  margin-right: 14px;
}
</style>

<style>
/*全局部分*/
.list-collapse .el-input__inner:focus {
  border: 1px solid rgba(255, 255, 255, 0.6);
}
.list-collapse .el-select .el-input.is-focus .el-input__inner{
  border-color:rgba(255, 255, 255, 0.6);
}
</style>
