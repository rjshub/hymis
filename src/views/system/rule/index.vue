<template>
  <div class="rule-content"
    v-loading='isLoading'>
    <div class="clearfix breadcrumb-wrap">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '' }">
          <span class="breadcrumb-item-line">|</span>{{$t('lang.secondary_nav_OTV_OTT_rules_manage')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="clearfix">

      <template v-if="ruleManage_permission==1">
        <el-button icon="el-icon-plus pull-left"
          style="margin-right: 8px;"
          @click="onNewCity">{{$t('lang.system_rule_add_city')}}</el-button>
        <el-button icon="el-icon-plus pull-left"
          @click="onNewMedia">{{$t('lang.system_rule_add_media')}}</el-button>
      </template>
      <el-input size="mini"
        v-show='$route.name!="SystemRuleBaseNumManage"'
        class="pull-right"
        style="width:180px;vertical-align:bottom;"
        :placeholder="$t('lang.public_key_words')"
        v-model="searchVal"
        @keyup.enter.native="search">
        <i slot="prefix"
          class="el-input__icon el-icon-search"
          @click="search"
          style="cursor: pointer;"></i>
      </el-input>
    </div>

    <div style="position: relative;">
      <el-menu mode="horizontal"
        :router='true'
        :default-active="$route.meta.subNav">
        <el-menu-item index="/system/rule/city">{{$t('lang.system_rule_city_list')}}</el-menu-item>
        <el-menu-item index="/system/rule/media">{{$t('lang.system_rule_media_list')}}</el-menu-item>
        <!-- <el-menu-item index="/system/rule/basenum">保底基数管理</el-menu-item> -->
      </el-menu>

      <!-- <el-button @click="download"
        v-show='$route.name!="SystemRuleBaseNumManage"'
        plain
        class="download-btn">导出</el-button> -->
        <span class="hy-down-load-icon download-btn" :title="$t('lang.AS_detail_download_excel')" @click="download" v-show='$route.name!="SystemRuleBaseNumManage"'>
            <i class="iconfont icon-list-download"></i>
        </span>
    </div>

    <router-view></router-view>

    <city-create v-if="isShowCityDialog"
      :isShow.sync="isShowCityDialog"
      :isNew='true' />
    <media-create v-if="isShowMediaDialog"
      :isShow.sync="isShowMediaDialog"
      :isNew='true' />
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";
import CityCreate from "./city/create-edit";
import MediaCreate from "./media/create-edit";

export default {
  name: "RuleManage",
  componentName: "RuleManage",
  components: {
    CityCreate,
    MediaCreate
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
    ...mapState("permissions", ["ruleManage_permission"])
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
.rule-content {
  margin-right: 20px;
  margin-left: 20px;
  // padding-top: 31px;
}

.operate i {
  margin-left: 20px;
  margin-top: 12px;
  cursor: pointer;
  opacity: 0.6;
  display: inline-block;
  color: white;
  font-size: 30px;
  width: 24px;
  height: 24px;
  line-height: 12px;
  &:hover {
    opacity: 0.8;
  }
}
.download-btn {
  position: absolute;
  right: 0px;
  top: 8px;
}
</style>
<style>
/*全局部分*/
</style>
<style lang="scss">
.rule-content {
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
        background-color: #383a40;   /*背景调换，系统管理-》规则管理-》列表排序操作-》go操作背景*/
        cursor: pointer;
      }
    }
    [class^="icon-"] {
      display: inline-block;
      width: 15px;
      height: 15px;
      cursor: pointer;
      background-repeat: no-repeat;
      // vertical-align: middle;
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
  .operate {
    i {
      margin-left: 20px;
      margin-top: 12px;
      cursor: pointer;
      opacity: 0.6;
      display: inline-block;
      color: white;
      font-size: 30px;
      width: 24px;
      height: 24px;
      line-height: 12PX;
      &:hover {
        opacity: 0.8;
      }
      &:first-child {
        margin-left: 0px;
      }
    }
  }
  .el-menu--horizontal {
    background-color: #131d29;  /*背景调换，系统管理-》规则管理-》tab导航背景*/
    border-bottom: 1px solid #5b616a;
    .el-menu-item {
      font-size: 12px;
      height: 40px;
      line-height: 40px;
      &:not(.is-disabled):hover {
        color: #42a996;
        background-color: #131d29;  /*背景调换，系统管理-》规则管理-》tab导航hover背景*/
      }
      &:not(.is-disabled):focus {
        background-color: #131d29;  /*背景调换，系统管理-》规则管理-》tab导航active背景*/
      }
      &.is-active {
        border-bottom: 2px solid #42a996;
        color: #42a996;
      }
    }
  }
}
</style>