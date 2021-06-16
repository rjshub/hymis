<template>
  <div class="g__nav ">
    <mis-menu-group :default-active="$route.meta.nav">
      <mis-menu-item icon="project"
        index="/project">项目管理
        <mis-submenu-group slot="sub-menu">
          <mis-submenu-item index="/project/manage">项目列表</mis-submenu-item>
          <!-- <template v-if="projectArchive_permission==0"> -->
          <mis-submenu-item v-if="projectArchive_permission!=0" index="/project/archive">归档项目</mis-submenu-item>
          <!-- </template> -->
          <mis-submenu-item hash="/budget/manage">预算分配</mis-submenu-item>
        </mis-submenu-group>
      </mis-menu-item>
      <!-- <mis-menu-item icon="add"
        v-if="project_create_permission==1"
        @click.native="onClickProCreate"
        index="/project/create">创建项目</mis-menu-item>
      <mis-menu-item icon="add"
        v-else
        index="/noprojectcreate">创建项目</mis-menu-item> -->

      <!-- <mis-menu-item icon="history"
                index="/history">历史记录</mis-menu-item> -->
      <mis-menu-item icon="strategy"
        index="/strategy">智能策略
        <mis-submenu-group slot="sub-menu">
          <mis-submenu-item index="/strategy/medium">媒介推荐</mis-submenu-item>
        </mis-submenu-group>
      </mis-menu-item>

      <template v-if="user_id==1">
        <mis-menu-item icon="system"
          index="/system">系统管理
          <mis-submenu-group slot="sub-menu">
            <mis-submenu-item index="/system/role">角色管理</mis-submenu-item>
            <mis-submenu-item index="/system/user">用户管理</mis-submenu-item>
            <mis-submenu-item index="/system/customer">客户管理</mis-submenu-item>
            <mis-submenu-item index="/system/media-manage">媒体管理</mis-submenu-item>
            <mis-submenu-item index="/system/rule">OTV/OTT规则管理</mis-submenu-item>
            <mis-submenu-item index="/system/operatelog">操作日志</mis-submenu-item>
          </mis-submenu-group>
        </mis-menu-item>
      </template>
      <template v-else>
        <!-- <mis-menu-item icon="system" :index='ruleManage_permission?"/system":"/nosystem"'>系统管理
          <mis-submenu-group slot="sub-menu" v-if="ruleManage_permission">
            <mis-submenu-item index="/system/rule">OTV/OTT规则管理</mis-submenu-item>
          </mis-submenu-group>
        </mis-menu-item> -->
        <mis-menu-item icon="system"
          v-show='!showSystem'
          index="/nosystem">系统管理</mis-menu-item>

        <mis-menu-item icon="system"
          v-show='showSystem'
          index='/system'>系统管理
          <mis-submenu-group slot="sub-menu">
            <mis-submenu-item index="/system/role"
              v-show='roleManage_permission!=0'>角色管理</mis-submenu-item>
            <mis-submenu-item index="/system/user"
              v-show='userManage_permission!=0'>用户管理</mis-submenu-item>
            <mis-submenu-item index="/system/customer"
              v-show='customerManage_permission!=0'>客户管理</mis-submenu-item>
            <!-- <mis-submenu-item index="/system/media-manage">媒体管理</mis-submenu-item> -->   <!--非root账户不可看-->
            <mis-submenu-item index="/system/rule"
              v-show='ruleManage_permission!=0'>OTV/OTT规则管理</mis-submenu-item>
            <mis-submenu-item index="/system/operatelog" v-show="operateLog_permission!=0"
              >操作日志</mis-submenu-item>
          </mis-submenu-group>
        </mis-menu-item>

      </template>

    </mis-menu-group>
  </div>

</template>
<script>
import misMenuGroup from "@/views/public/mis-menu/mis-menu-group";
import misMenuItem from "@/views/public/mis-menu/mis-menu-item";
import misSubmenuGroup from "@/views/public/mis-menu/mis-submenu-group";
import misSubmenuItem from "@/views/public/mis-menu/mis-submenu-item";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
export default {
  name: "Nav",
  components: {
    misMenuGroup,
    misMenuItem,
    misSubmenuGroup,
    misSubmenuItem
  },
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
      "operateLog_permission"
    ]),
    showSystem() {
      return (
        this.ruleManage_permission != 0 ||
        this.userManage_permission != 0 ||
        this.roleManage_permission != 0 ||
        this.customerManage_permission != 0
      );
    }
  },
  created() {
    // alert('345')
  },
  methods: {
    //已废弃
    onClickProCreate() {
      if (this.flag) {
        this.$eventHub.$emit("NAV-CREATE-PROJECT");
      }
    }
  }
};
</script>
<style scoped>
</style>

