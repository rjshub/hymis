<template>
    <hy-dialog :visible="isShow"
        @update:visible='onUpdateVisible'
        custom-class='create-edit-user'
        :title="$t('lang.layout_info_title')"
        width='470px'>

        <div class="box"
            v-loading="isLoading">
            <el-form class="user-form"
                size="mini"
                ref="form"
                :model="form"
                :rules="rules"
                label-width="auto">

                <el-form-item :label="`${$t('lang.system_user_form.username')}:`"
                    prop="username">
                    {{form.username}}
                </el-form-item>

                <el-form-item :label="`${$t('lang.system_user_form.role_id')}:`"
                    prop="role_id">
                    {{form.role_name}}
                </el-form-item>

                <el-form-item :label="`${$t('lang.system_user_form.password')}:`"
                    prop="password" style="margin-bottom: 28px;width: 430px">
                    <el-input type='password'
                        v-model.trim="form.password"
                        :placeholder="$t('lang.system_user_not_change_password')">
                    </el-input>
                </el-form-item>

                <el-form-item :label="`${$t('lang.system_user_form.password_again')}:`"
                    v-show="!!form.password"
                    prop="password_again">
                    <el-input type='password'
                        v-model.trim="form.password_again"
                        :placeholder="$t('lang.public_enter_password_again_placeholder')">
                    </el-input>
                </el-form-item>

                <el-form-item :label="`${$t('lang.system_user_form.truename')}:`"
                    prop="truename">
                    <el-input v-model.trim="form.truename"
                        :placeholder="$t('lang.public_enter_true_name_placeholder')">
                    </el-input>
                </el-form-item>

                <el-form-item :label="`${$t('lang.system_user_form.phone')}:`"
                    prop="phone">
                    <el-input v-model.trim="form.phone"
                        :placeholder="$t('lang.public_phone_placeholder')">
                    </el-input>
                </el-form-item>

                <el-form-item :label="`${$t('lang.system_user_form.email')}:`"
                    prop="email">
                    <el-input v-model.trim="form.email"
                        :placeholder="$t('lang.public_email_placeholder')">
                    </el-input>
                </el-form-item>

            </el-form>
        </div>

        <div slot="footer">
            <el-button plain
                @click="onCancel">{{$t('lang.public_button_cancel')}}</el-button>
            <el-button @click="onSubmit">{{$t('lang.public_button_submit')}}</el-button>
        </div>
    </hy-dialog>
</template>

<script>
import _ from "lodash";
import fetch from "@/services/fetch";

export default {
  name: "CreateEdit",
  componentName: "CreateEdit",
  components: {},
  props: {
    isShow: {
      type: [Boolean],
      required: true
    },
    id: {
      //该值为空，表示新建，否则为编辑
      type: [Number, String],
      required: true
    }
  },
  data() {
    var validateEmail = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t('lang.public_email_placeholder')));
      } else {
        if (this.$constReg.email.test(value)) {
          callback();
        } else {
          callback(new Error(this.$t('lang.reg_email_error')));
        }
      }
    };
    var validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t('lang.public_phone_placeholder')));
      } else {
        if (this.$constReg.phone.test(value)) {
          callback();
        } else {
          callback(new Error(this.$t('lang.reg_phone_error')));
        }
      }
    };
    var validateTruename = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t('lang.public_enter_true_name_placeholder')));
      } else {
        if (value.length > 25) {
          callback(new Error(this.$t('lang.reg_true_name_length_error')));
        } else {
          if (this.$constReg.cnenName.test(value)) {
            callback();
          } else {
            callback(new Error(this.$t('lang.reg_true_name_error')));
          }
        }
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback();
      } else {
        if (value.length > 20 || value.length < 8) {
          callback(new Error(this.$t('lang.reg_password_length_error')));  
        } else {
          if (this.$constReg.password.test(value)) {
            if (this.form.password_again !== "") {
              this.$refs.form.validateField("password_again");
            }
            callback();
          } else {
            callback(new Error(this.$t('lang.reg_password_rule_error')));
          }
        }
      }
    };
    var validatePassagain = (rule, value, callback) => {
      if (value === "") {
        if (this.form.password == "") {
          callback();
        } else {
          callback(new Error(this.$t('lang.public_enter_password_again_placeholder')));
        }
      } else if (value !== this.form.password) {
        callback(new Error(this.$t('lang.public_confirm_password_error')));
      } else {
        callback();
      }
    };
    return {
      roleList: [], //角色列表
      form: {
        username: "",
        password: "",
        password_again: "",
        truename: "",
        phone: "",
        email: ""
      },
      isLoading: false,
      rules: {
        password: [{ required: true, validator: validatePass, trigger: "blur" }],
        password_again: [{ required: true, validator: validatePassagain, trigger: "blur" }],
        truename: [{ required: true, validator: validateTruename, trigger: "blur" }],
        phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
        email: [{ required: true, validator: validateEmail, trigger: "blur" }]
      }
    };
  },
 
  watch: {},
  created() {
      this.inintEdit();
  },
  mounted() {},
  methods: {
    onUpdateVisible(val) {
      this.$emit("update:isShow", val);
    },
    onCancel() {
      this.$emit("update:isShow", false);
    },
    onSubmit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.fetchNewEdit();
        } else {
          return false;
        }
      });
    },
    setRules() {
      this.rules.password[0]["required"] = false;
      this.rules.password_again[0]["required"] = false;
    },
    inintEdit() {
      this.fetchGetInfo();
      this.setRules();
    },

    //type: edit编辑  new新建
    async fetchNewEdit() {
      this.isLoading = true;
      let param = {
        username:this.form.username,
        role_id: this.form.role_id,
        password:this.form.password,
        password_again:this.form.password_again,
        truename: this.form.truename,
        phone: this.form.phone,
        email:this.form.email,
        uid: this.id,
      }
      try {
        let data = await fetch.post("/user/edit", param);
        this.$emit("save",{data});
        this.onCancel();
      } catch (err) {
        this.$message.error(err.message);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },

    async fetchGetInfo() {
      try {
        this.isLoading = true;
        let uid = this.id;
        let data = await fetch.post("/user/userdetail", { uid });
        this.isLoading = false;
        // this.form = data;
        //这样至少为了防止后端返回字段缺少的问题
        Object.assign(this.form, data);
      } catch (err) {
        this.$message.error(err.message);
        throw err;
      }
    }
  }
};
</script>
<style scoped>
.box {
  padding: 30px 20px 6px 20px;
  color: #aaa9af;
  /* height: 330px; */
}
.box >>> .text {
  font-size: 12px;
}
</style>
<style>
.user-form label {
  color: #9498a1;
}
</style>