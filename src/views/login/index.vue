<template>
    <div class="g__wrap"
        id="login-wrap">
        <div class="login_header_wrap">
            <div class="login_header">
                <div class="title">
                    <img src="~@/assets/image/logo-mis.png"
                        alt />
                </div>
                <div class="language">
                    <a href="http://www.hylink.com/">华扬HDTC官网</a>
                    <div class="line"></div>
                    <div class="language-zone">
                        <el-dropdown trigger="click">
                            <i class="iconfont"
                                style="color: rgba(255, 255, 255, 1);display:block;width:25px"
                                :class="`icon-${languageInfo}`"></i>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item :disabled="loading"
                                    @click.native="change_language('zh')">中文</el-dropdown-item>
                                <el-dropdown-item :disabled="loading"
                                    @click.native="change_language('en')">English</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>

                </div>
            </div>
        </div>
        <div class="login_scroll">
            <div class="login_main">
                <el-row>
                    <el-col :span="16">
                        <div class="hyMis-introduce">
                        <div>
                                <span class="hyMis-title" v-if="$t('lang.overall_language') === 'chinese'">华扬媒体智能规划系统</span>
                                <span class="hyMis-title-eng" v-if="$t('lang.overall_language') === 'chinese'">Hylink Media Intelligent System</span>
                                <span class="hello-hymis" v-if="$t('lang.overall_language') === 'english'">Welcome to HYMIS</span>
                                <span class="hyMis-value"
                                    v-html="$t('lang.login_system_value')"></span>
                                <span class="hyMis-apply"
                                    v-html="$t('lang.login_system_apply')"></span>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="8">
                        <div class="login-box">
                            <div>
                                <div class="login-forn-title">{{$t('lang.login_form_title')}}</div>
                                <el-form class="login-form"
                                    :model="loginForm"
                                    @submit.native.prevent="onSubmit"
                                    ref="loginForm"
                                    :rules="form_rules"
                                    label-width="0px">
                                    <p class="error">{{errorText}}</p>

                                    <el-form-item class="login-form-wrap">
                                        <el-input :value="loginForm.username"
                                            @input.native="onInputUserName($event)"
                                            class="login-input"
                                            :class="{ errorinput: errorField=='username' }"
                                            autocomplete="on"
                                            :autofocus="true"
                                            :placeholder="$t('lang.login_username_placeholder')">
                                            <i slot="prefix"
                                                class="user-icon login-icon"></i>
                                        </el-input>
                                    </el-form-item>

                                    <el-form-item class="login-form-wrap">
                                        <el-input type="password"
                                            class="login-input"
                                            :class="{ errorinput: errorField=='password' }"
                                            autocomplete="on"
                                            :value="loginForm.password"
                                            @input.native="onInputPassword($event)"
                                            :placeholder="$t('lang.login_password_placeholder')">
                                            <i slot="prefix"
                                                class="password-icon login-icon"></i>
                                        </el-input>
                                    </el-form-item>

                                    <el-form-item class="login-form-wrap">
                                        <el-input v-model="loginForm.vcode"
                                            :value="loginForm.vcode"
                                            @input.native="onInputVcode($event)"
                                            class="login-input vcode-input"
                                            :class="{ errorinput: errorField=='vcode' }"
                                            :placeholder="$t('lang.login_vcode_placeholder')">
                                            <template slot="append">
                                                <img src="/api/login/vcode?t=2"
                                                    class="vcode"
                                                    ref="vcode"
                                                    @click="refresh_vcode"
                                                    :title="$t('lang.login_vcode_refresh')" />
                                            </template>
                                        </el-input>
                                    </el-form-item>

                                    <el-form-item>
                                        <el-button type="primary"
                                            :loading="loading"
                                            @click.enter="onSubmit">{{loginBtnText}}</el-button>
                                        <button type="submit"
                                            hidden>submit</button>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="login-footer">
            <layout-footer class="footer" />
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import _ from "lodash";
import AsyncValidator from "async-validator";
import LayoutFooter from "../layout/LayoutFooter";
export default {
  components: {
    LayoutFooter,
  },
  name: "Login",
  data() {
    return {
      errorArr: [],
      loading: false,
      loginBtnText: this.$t("lang.login_button_text"),
      loginForm: {
        username: "",
        password: "",
        vcode: "",
        language: ''
      },
      rules: {},
      // rules: {
      //   username: [
      //     { required: true, message: this.$t("lang.login_username_require"), trigger: "change" },
      //     {
      //       min: 2,
      //       max: 20,
      //       message: this.$t("lang.login_username_rule"),
      //       trigger: "change"
      //     }
      //   ],
      //   password: [
      //     { required: true, message: this.$t("lang.login_password_require"), trigger: "change" },
      //     {
      //       min: 8,
      //       max: 20,
      //       message: this.$t("lang.login_password_rule"),
      //       trigger: "change"
      //     }
      //   ],
      //   vcode: [
      //     { required: true, message: this.$t("lang.login_vcode_require"), trigger: "change" },
      //     { min: 4, max: 4, message: this.$t("lang.login_vcode_rule"), trigger: "change" }
      //   ]
      // }
    };
  },
  computed: {
    ...mapState("user", ["languageInfo"]),
    errorText() {
      if (Array.isArray(this.errorArr) && this.errorArr.length) {
        return this.errorArr[0]["message"];
      }
    },
    errorField() {
      if (Array.isArray(this.errorArr) && this.errorArr.length) {
        return this.errorArr[0]["field"];
      }
    },
    form_rules() {
      const rules = {
        username: [
          { required: true, message: this.$t("lang.login_username_require"), trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: this.$t("lang.login_username_rule"),
            trigger: "change",
          },
        ],
        password: [
          { required: true, message: this.$t("lang.login_password_require"), trigger: "change" },
          {
            min: 8,
            max: 20,
            message: this.$t("lang.login_password_rule"),
            trigger: "change",
          },
        ],
        vcode: [
          { required: true, message: this.$t("lang.login_vcode_require"), trigger: "change" },
          { min: 4, max: 4, message: this.$t("lang.login_vcode_rule"), trigger: "change" },
        ],
      };
      this.rules = rules;
      return rules;
    },
  },
  mounted() {
    this.$refs.vcode.click();
    this.resetForm();
  },
  methods: {
    ...mapActions("user", ["login","update_system_language_info"]),
    ...mapActions("permissions", ["fetch_permission"]),
    
    change_language(param) {
      // window.document.cookie = "language" + "=" + param;
      this.update_system_language_info(param);
      // let lang = this.$i18n.locale === "zh" ? "en" : "zh";
      this.$i18n.locale = param;
      this.loginBtnText = this.$t("lang.login_button_text");
      this.$refs.loginForm.clearValidate();
      this.errorArr = [];
    },
    onInputVcode($event) {
      this.loginForm.vcode = $event.target.value;
      this.triggerValidate("vcode");
    },
    onInputPassword($event) {
      this.loginForm.password = $event.target.value;
      this.triggerValidate("password");
    },
    onInputUserName($event) {
      this.loginForm.username = $event.target.value;
      this.triggerValidate("username");
    },
    validateCustom(type) {
      return new Promise((resolve, reject) => {
        let rules = _.cloneDeep(this.rules);
        if (type && rules[type] && Array.isArray(rules[type])) {
          let tem = _.cloneDeep(rules[type]);
          rules = {};
          rules[type] = tem;
        }
        let validator = new AsyncValidator(rules);
        validator.validate(this.loginForm, (errors, fields) => {
          resolve(errors);
        });
      });
    },
    refresh_vcode() {
      this.$refs.vcode.src = "/api/login/vcode?t=2&random=" + (new Date() - 0);
    },
    onSubmit() {
      // console.log("---onSubmit");
      // debugger;
      this.triggerValidate().then((err) => {
        if (err == null) {
          // debugger;
          this.triggerLogin();
        }
      });
    },
    triggerValidate(type) {
      return new Promise((resolve, reject) => {
        this.validateCustom(type).then((errors) => {
          this.errorArr = [];
          this.errorArr = errors;
          // console.log(errors);
          resolve();
        });
      });
    },
    triggerLogin() {
      this.triggerLoading(true);
      this.loginForm.language = this.languageInfo
      this.login(this.loginForm)
        .then(() => {
          this.triggerLoading(false);
          this.fetch_permission();
          this.$router.replace("/project");
        })
        .catch((err) => {
          this.$refs.vcode.click();
          this.triggerLoading(false);
          this.$message({
            type: "error",
            message: err.message,
            duration: 3000,
            showClose: true,
          });
        });
    },
    triggerLoading(flag) {
      this.loading = flag;
      this.loginBtnText = flag ? this.$t("lang.login_button_text_ing") : this.$t("lang.login_button_text");
    },
    resetForm() {
      this.loginForm = {
        username: "",
        password: "",
        vcode: "",
        language: ''
      };
    },
  },
};
</script>

<style lang="scss">
#login-wrap .el-input__inner {
  border-radius: 0;
  height: 38px;
  border: 1px solid #c2c2ca;
  color: #333;
}
#login-wrap .errorinput .el-input__inner {
  color: #333;
}
#login-wrap .vcode-input {
  .el-input__inner {
    width: 75%;
  }
}
#login-wrap .el-form-item__content .el-button {
  width: 100%;
  border-radius: 0;
  padding: 10px;
  background-color: #43a896;
  border-color: #43a896;
}
</style>
<style scoped>
#login-wrap {
  min-width: 1280px;
  background-image: url("~@/assets/image/login/bg.jpg");
  background-size: cover;
  justify-content: center;
  align-items: Center;
  display: flex;
}
.login-icon {
  display: block;
  width: 16px;
  height: 16px;
  margin-top: 10px;
}
.user-icon {
  background-image: url("~@/assets/image/login/material-1.png");
  background-repeat: no-repeat;
}
.password-icon {
  background-image: url("~@/assets/image/login/account-1.png");
  background-repeat: no-repeat;
}
.footer {
  position: absolute;
  bottom: 20px;
  color: #efefef;
  font-size: 12px;
  text-align: center;
}
.error {
  /* color: #fc0; */
  color: #f56c6c;
  font-size: 12px;
  margin: 0 0 5px 2px;
  height: 20px;
}
</style>
<style scope lang="scss">
#login-wrap {
  flex-flow: column;
  .login_header_wrap {
    width: 100%;
    height: 78px;
    display: flex;
    justify-content: center;
    .login_header {
      width: 1280px;
      height: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title {
        width: 110px;
        height: 40px;
        margin-left: 20px;
        // img {
        //   display: block;
        //   width: 100%;
        //   height: 100%;
        // }
      }
      .language {
        display: flex;
        height: 17px;
        .line {
          height: inherit;
          width: 2px;
          background: #fff;
          margin: 0 10px;
        }
        a {
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          text-decoration: none;
        }
      }
    }
  }
  .login_scroll {
    flex: 1;
    width: 1280px;
    .login_main {
      height: 100%;
      div {
        height: 100%;
      }
      .hyMis-introduce {
        color: #fff;
        padding-left: 20px;
        display: flex;
        align-items: center;
        & > div {
          height: auto !important;
          display: flex;
          flex-flow: column;
        }
        .hyMis-title {
          font-size: 24px;
        }
        .hyMis-title-eng {
          font-size: 14px;
        }
        .hello-hymis {
          font-size: 36px;
        }
        .hyMis-value {
          margin: 20px 0;
        }
        .hyMis-apply {
          font-size: 16px;
        }
      }

      .login-box {
        padding-right: 20px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        & > div {
          width: 290px;
          height: 260px;
          padding: 30px 20px;
          background: #fff;
          box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.3);
          .login-forn-title {
            height: auto;
            font-size: 18px;
            color: #333;
          }
          .login-form {
            width: 290px;
            margin: 0 auto;
            .login-form-wrap {
              margin-bottom: 10px;
              .login-input {
                line-height: 38px;
                color: #333;
              }
              .el-input-group__append {
                border: unset;
                background: none;
              }
              .vcode {
                display: block;
                margin: 0px -18px;
                height: 38px;
                width: 100px;
              }
            }
          }
        }
      }
    }
  }
  .login-footer {
    width: 100%;
    height: 64px;
    display: flex;
    justify-content: center;
  }
}
</style>
