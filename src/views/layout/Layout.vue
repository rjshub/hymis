<template>
  <div class="g__wrap">
    <layout-header />
    <div class="g__scroll"
      ref="toTop"
      @scroll="onScroll($event)">
      <div class="g__main clearfix"
        :class="{'no-nav':hasnoNav}">
        <!-- <nav-sider /> -->
        <!-- <nav-data-center class='sider-nav' /> -->
        <!-- <NavSystemManage class='sider-nav' /> -->
        <sider-nav />

        <div class="g__box">
          <!-- <keep-alive>
            <router-view v-if="$route.meta.keepAlive" />
          </keep-alive> -->
          <router-view v-if="!$route.meta.keepAlive"
            class="g__content" />
          <layout-footer />
        </div>
      </div>

      <div class="to-top"
        :title="$t('lang.public_tooltip_back_to_top')"
        v-if='showToTop'
        @click="toTop($event)">
        <i class="iconfont icon-xiangshang icon"></i>
      </div>
    </div>
    <div class="g__other"></div>

  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import LayoutHeader from "./LayoutHeader";
import LayoutFooter from "./LayoutFooter";
import NavSider from "./Nav";
import SiderNav from "./sider-nav";
// import NavDataCenter from "./sider-nav/data-center";
import _ from "lodash";
export default {
  name: "Layout",
  components: {
    LayoutHeader,
    LayoutFooter,
    NavSider,
    SiderNav,
  },
  data() {
    return {
      showToTop: false,
      throttleTimer: null //节流时间句柄
    };
  },
  computed: {
    hasnoNav() {
      return this.$route.meta.hasNotNav;
    }
  },
  created() {},
  methods: {
    ...mapActions(["updata_scrolltop"]),

    toTop(event) {
      this.$refs.toTop.scrollTop = 0;
    },
    onScroll(event) {
      let top = event.srcElement.scrollTop;
      clearTimeout(this.throttleTimer);
      this.throttleTimer = setTimeout(() => {
        this.updata_scrolltop(top);
      }, 500);

      // console.log('top:',top)
      // this.updata_scrolltop(top);
      // console.log('scrollTop',event.srcElement.scrollTop)
      this.showToTop = top > 0;
      if (
        event.srcElement.scrollHeight -
          (event.srcElement.scrollTop + event.srcElement.clientHeight) ==
        0
      ) {
      }
    }
  }
};
</script>
<style scoped lang="scss">
@import "../../assets/css/theme/mixin.scss";

.to-top {
  position: fixed;
  right: 20px;
  bottom: 15px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #07090c;    
  z-index: 1;
  cursor: pointer;
}
.icon {
  color: #9c9ea1;
  height: 32px;
  line-height: 32px;
  text-align: center;
  display: block;
}
.sider-nav {
  background-color: #0f161c;   
  // width: 140px;
  width: 155px;
  height: 100%;
  float: left;
  position: fixed;
  border-right: 1px solid #020204;
  box-sizing: border-box;
  overflow: hidden;
  z-index: 9;
}
</style>
<style lang="scss">
/* .sider-nav-menu {
  .el-menu-item,
  .el-submenu__title {
    height: 38px;
    line-height: 38px;
    padding: 0 !important;
  }
  .el-submenu__icon-arrow {
    display: none;
  }

  .el-submenu {
    .el-menu-item {
      min-width: 0;
      .text::before {
        content: "◆";
        color: rgb(222, 222, 222);
        margin-left: 20px;
        margin-right: 8px;
      }
      &.is-active {
        background-color: #142328 !important;
        .text::before {
          color: #42a996;
        }
        .triangle {
          width: 14px;
          height: 14px;
          display: inline-block;
          position: absolute;
          box-sizing: border-box;
          &.left-top {
            border-left: 1px solid #42a996;
            border-top: 1px solid #42a996;
            left: 0;
            top: 0;
          }
          &.right-bottom {
            border-right: 1px solid #42a996;
            border-bottom: 1px solid #42a996;
            right: 0;
            bottom: 0;
          }
        }
      }
    }
  }
  .el-menu-item,
  .el-submenu {
    .icon {
      height: 16px;
      width: 16px;
      margin-left: 7px;
      margin-right: 2px;
      display: inline-block;
      &.icon-data-insight {
        background: url("~@/assets/image/menu/graph.png");
      }
      &.icon-data-src-manage {
        background: url("~@/assets/image/menu/storage.png");
      }
    }
    &.is-active {
      .el-submenu__title {
        color: #42a996 !important;
      }
      .icon {
        &.icon-data-insight {
          background: url("~@/assets/image/menu/graph-active.png");
        }
        &.icon-data-src-manage {
          background: url("~@/assets/image/menu/storage-active.png");
        }
      }
    }
  }
} */
</style>


