<template>
    <!-- 媒体策略 -->
    <sider-el-menu default-active='/strategy/medium/media-cph-rank'>
        <!-- <el-submenu index="/strategy" v-if="strategyManage_permission!=0">
      <template slot="title">
        <i class="icon icon-media-recommend"></i>
        <span>媒介推荐</span>
      </template>
      <sider-el-menu-sub-item index="/strategy/medium/media-cph-rank"
        text='HY.PBS媒介推荐' />
    </el-submenu> -->
        <el-menu-item v-if="strategyManage_permission!=0"
            index="/strategy/medium/media-cph-rank">
            <i class="icon icon-media-recommend"></i>
            <span slot="title">{{$t('lang.secondary_nav_medium_recommendation')}}</span>
        </el-menu-item>
    </sider-el-menu>

</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";
import SiderElMenu from "./public/sider-el-menu";
import SiderElMenuSubItem from "./public/sider-el-menu-sub-item";
export default {
  name: "NavMediaStrategy",
  components: { SiderElMenu, SiderElMenuSubItem },
  data() {
    return {};
  },
  watch: {},
  computed: {
    ...mapState("permissions", ["strategyManage_permission"])
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
    &.icon-media-recommend {
      background: url("~@/assets/image/menu/favourite.png");
    }
  }
  &.is-active {
    .icon {
      &.icon-media-recommend {
        background: url("~@/assets/image/menu/favourite-active.png");
      }
    }
  }
}
</style>
<style lang="scss">
</style>


