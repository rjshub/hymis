<template>
    <!-- 系统管理 -->
    <sider-el-menu :default-active='active_route? active_route:defaultActive'>
        <el-menu-item v-show='roleManage_permission!=0'
            index="/system/role">
            <i class="icon icon-role-manage"></i>
            <span slot="title">{{$t('lang.secondary_nav_roles_manage')}}</span>
        </el-menu-item>
        <el-menu-item v-show='userManage_permission!=0'
            index="/system/user">
            <i class="icon icon-user-manage"></i>
            <span slot="title">{{$t('lang.secondary_nav_users_manage')}}</span>
        </el-menu-item>
        <el-menu-item v-show='customerManage_permission!=0'
            index="/system/customer">
            <i class="icon icon-customer-manage"></i>
            <span slot="title">{{$t('lang.secondary_nav_clients_manage')}}</span>
        </el-menu-item>
        <el-menu-item v-show='ruleManage_permission!=0'
            index="/system/rule">
            <i class="icon icon-rule-manage"></i>
            <span slot="title">{{$t('lang.secondary_nav_OTV_OTT_rules_manage')}}</span>
        </el-menu-item>
        <el-menu-item v-show='user_id==1'
            index="/system/media-manage">
            <i class="icon icon-media-manage"></i>
            <span slot="title">{{$t('lang.secondary_nav_medium_manage')}}</span>
        </el-menu-item>
        <el-menu-item v-show="operateLog_permission!=0"
            index="/system/operatelog">
            <i class="icon icon-operate-log"></i>
            <span slot="title">{{$t('lang.secondary_nav_operation_log')}}</span>
        </el-menu-item>

    </sider-el-menu>

</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";
import SiderElMenu from "./public/sider-el-menu";
import SiderElMenuSubItem from "./public/sider-el-menu-sub-item";
export default {
  name: "NavSystemManage",
  components: { SiderElMenu, SiderElMenuSubItem },
  data() {
    return {};
  },
  watch: {},
  computed: {
    ...mapState("user", ["user_id"]),
    ...mapState("permissions", [
      "project_create_permission",
      "ruleManage_permission",
      "userManage_permission",
      "roleManage_permission",
      "customerManage_permission",
      "projectArchive_permission",
      "operateLog_permission"
    ]),
    ...mapState("system", ['active_route']),
    //默认路径
    defaultActive() {
      if (this.$route.params.defaultIndex) {
        return this.$route.params.defaultIndex;
      } else {
        let list = [
          this.roleManage_permission,
          this.userManage_permission,
          this.customerManage_permission,
          this.ruleManage_permission,
          this.operateLog_permission
        ];
        let index = list.findIndex(item => item != 0);
        let defaultIndex = "";
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
    }
  },
  created() {
    // alert('345')
  },
  methods: {}
};
</script>
<style scoped lang="scss">
.el-menu-item,
.el-submenu {
  .icon {
    &.icon-role-manage {
      background: url("~@/assets/image/menu/lock.png");
    }
    &.icon-user-manage {
      background: url("~@/assets/image/menu/user.png");
    }
    &.icon-customer-manage {
      background: url("~@/assets/image/menu/tie.png");
    }
    &.icon-rule-manage {
      background: url("~@/assets/image/menu/front-email.png");
    }
    &.icon-media-manage {
      background: url("~@/assets/image/menu/tv.png");
    }
    &.icon-operate-log {
      background: url("~@/assets/image/menu/bookmark.png");
    }
  }
  &.is-active {
    .icon {
      &.icon-role-manage {
        background: url("~@/assets/image/menu/lock-active.png");
      }
      &.icon-user-manage {
        background: url("~@/assets/image/menu/user-active.png");
      }
      &.icon-customer-manage {
        background: url("~@/assets/image/menu/tie-active.png");
      }
      &.icon-rule-manage {
        background: url("~@/assets/image/menu/front-email-active.png");
      }
      &.icon-media-manage {
        background: url("~@/assets/image/menu/tv-active.png");
      }
      &.icon-operate-log {
        background: url("~@/assets/image/menu/bookmark-active.png");
      }
    }
  }
}
</style>
<style lang="scss">
</style>


