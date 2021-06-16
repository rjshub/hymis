<template>
  <div class="medium-content"
    v-loading='isLoading'>
    <div class="clearfix breadcrumb-wrap">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="firstBreadcrumbPath">
          <span class="breadcrumb-item-line">|</span>{{$t('lang.media_breadcrumb')}}
        </el-breadcrumb-item>
        <el-breadcrumb-item v-if="secondBreadcrumbName">{{secondBreadcrumbName}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div style="position: relative;"
      v-if="!$route.meta.noSubNav">
      <el-menu mode="horizontal"
        :router='true'
        :default-active="$route.meta.subNav">
        <el-menu-item index="/strategy/medium/media-cph-rank">{{$t('lang.third_nav_media_ranking')}}</el-menu-item>
        <el-menu-item index="/strategy/medium/point-cph-rank">{{$t('lang.third_nav_position_ranking')}}</el-menu-item>
        <el-menu-item index="/strategy/medium/media-cover-rank">{{$t('lang.third_nav_device_coverage_ranking')}}</el-menu-item>
        <el-menu-item index="/strategy/medium/media-coincide">{{$t('lang.third_nav_media_overlap_ranking')}}</el-menu-item>
      </el-menu>
      <span class="hy-font-yellow" style="position: absolute;right: 0;top: 13px;">{{$t('lang.MS_title')}}</span>
    </div>

    <!-- <router-view></router-view> -->
    <router-view v-if="!$route.meta.keepAliveThree" />
    <keep-alive>
      <router-view v-if="$route.meta.keepAliveThree" />
    </keep-alive>

  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";

export default {
  name: "MediumManage",
  componentName: "MediumManage",
  components: {
    // CityCreate,
    // MediaCreate
  },
  data() {
    return {
      isLoading: false,
      isShowCityDialog: false,
      isShowMediaDialog: false,
      searchVal: "" //搜索的值
    };
  },
  props: {
    values: {
      type: Object,
      required: false,
      default: () => {
        return {};
      }
    }
  },
  created() {
    // this.$on("REFRESH", this.fetch_role_list);
  },

  mounted() {
    // console.log(this.$route);
  },
  computed: {
    ...mapState("system", ["agent_id"]),
    ...mapState("permissions", ["ruleManage_permission"]),
    secondBreadcrumbName() {
      return this.$route.query.media;
    },
    firstBreadcrumbPath(){
      let path = ''
      if (this.secondBreadcrumbName) {
        path = '/strategy/medium/media-cover-rank';
      }
      return { path }
    }
  },
  watch: {
    $route(n, o) {
      this.searchVal = "";
    },
    agent_id(n, o) {
      this.searchVal = "";
    }
  },

  methods: {
    /* clickMediaCoverRank(){
      this.$eventHub.$emit("REFRESH-DATA");
    }, */
    async download() {
      let urlMap = {
        SystemRuleMediaManage: "/medias/download",
        SystemRuleCityManage: "/markets/download"
      };
      let name = this.$route.name;
      let url = urlMap[name];
      if (url) {
        let res = await this.fetchCore(url);
        this.$downloadFile("api/" + res);
      }
    },
    onNewCity() {
      this.isShowCityDialog = true;
      // this.editRoleId = "";
    },
    onNewMedia() {
      this.isShowMediaDialog = true;
    },

    onEdit(obj) {
      this.isShowDialog = true;
      this.editRoleId = obj.id;
    },
    search() {
      this.$broadcast("RuleManageChild", "onSearch", this.searchVal);
    },
    async fetchCore(url, data, hasLoading = true) {
      hasLoading && (this.isLoading = true);
      try {
        let _data = await fetch.post(url, data);
        return _data;
      } catch (err) {
        this.$message.error(err.message);
        throw err;
      } finally {
        hasLoading && (this.isLoading = false);
      }
    },
    test() {}
  }
};
</script>
<style scoped lang="scss">
.medium-content {
  margin-right: 20px;
  margin-left: 20px;
  // padding-top: 31px;
}
</style>
<style>
/*全局部分*/
</style>
<style lang="scss">
.medium-content {
  .el-tabs--border-card {
    background-color: #131d29;   
    border-color: transparent;
    > .el-tabs__header {
      background-color: #131d29;   
      border-color: transparent;
      border-bottom: 1px solid #5b616a;
      .el-tabs__item {
        font-size: 12px;
        &.is-active {
          color: #42a996;
          border-color: transparent;
          border-bottom: 2px solid #42a996;
          background-color: #131d29;  
        }
        &:not(.is-disabled):hover {
          color: #42a996;
        }
      }
    }
    > .el-tabs__content {
      padding: 0;
    }
  }
  .sort {
    .el-input.el-input--mini {
      width: 70px;
      margin-left: 5px;
      .el-input__inner {
        padding: 0 3px;
        text-align: center;
      }
      .el-input-group__append {
        padding: 0 6px;
        background-color: #383a40;  
        cursor: pointer;
      }
    }
    [class^="icon-"] {
      display: inline-block;
      width: 15px;
      height: 15px;
      cursor: pointer;
      background-repeat: no-repeat;
      vertical-align: middle;
      opacity: 0.8;
      color: white;
      margin-right: 3px;
      &:hover {
        opacity: 1;
      }
    }
    .icon-first {
      background: url("~@/assets/image/uppest.png");
    }
    .icon-up {
      background: url("~@/assets/image/up.png");
    }
    .icon-down {
      background: url("~@/assets/image/down.png");
    }
    .icon-last {
      background: url("~@/assets/image/downest.png");
    }
  }

  .el-menu--horizontal {
    background-color: #131d29;    /*背景调换，媒介推荐导航栏背景*/
    border-bottom: 1px solid #5b616a;
    .el-menu-item {
      font-size: 12px;
      height: 40px;
      line-height: 40px;
      &:not(.is-disabled):hover {
        color: #42a996;
        background-color: #131d29;    /*背景调换，媒介推荐导航栏hover背景*/
      }
      &:not(.is-disabled):focus {
        background-color: #131d29;    /*背景调换，媒介推荐导航栏点击，active背景*/

      }
      &.is-active {
        border-bottom: 2px solid #42a996;
        color: #42a996;
      }
    }
  }
  .table-scope-header {
    display: inline-block;
    line-height: 17px;
    vertical-align: middle;
    padding-left: 0;
    white-space: normal;
    word-break: break-all;
    img.help {
      width: 16px;
      vertical-align: text-bottom;
      margin-left: 4px;
      opacity: 0.8;
      &:hover {
        opacity: 1;
      }
    }
  }
}
</style>