<template>
    <!-- 分配策略 -->
    <sider-el-menu :default-active="active_route? active_route:'/project/manage'">
        <el-submenu index="/project/manage">
            <template slot="title">
                <i class="icon icon-component-product"></i>
                <span>{{$t('lang.secondary_nav_OTV_OTT')}}</span>
            </template>
            <sider-el-menu-sub-item index="/project/manage"
                :text="$t('lang.third_nav_project_list')" />
            <sider-el-menu-sub-item v-if="projectArchive_permission!=0"
                index="/project/archive"
                :text="$t('lang.third_nav_archived_project')" />
        </el-submenu>

        <el-submenu index="/budget/manage">
            <template slot="title">
                <i class="icon icon-budget-allocation"></i>
                <span>{{$t('lang.secondary_nav_display')}}</span>
            </template>
            <sider-el-menu-sub-item index="/budget/manage"
                :text="$t('lang.third_nav_project_list')" />
        </el-submenu>
    </sider-el-menu>

</template>
<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import SiderElMenu from "./public/sider-el-menu";
import SiderElMenuSubItem from "./public/sider-el-menu-sub-item";
export default {
  name: "NavAllotStrategy",
  components: { SiderElMenu, SiderElMenuSubItem },
  data() {
    return {};
  },
  watch: {},
  computed: {
    ...mapState("permissions", ["projectArchive_permission", "budgetManage_permission"]),
    ...mapState("system", ['active_route'])
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
    &.icon-component-product {
      background: url("~@/assets/image/menu/shuffle.png");
    }
    &.icon-budget-allocation {
      background: url("~@/assets/image/menu/pie.png");
    }
  }
  &.is-active {
    .icon {
      &.icon-component-product {
        background: url("~@/assets/image/menu/shuffle-active.png");
      }
      &.icon-budget-allocation {
        background: url("~@/assets/image/menu/pie-active.png");
      }
    }
  }
}
</style>
<style lang="scss">
</style>


