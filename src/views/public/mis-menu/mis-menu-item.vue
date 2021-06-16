<template>
  <div>
    <div :style="menuStyle"
      class="menu-button"
      v-popover:popover
      @mouseenter="onMouseEnter"
      @mouseleave="onMouseLeave"
      @click="handleClick">
      <transition mode="out-in"
        enter-active-class="animated flipInY faster">

        <div v-if="isHover"
          :data-icon="icon"
          :key="2"
          class="button-background-hover">
          <div class="title">
            <slot></slot>
          </div>
        </div>

        <div v-else-if="!isActive"
          :key="1"
          class="button-background-normal">
          <div class="icon"
            :style="normalIconStyle"></div>
        </div>

        <div v-else-if="isActive"
          :key="3"
          class="button-background-active">
          <div class="icon"
            :style="selectIconStyle"></div>
        </div>

      </transition>
    </div>
    <el-popover v-if="$slots['sub-menu']"
      ref="popover"
      popper-class="mis-submenu-class"
      placement="right"
      width="200"
      trigger="hover">
      <slot name="sub-menu"
        ref="subMenu"></slot>
    </el-popover>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";

export default {
  name: "mis-menu-item",
  componentName: "misMenuItem",
  data() {
    return {
      hasSubMenu: false,
      isHover: false,
      normalIconStyle: {},
      selectIconStyle: {}
    };
  },
  props: {
    icon: {
      type: String,
      required: true
    },
    index: {
      //路由跳转
      type: String,
      required: false
    }
  },
  inject: ["rootMenu"],
  computed: {
    isActive() {
      return this.rootMenu.activeMenus.includes(this.index);
    },
    activeClass() {
      return { active: this.isActive };
    },
    menuStyle() {
      if (this.hasSubMenu) {
        return { cursor: "default" };
      } else {
        return { cursor: "pointer" };
      }
    }
  },
  watch:{

  },
  methods: {
    handleClick() {
      /**
       * 如果有submenu，则点击没效果
       */
      if (this.$refs.popover && this.$refs.popover.$children.length > 0) {
        return;
      }

      this.isHover = false;
      this.$dispatch("rootMenuButton", "item-click", this.index);

      if (this.index) {
        this.$router.push({ path: this.index });
      }
    },
    onMouseEnter() {
      this.isHover = true;
    },
    onMouseLeave() {
      this.isHover = false;
      this.$dispatch("rootMenuButton", "item-hover", this.index);
    }
  },

  mounted() {
    let nomalUrl = require(`@/assets/image/menu/menu-${this.icon}-normal.png`);
    let selectUrl = require(`@/assets/image/menu/menu-${this.icon}-select.png`);

    this.normalIconStyle = {
      "background-image": `url(${nomalUrl})`
    };
    this.selectIconStyle = {
      "background-image": `url(${selectUrl})`
    };

    
    // this.$on("hide-subMenu", (a)=>{
      // console.log('TCL: mounted -> a', a)
      // this.isHover = false;
    // });

    if (
      this.$refs.popover &&
      this.$refs.popover.$children &&
      this.$refs.popover.$children.length
    ) {
      this.hasSubMenu = true;
    } else {
      this.hasSubMenu = false;
    }
  },

  components: {
    //子组件
  }
};
</script>
<style scoped >
.menu-button {
  width: 76px;
  height: 76px;
  margin-bottom: 35px;
  cursor: pointer;
}

.button-background-normal {
  width: 100%;
  height: 100%;
  background-image: url("~@/assets/image/menu-bg-normal.png");
  background-repeat: no-repeat;
}
.button-background-normal .icon {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: 20px 20px;
  background-size: 32px 32px;
  opacity: 0.6;
}

.button-background-hover {
  width: 100%;
  height: 100%;
  background-image: url("~@/assets/image/menu-bg-select.png");
  background-repeat: no-repeat;
  margin-bottom: 40px;
}
.button-background-hover .title {
  display: inline-block;
  width: 100%;
  font-size: 13px;
  margin: 27px 0;
  text-align: center;
  color: #42a996;
}

.button-background-active {
  width: 100%;
  height: 100%;
  background-image: url("~@/assets/image/menu-bg-select.png");
  background-repeat: no-repeat;
  margin-bottom: 40px;
}
.button-background-active .icon {
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: 20px 20px;
  background-size: 32px 32px;
  opacity: 0.8;
}

/*本地部分*/
</style>
<style>
.mis-submenu-class.el-popover {
  border-radius: 0;
  background-color: #2c323e;   /*（背景调换）暂无找到界面*/
  border: 0;
  padding: 0;
}

.mis-submenu-class.el-popover .popper__arrow {
  border-right-color: #2c323e;
}

.mis-submenu-class.el-popover .popper__arrow:after {
  border-right-color: #2c323e;
}
</style>