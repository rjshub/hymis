<template>
  <hy-dialog :visible="isShow"
    @update:visible='onUpdateVisible'
    custom-class='create-edit-user'
    :title="isNew? $t('lang.system_user_add_title'):$t('lang.system_user_edit_title')"
    width='470px'>

    <div class="box"
      v-loading="isLoading">
      <el-form class="user-form"
        size="mini"
        ref="form"
        :model="form"
        :rules="rules"
        label-width="auto">

        <el-form-item :label="`${$t('lang.system_user_form_config.username')}:`"
          prop="username">
          <el-input v-model.trim="form.username"
            :placeholder="$t('lang.public_enter_user_name_placeholder')">
          </el-input>
        </el-form-item>

        <el-form-item :label="`${$t('lang.system_user_form_config.role_id')}:`"
          prop="role_id">
          <el-select v-model="form.role_id"
            style="width: 200px;float: left;"
            :placeholder="$t('lang.public_select_role_placeholder')"
            :disabled="!isNew&&agentLevel==1"
            size="mini"
            filterable>
            <el-option v-for="item in roleList"
              :key="item.id"
              :label="item.role_name"
              :value="item.id">
            </el-option>
          </el-select>
          <span class="agent-name" v-if="isRoot">{{agent_name}}</span>
        </el-form-item>

        <el-form-item :label="`${$t('lang.system_user_form_config.password')}:`"
          prop="password" style="margin-bottom: 28px;width: 430px">
          <el-input type='password'
            v-model.trim="form.password"
            :placeholder="isNew? $t('lang.public_enter_password_placeholder'):$t('lang.system_user_not_change_password')">
          </el-input>
        </el-form-item>

        <el-form-item :label="`${$t('lang.system_user_form_config.password_again')}:`"
          v-show="isNew||!!form.password"
          prop="password_again">
          <el-input type='password'
            v-model.trim="form.password_again"
            :placeholder="$t('lang.public_enter_password_again_placeholder')">
          </el-input>
        </el-form-item>

        <el-form-item :label="`${$t('lang.system_user_form_config.truename')}:`"
          prop="truename">
          <el-input v-model.trim="form.truename"
            :placeholder="$t('lang.public_enter_true_name_placeholder')">
          </el-input>
        </el-form-item>

        <el-form-item :label="`${$t('lang.system_user_form_config.phone')}:`"
          prop="phone">
          <el-input v-model.trim="form.phone"
            :placeholder="$t('lang.public_phone_placeholder')">
          </el-input>
        </el-form-item>

        <el-form-item :label="`${$t('lang.system_user_form_config.email')}:`"
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
import { mapState, mapGetters, mapActions } from "vuex";
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
    var validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t('lang.public_enter_user_name_placeholder')));
      } else {
        if (value.length > 20 || value.length < 2) {
          callback(new Error(this.$t('lang.reg_username_length_error')));
        } else {
          if (this.$constReg.name.test(value)) {
            callback();
          } else {
            callback(
              new Error(this.$t('lang.reg_username_error_msg'))
            );
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
            callback(
              new Error(this.$t('lang.reg_password_rule_error'))
            );
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
      agentLevel:'',
      roleList: [], //角色列表
      form: {
        username: "",
        role_id: "",
        password: "",
        password_again: "",
        truename: "",
        phone: "",
        email: ""
      },
      isLoading: false,
      rules: {
        username: [
          { required: true, validator: validateUsername, trigger: "blur" }
        ],
        role_id: [
          { required: true, message: this.$t('lang.public_select_role_placeholder'), trigger: "change blur" }
        ],
        password: [
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        password_again: [
          { required: true, validator: validatePassagain, trigger: "blur" }
        ],
        truename: [
          { required: true, validator: validateTruename, trigger: "blur" }
        ],
        phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
        email: [{ required: true, validator: validateEmail, trigger: "blur" }]
        // budget: [{ validator: validateBudget, required: true, trigger: "change" }],
      }
    };
  },

  computed: {
    ...mapGetters("user", ["isRoot"]),
    isNew() {
      return !this.id;
    },
    agent_name(){
      let id = this.form.role_id
      let name = ''
      if (id) {
        let obj = this.roleList.find(i=>i.id==id)
        if (obj) {
          name = obj.agent_name
        }
      }
      return name
    },
  },
  watch: {},
  created() {
    if (this.isNew) {
      this.initNew();
    } else {
      this.inintEdit();
    }
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
          let type = this.isNew ? "new" : "edit";
          this.fetchNewEdit(type);
        } else {
          return false;
        }
      });
    },
    setRules() {
      this.rules.password[0]["required"] = false;
      this.rules.password_again[0]["required"] = false;
    },
    async inintEdit() {
      await this.fetchGetInfo();
      await this.fetchRoleList();
      this.setRules();
    },
    initNew() {
      this.fetchRoleList();
    },
    //type: edit编辑  new新建
    async fetchNewEdit(type) {
      let url = "/login/register";
      let param = _.cloneDeep(this.form);
      if (type == "edit") {
        url = "/user/edit";
        param.uid = this.id;
      }
      this.isLoading = true;
      try {
        let data = await fetch.post(url, param);
        this.$emit("save");
        this.onCancel();
      } catch (err) {
        this.$message.error(err.message);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
    async fetchRoleList() {
      try {
        this.isLoading = true;
        let agent_level=this.agentLevel;
        let role_id = this.form.role_id;
        let data = await fetch.post("/role/roleselectlist",{agent_level,role_id});
        // console.log(data);
        this.isLoading = false;
        this.roleList = data;
      } catch (err) {
        this.$message.error(err.message);
        throw err;
      }
    },
    async fetchGetInfo() {
      try {
        this.isLoading = true;
        let uid = this.id;
        let data = await fetch.post("/user/userdetail", { uid });
        this.isLoading = false;
        if (data.role_id == "0") {
          data.role_id = "";
        }
        this.agentLevel = data.agent_level;
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
.agent-name{
  font-size: 12px;
  padding-left: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  float: left;
  width: 136px;
}
</style>
<style>
.user-form label {
  color: #9498a1;
}
</style>