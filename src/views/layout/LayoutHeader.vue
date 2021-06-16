<template>
    <div class="g__header_wrap"
        v-loading.fullscreen.lock="isLoading">
        <div class="g__header">
            <div class="logo-zone">
                <div class="logo-zone__item">
                    <!-- style="width:142px;" -->
                    <img @click="jump"
                        src="~@/assets/image/logo-mis.png" />
                </div>
            </div>
            <nav-head />
            <div class="info-zone">
                <div class="info-zone__item">
                    <el-dropdown trigger="click"
                        style="position: relative;top: 2px;">
                        <span class="el-dropdown-link name">
                            <div class="capsule">
                                <span class="username"
                                    :title="truename">{{truename}}</span>
                                <div class="user-img-box">
                                    <!-- <img src="~@/assets/image/user.png" /> -->
                                    <i class="iconfont icon-user"></i>
                                </div>
                            </div>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="personInfo">{{$t('lang.layout_info_title')}}</el-dropdown-item>
                            <el-dropdown-item>
                                {{$t('lang.layout_skin')}}
                                <el-select v-model="theme_value"
                                    class="theme-select">
                                    <el-option :label="$t('lang.layout_skin_dark')"
                                        value="dark-theme"
                                        @click.native="change_skin('dark')"></el-option>
                                    <el-option :label="$t('lang.layout_skin_light')"
                                        value="default-theme"
                                        @click.native="change_skin('default')"></el-option>
                                </el-select>
                            </el-dropdown-item>
                            <el-dropdown-item @click.native="logout">{{$t('lang.layout_logout')}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>

            <div class="help-zone">
                <div class="help-zone__item">
                    <!-- <img @click="gotoHelp"
            title="点击下载系统操作手册"
            src="~@/assets/image/help.png" /> -->
                    <i @click="gotoHelp"
                        :title="$t('lang.layout_help_tooltip')"
                        class="iconfont icon-help"></i>
                </div>
            </div>
            <!-- 切换语言 -->
            <div class="skin-zone">
                <el-dropdown trigger="click">
                    <div class="skin-zone__item">
                        <i class="iconfont"
                            :class="`icon-${languageInfo}`"></i>
                    </div>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="change_language('zh')">中文</el-dropdown-item>
                        <el-dropdown-item @click.native="change_language('en')">English</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div v-if="isRoot"
                class="agent_info"
                v-show="showAgentList"
                style="float: right;margin-right: 15px;width: 150px">
                <el-select v-model="localAgent"
                    :disabled="c_disabled"
                    size="mini"
                    style='height: 28px;
          line-height: 28px;'
                    filterable
                    @change='onChangeAgent'
                    :placeholder="$t('lang.layout_agent_placeholder')">
                    <el-option v-for="item in agentList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"></el-option>
                </el-select>
            </div>
        </div>

        <!-- 帮助dialog -->
        <operate-guide v-if="isShowHelpDialog"
            :isShow.sync="isShowHelpDialog"></operate-guide>

        <person-info v-if='isShowPersonInfo'
            :id="user_id"
            :isShow.sync="isShowPersonInfo"
            @save="handleEditSuccess" />
    </div>
</template>
<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";
import operateGuide from "@/views/public/operate-guide";
import personInfo from "@/views/system/person";
import navHead from "./NavHead";
import theme from "@/mixin/theme.vue";
// import colorList from '@/views/mixin/theme/index.vue'

export default {
  name: "LayoutHeader",
  components: {
    operateGuide,
    personInfo,
    navHead,
  },
  mixins: [theme],
  data() {
    return {
      isLoading: false,
      theme_value: "",
      localAgent: "",
      localAgent_tem: "",
      path: "",
      isShowHelpDialog: false,
      isShowPersonInfo: false,
    };
  },
  created() {
    this.path = this.$route.path;
  },
  mounted() {},
  watch: {
    agent_id: {
      handler: function (val, oldVal) {
        this.localAgent = val;
      },
      immediate: true,
    },
  },
  computed: {
    ...mapState("theme", ["nowThemeInfo"]),
    ...mapState("system", ["agentList", "agent_id"]),
    ...mapGetters("user", ["isRoot"]),
    ...mapState("user", ["languageInfo", "username", "truename", "role", "isFirstVisit", "user_id"]),
    c_disabled() {
      return this.$route.name == "ProjectCreate" || this.$route.name === 'BudgetCreate';
    },
    showAgentList() {
      let enableUrlName = [
        "ProjectManage",
        "ProjectCreate",
        "ProjectArchive",
        "BudgetManage",
        "BudgetCreate",
        "SystemCustomerManage",
        "SystemRuleCityManage",
        "SystemRuleMediaManage",
        "SystemRuleBaseNumManage",
        "SystemOperatelogManage",
      ];
      return enableUrlName.includes(this.$route.name);
    },
  },
  methods: {
    ...mapMutations("user", ["UPDATE_ISFIRST_VISIT", "UPDATE_TRUENAME"]),
    ...mapActions("system", ["update_agent_id","update_active_route"]),
    ...mapActions("user", ["update_system_language_info"]),
    ...mapActions("theme", ["update_now_theme_info"]),
    jump() {},
    async onChangeAgent() {
      this.isLoading = true;
      try {
        let agent_id = this.localAgent;
        await fetch.post("/agent/changeagent", { agent_id });
        this.update_agent_id(agent_id);
      } catch (err) {
        this.localAgent = this.agent_id;
        this.$message.error(err.message);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
    personInfo() {
      this.isShowPersonInfo = true;
    },
    logout() {
      this.$confirm(this.$t("lang.layout_logout_confirm"), this.$t("lang.public_dialog_point"), {
        confirmButtonText: this.$t("lang.public_button_confirm"),
        cancelButtonText: this.$t("lang.public_button_cancel"),
        type: "warning",
      }).then(() => {
        this.$router.push({
          path: "/logout",
        });
        this.update_active_route("")
        this.update_system_language_info("zh");
        localStorage.setItem("isExpires", "0");
      });
    },
    gotoHelp() {
      this.$confirm(this.$t("lang.layout_download_operation_manual"), this.$t("lang.public_dialog_point"), {
        confirmButtonText: this.$t("lang.public_button_confirm"),
        cancelButtonText: this.$t("lang.public_button_cancel"),
        type: "warning",
      }).then(() => {
        this.$downloadFile("/api/hymis-handbook.pdf");
      });
    },
    handleEditSuccess({ data }) {
      this.UPDATE_TRUENAME(data.truename);
    },
    // 切换主题
    change_skin(param) {
      this.update_now_theme_info(param);
    },
    // 切换语言
    async change_language(language) {
      const routerNames = ["SystemOperatelogManage", "BudgetManage","BudgetCreate", "ProjectCreate", "ProjectManage", "ProjectArchive", "MediaDetail"];
      const url = "user/checklanguage";
      const param = {
        language: language,
      };

      const data = await fetch.post(url, param);
      if (data) {
        if (routerNames.includes(this.$route.name)) {
          window.location.reload();
        }
        this.update_system_language_info(language);
        // let lang = this.$i18n.locale === "zh" ? "en" : "zh";
        this.$i18n.locale = language;
      }
    },
    // set_user_language() {
    //   const url = "user/checklanguage";
    // },
  },

  mounted() {
    this.$nextTick(() => {
      this.theme_value = this.nowThemeInfo;
      //是首次访问
      // const map = {
      //   "dark-theme": 'dark',
      //   "default-theme": 'default'
      // }
      // const param = map[this.nowThemeInfo]
      // this.update_now_theme_info(param);
      // if (this.isFirstVisit) {
      //   this.gotoHelp();
      //   this.UPDATE_ISFIRST_VISIT("0");
      // }
    });
    // console.log(this);
  },
};
</script>
<style lang="scss">
@import "../../assets/css/theme/mixin.scss";
.theme-select {
  margin-left: 40px;
  .el-input__inner {
    width: 120px;
    height: 25px;
  }
}

.agent_info,
.logo-zone,
.skin-zone,
.info-zone,
.help-zone {
  height: 100%;
  display: flex;
  align-items: center;
}
.logo-zone {
  float: left;
  margin-left: 20px;
  height: 100%;
  display: flex;
  align-items: center;
}
.skin-zone,
.info-zone,
.help-zone {
  float: right;
}
.info-zone {
  margin-right: 20px;
}
.help-zone {
  margin-right: 20px;
}
.skin-zone {
  margin-right: 10px;
}
.info-zone .name {
  color: #ddd;
}
.logo-zone__item,
.help-zone__item,
.skin-zone__item,
.info-zone__item {
  display: table-cell;
  // height: 70px;
  vertical-align: middle;
  cursor: pointer;
}
.info-zone__item {
  /* padding: 0 0 0 30px; */
}
/* .info-zone__item i, */
/* .help-zone__item i { */
/* display: block; */
/* opacity: 0.6; */
/* } */
.help-zone__item i:hover {
  opacity: 0.8;
}
.info-zone__item i,
.help-zone__item i,
.skin-zone__item i {
  color: #fff;
  font-size: 30px !important;
  line-height: 70px;
  opacity: 0.6;
}
.info-zone__item i {
  line-height: 32px;
}
.skin-zone__item i:hover {
  opacity: 0.8;
}
.capsule {
  height: 32px;
  background-color: #232c33;
  border-top-right-radius: 16px;
  border-bottom-right-radius: 16px;
  /* width: 100px; */
  position: relative;
  line-height: 32px;
  padding-left: 26px;
  padding-right: 9px;
  text-align: center;
}
.capsule:hover .user-img-box i {
  opacity: 0.8;
}
.user-img-box {
  width: 32px;
  height: 32px;
  margin-left: -13px;
  background-color: #0f161c;
  border-radius: 16px;
  border: 2px solid #0f161c;
  position: absolute;
  top: -2px;
  left: 0px;
}
.username {
  padding: 0 10px;
  max-width: 100px;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
