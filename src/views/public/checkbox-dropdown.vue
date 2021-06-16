<template>
    <div @click.stop
        class="checkbox_dropdown_wrap">
        <el-button @click="is_show_dropdown = !is_show_dropdown"
            :title="name"><i class="icon-btn"></i>
        </el-button>
        <div class="checkbox_dropdown"
            v-show="is_show_dropdown">
            <el-checkbox :indeterminate="isIndeterminate"
                @change="onChangeCheckBox"
                v-model="checkAll"
                v-show="is_show_dropdown">
                {{$t('lang.public_checkAll')}}
            </el-checkbox>
            <el-checkbox-group :class="'checkbox_dropdown_' + placement"
                v-show="is_show_dropdown"
                :value="datavalue"
                @input="handle_input">
                <el-checkbox v-for="item in items"
                    :key="item.prop"
                    :label="item.prop">
                    {{item.label}}
                </el-checkbox>
            </el-checkbox-group>
        </div>
    </div>
</template>

<script>
export default {
  name: "checkbox-dropdown",
  data() {
    return {
      datavalue: [],
      is_show_dropdown: false,
      checkAll: true,
      isIndeterminate: false //不确定状态true，false可以全选
    };
  },
  props: {
    name: {
      type: String,
      default: "请选择"
    },
    placement: {
      type: String,
      default: "top"
    },
    value: {
      type: Array,
      required: true
    },
    items: {
      type: Array,
      required: true
    },
    //是否显示全选按钮
    isShowAll: {
      type: Boolean,
      required: false,
      default: true
    },
    //全选按钮名称
    allItemName: {
      type: Object,
      required: false,
      default: () => {
        return {
          prop: "all_items",
          label: "全部"
        };
      }
    }
  },
  watch: {
    value: {
      handler: function(val) {
        if (val) {
          this.datavalue = this.value;
        }
      },
      deep: true
    }
  },
  created() {
    document.addEventListener("click", event => {
      this.is_show_dropdown = false;
    });
  },
  methods: {
    handle_input(value) {
      this.datavalue = value;
      if (value.length == 0) {
        this.isIndeterminate = false;
        this.checkAll = false;
      } else if (value.length == this.items.length) {
        this.isIndeterminate = false;
        this.checkAll = true;
      } else {
        this.isIndeterminate = true;
      }
      this.$emit("input", value);
    },
    //点击全选按钮事件
    onChangeCheckBox(val) {
      if (val) {
        this.datavalue = this.items.map(item => {
          return item.prop;
        });
      } else {
        this.datavalue = [];
      }
      this.isIndeterminate = false;
      this.$emit("input", this.datavalue);
    }
  }
};
</script>

<style scoped>
.down-load-icon {
  display: inline-block;
  height: 28px;
  width: 33px;
  background-color: rgba(255, 255, 255, 0.2);    /*(背景调换)未找到界面*/
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.5);
  opacity: 0.5;
  border-radius: 2px;
  box-sizing: border-box;
  padding: 5px 0px 0px 7px;
  cursor: pointer;
}

.check-box-drop {
  float: right;
  margin-right: 10px;
}

.down-load-icon i {
  color: #ffffff;
  font-size: 16px;
}

.checkbox_dropdown_wrap {
  position: relative;
  display: inline-block;
  z-index: 10;
}

.checkbox_dropdown {
  position: absolute;
  right: 0;
  width: 140px;
  background: #2a313a;    /*(背景调换)未找到界面*/
  margin: 2px 0;
  border: 1px solid #2a313a;
  border-radius: 1px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  height: 200px;
  overflow-y: auto;
}

.checkbox_dropdown_top {
  bottom: 100%;
}

.checkbox_dropdown_bottom {
  top: 100%;
}

.checkbox_dropdown .el-checkbox {
  display: block;
  padding: 5px 8px;
  margin-left: 0;
}

.checkbox_dropdown .el-checkbox:hover {
  background-color: rgba(66, 169, 150, 0.4);    /*(背景调换)未找到界面*/
}

.icon-btn {
  display: inline-block;
  width: 16px;
  height: 16px;
  background: url("~@/assets/image/custom.png");
}
</style>
<style lang="scss">
.checkbox_dropdown_wrap {
  .el-button {
    padding: 4px 8px;
    background: rgba(255, 255, 255, 0.2);    /*(背景调换)未找到界面*/
    border: 1px solid rgba(255, 255, 255, 0.5);
    opacity: 0.6;
    border-radius: 2px;
  }
  .el-button:hover {
    opacity: 0.8;
    background: rgba(255, 255, 255, 0.2);    /*(背景调换)未找到界面*/
    border: 1px solid rgba(255, 255, 255, 0.5);
  }
  .el-checkbox__label {
    color: #fff;
  }
}
</style>
