<template>
  <div class="media-content"
    v-loading='isLoading'>
    <log-win :list='pbsUpdateList' class="msg-win" direction='bottom' height='122' />
    <div class="clearfix breadcrumb-wrap">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '' }">
          <span class="breadcrumb-item-line">|</span>{{$t('lang.secondary_nav_medium_manage')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="clearfix">

      <template v-if="ruleManage_permission==1">
        <el-button icon="el-icon-plus pull-left"
          style="margin-right: 8px;"
          @click="onNewMedia">{{$t('lang.system_rule_add_media')}}</el-button>
        <el-button icon="el-icon-plus pull-left"
          @click="onNewPoint">{{$t('lang.system_media_add_position')}}</el-button>
      </template>
    </div>

    <div style="position: relative;">
      <el-menu mode="horizontal"
        :router='true'
        :default-active="$route.meta.subNav">
        <el-menu-item index="/system/media-manage/media-list">{{$t('lang.system_rule_media_list')}}</el-menu-item>
        <el-menu-item index="/system/media-manage/point-list">{{$t('lang.system_media_position_list')}}</el-menu-item>
      </el-menu>

    </div>

    <router-view></router-view>

    <media-create-edit v-if="isShowMediaDialog"
      :isShow.sync="isShowMediaDialog"
      id='' />
    <point-create-edit v-if="isShowPointDialog"
      :isShow.sync="isShowPointDialog"
      id='' />
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";
// import CityCreate from "./city/create-edit";
import MediaCreateEdit from "./media/create-edit";
import PointCreateEdit from "./point/create-edit";
import logWin from "@/views/public/log-win";

export default {
  name: "RuleManage",
  componentName: "RuleManage",
  components: {
    // CityCreate,
    MediaCreateEdit,
    PointCreateEdit,
    logWin
  },
  data() {
    return {
      pbsUpdateList:[],
      // levelOneAssList:[],
      // levelTwoAssList:[],
      isLoading: false,
      isShowPointDialog: false,
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
    this.getNoticeList();
    // this.getSelectList();
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
    async getNoticeList() {
      let arr = await this.fetchCore('/position/noticelist');
      this.pbsUpdateList = arr.map(x =>{
        return {name:x}
      });
      if (this.pbsUpdateList.length==0) {
        this.pbsUpdateList = [{name: this.$t('lang.public_no_update_text')}]
      }
    },
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
    onNewPoint() {
      this.isShowPointDialog = true;
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
.media-content {
  margin-right: 20px;
  margin-left: 20px;
  position: relative;
  // padding-top: 31px;
}
.msg-win{
  position: absolute;
  right: 0;
  z-index: 1;
  top: 8px;
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
  right: 1px;
  top: 9px;
  font-size: 20px;
  /* padding: 4px; */
  display: inline-block;
  color: #fff;
  cursor: pointer;
  opacity: 0.6;
  &:hover {
    opacity: 0.8;
  }
}
</style>
<style>
/*全局部分*/
</style>
<style lang="scss">
.media-content {
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
      // vertical-align: middle;
      opacity: 0.8;
      color: white;
      margin-right: 3px;
      font-size: 66px;
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
      line-height: 12px;
      &:hover {
        opacity: 0.8;
      }
      &:first-child {
        margin-left: 0px;
      }
    }
  }
  .el-menu--horizontal {
    background-color: #131d29;
    border-bottom: 1px solid #5b616a;
    .el-menu-item {
      font-size: 12px;
      height: 40px;
      line-height: 40px;
      &:not(.is-disabled):hover {
        color: #42a996;
        background-color: #131d29;
      }
      &:not(.is-disabled):focus {
        background-color: #131d29;
      }
      &.is-active {
        border-bottom: 2px solid #42a996;
        color: #42a996;
      }
    }
  }
}
</style>