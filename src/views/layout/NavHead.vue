<template>
    <el-menu :default-active="defaultActive"
        :router="true"
        class="menu-header"
        mode="horizontal"
        background-color="#0E1219"
        text-color="#dedede"
        @select="select_nav"
        active-text-color="#42a996">
        <el-menu-item index="/project">
            <i class="ico-allocation-strategy"></i>
            <span slot="title">{{$t('lang.first_nav_allocation_strategy')}}</span>
        </el-menu-item>
        <el-menu-item v-if="showMediaStrategy"
            index="/strategy">
            <i class="ico-medium-strategy"></i>
            <span slot="title">{{$t('lang.first_nav_media_strategy')}}</span>
        </el-menu-item>
        <el-menu-item v-if="showSystem"
            :index="defaultSystemActive">
            <i class="ico-system-manage"></i>
            <span slot="title">{{$t('lang.first_nav_system_management')}}</span>
        </el-menu-item>
    </el-menu>

</template>
<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
export default {
  name: "NavHead",
  components: {},
  data() {
    return {
      flag: true //这个默认值不能改
    };
  },

  watch: {
    //已废弃
    /* $route: {
      handler: function(val, oldVal) {
        this.flag = val.path == "/project/create";
      },
      deep: true,
      immediate: true
    } */
  },
  computed: {
    ...mapState("user", ["user_id"]),
    ...mapState("permissions", [
      "project_create_permission",
      "ruleManage_permission",
      "userManage_permission",
      "roleManage_permission",
      "customerManage_permission",
      "projectArchive_permission",
      "operateLog_permission",
      "strategyManage_permission"
    ]),
    //显示一级导航媒介策略
    showMediaStrategy() {
      return this.strategyManage_permission != 0;
    },
    //显示一级导航系统管理
    showSystem() {
      if (this.user_id == 1) {
        return true;
      } else {
        return (
          this.ruleManage_permission != 0 ||
          this.userManage_permission != 0 ||
          this.roleManage_permission != 0 ||
          this.customerManage_permission != 0
        );
      }
    },
    defaultActive() {
      let nav = this.$route.meta.nav;
      if (nav.indexOf("system") > -1) {
        nav = this.defaultSystemActive;
      }
      return nav;
    },
    //默认路径
    defaultSystemActive() {
      let list = [
        this.roleManage_permission,
        this.userManage_permission,
        this.customerManage_permission,
        this.ruleManage_permission,
        this.operateLog_permission
      ];
      let index = list.findIndex(item => item != 0);
      let defaultIndex = "/system";
      switch (index) {
        case 0:
          defaultIndex = "/system/role";
          break;
        case 1:
          defaultIndex = "/system/user";
          break;
        case 2:
          defaultIndex = "/system/customer";
          break;
        case 3:
          defaultIndex = "/system/rule";
          break;
        case 4:
          defaultIndex = "/system/operatelog";
          break;
      }
      return defaultIndex;
    }
  },
  created() {
    // alert('345')
  },
  methods: {
    ...mapActions('system',["update_active_route"]),
    select_nav() {
      this.update_active_route('')
    }
  }
};
</script>
<style scoped lang="scss">
.menu-header {
  float: left;
  margin-left: 44px;
}
.ico-allocation-strategy{
  background: url("~@/assets/image/menu/allocation-strategy.png");
}
.ico-medium-strategy{
  background: url("~@/assets/image/menu/medium-strategy.png");
}
.ico-data-center{
  background: url("~@/assets/image/menu/data-center.png");
}
.ico-system-manage{
  background: url("~@/assets/image/menu/system-manage.png");
}
</style>
<style lang="scss">
.menu-header{
  .el-menu-item {
  i[class^="ico-"]{
    width: 24px;
    height: 24px;
    display: inline-block;
  }
  span{
    padding-left: 9px;
  }
  &.is-active{
    .ico-allocation-strategy{
      background: url("~@/assets/image/menu/allocation-strategy-active.png");
    }
    .ico-medium-strategy{
      background: url("~@/assets/image/menu/medium-strategy-active.png");
    }
    .ico-data-center{
      background: url("~@/assets/image/menu/data-center-active.png");
    }
    .ico-system-manage{
      background: url("~@/assets/image/menu/system-manage-active.png");
    }
  }
}
&.el-menu.el-menu--horizontal{
  border-bottom: 0px;
  .el-menu-item{
    height: 76px;
    line-height: 76px;
  }
}
}

</style>


