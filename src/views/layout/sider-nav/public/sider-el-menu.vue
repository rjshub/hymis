<template>
  <el-menu :default-active="defaultActive"
    class="sider-nav-menu"
    :router="true"
    @select="select_route"
    background-color="#0E1219"
    text-color="#dedede"
    active-text-color="#42a996">
    <slot></slot>
  </el-menu>

</template>
<script>
import {mapActions} from 'vuex'
export default {
  name: "side-el-menu",
  components: {},
  props: {
    defaultActive: {
      type: String,
      required: false,
    }
  },
  data() {
    return {
    };
  },
  watch: {

  },
  computed: {},
  created() {
    // alert('345')
  },
  methods: {
    ...mapActions('system',["update_active_route"]),
    select_route(index, path) {
      this.update_active_route(index)
    }
  }
};
</script>
<style scoped lang="scss">
</style>
<style lang="scss">
.sider-nav-menu {
  .el-menu-item,
  .el-submenu__title {
    font-size: 12px;
    height: 38px;
    line-height: 38px;
    padding: 0 !important;
  }
  .el-submenu__icon-arrow {
    display: none;
  }

  .el-submenu {
    .el-menu-item {
      background-color: #0E1219 !important;  
      min-width: 0;
      .text::before {
        content: "◆";
        color: rgb(222, 222, 222);
        margin-left: 14px;
        margin-right: 4px;
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
      /* &.icon-data-insight {
        background: url("~@/assets/image/menu/graph.png");
      }
      &.icon-data-src-manage {
        background: url("~@/assets/image/menu/storage.png");
      } */
    }
    &.is-active {
      .el-submenu__title {
        color: #42a996 !important;
      }
      /* .icon {
        &.icon-data-insight {
          background: url("~@/assets/image/menu/graph-active.png");
        }
        &.icon-data-src-manage {
          background: url("~@/assets/image/menu/storage-active.png");
        }
      } */
    }
  }
}
</style>


