<template>
  <hy-dialog :visible="isShow"
      @update:visible='onUpdateVisible'
      custom-class='brand-create-edit'
      v-loading='isLoading'
      :title="title_c"
      width='470px'>

    <div class="box"
        style="padding:24px 20px 20px;color:#939aa2;">

      <el-form size='mini'
          ref="form"
          :model="form"
          :rules="rules"
          class="form"
          label-width="auto">
        <el-form-item :label="`${$t('lang.public_project_name')}：`"
            prop="name">
          <el-input v-model="form.name"
              :placeholder="$t('lang.public_project_name_placeholder')"></el-input>
        </el-form-item>
        <div>
          <el-form-item :label="`${$t('lang.public_shortName_label')}：`"
              prop="shortName">
            <el-input v-model.trim="form.shortName"
                :placeholder="shortNamePlaceholder"></el-input>
          </el-form-item>
          <el-form-item label="LOGO："
              v-if="type=='brand'"
              prop="logo">
            <el-upload class="avatar-uploader"
                action="/api/upload/addbrandlogo"
                :multiple='true'
                :show-file-list="false"
                list-type="text"
                :on-success="handleAvatarSuccess"
                :on-error='handleAvatarError'
                accept='image/png,image/jpeg'
                :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl&&imageUrl!='api/'"
                  :src="imageUrl"
                  :alt="$t('lang.public_upload_picture')"
                  class="avatar">
              <i v-else
                  class="el-icon-plus avatar-uploader-icon"></i>
              <div slot="tip"
                  style="color: #939aa2"
                  class="el-upload__tip">{{$t('lang.public_upload_condition')}}</div>
            </el-upload>
          </el-form-item>
          <div class="error-msg">{{errorMsg}}</div>
        </div>
      </el-form>
    </div>

    <div slot="footer">
      <el-button plain
          @click="onCancel">{{$t('lang.public_button_cancel')}}</el-button>
      <el-button @click="onConfirm">{{$t('lang.public_button_confirm')}}</el-button>
    </div>
  </hy-dialog>
</template>
<script>
import _ from "lodash";
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import fetch from "@/services/fetch";

export default {
  name: "brand-create-edit",
  props: {
    type: {
      //brand  product
      type: [String],
      required: true
    },
    isNew: {
      //是否是新建 或者 编辑
      type: [Boolean],
      required: true,
      default: true
    },
    isShow: {
      type: [Boolean],
      required: true
    },
    id: {
      type: [Number, String],
      required: true
    },
    name: {
      type: [String],
      required: false
    },
    shortName: {
      type: [String],
      required: false
    },
    url: {
      type: [String],
      required: false
    }
  },
  data() {
    var validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t('lang.reg_name_required')));
      } else {
        if (value.length > 50) {
          callback(new Error(this.$t('lang.reg_name_length_error')));
        } else {
          if (!this.$constReg.cnenName4.test(value)) {
            callback(new Error(this.$t('lang.reg_name_error_msg')));
          } else {
            callback();
          }
        }
      }
    };
    var validateShortName = (rule, value, callback) => {
      if (value === "" && this.form.logo == "") {
        if (this.type == "brand") {
          this.errorMsg = this.$t('lang.reg_abbreviation_logo_required');
        } else {
          this.errorMsg = this.$t('lang.reg_abbreviation_required');
        }

        callback(new Error(" "));
        // callback(new Error("简称和Logo必须必填其一"));
      } else {
        this.errorMsg = "";
        if (value != "") {
          let numReg= /^[0-9]{1,}$/
          let enNumReg= /^[A-Za-z0-9]{1,}$/
          if (numReg.test(value)) {
            if (value.length > 4) {
              callback(new Error(this.$t('lang.reg_abbreviation_rule_error')));
            }else{
              callback();
            }
          }else{
            if (enNumReg.test(value)) {
              if (value.length > 2) {
                callback(new Error(this.$t('lang.reg_abbreviation_rule_error')));
              }else{
                callback();
              }
            }else{
              callback(new Error(this.$t('lang.reg_abbreviation_rule_error')));
            }
          }
          /* if (value.length > 2) {
            callback(new Error("简称只允许填写最多2位的英文大写字母"));
          } else {
            if (!this.$constReg.uppercaseEn.test(value)) {
              callback(new Error("简称只允许填写最多2位的英文大写字母"));
            } else {
              callback();
            }
          } */

        } else {
          callback();
        }
      }
    };

    var validateLogo = (rule, value, callback) => {
      if (value === "" && this.form.shortName == "") {
        this.errorMsg = this.$t('lang.reg_abbreviation_logo_required');
        callback(new Error(" "));
      } else {
        this.errorMsg = "";
        callback();
      }
    };
    return {
      isLoading: false,
      imageUrl: "",
      rules: {
        name: [{ required: true, validator: validateName, trigger: "blur" }],
        shortName: [{ required: false, validator: validateShortName, trigger: "blur" }],
        logo: [{ required: false, validator: validateLogo, trigger: "change" }]
      },
      form: {
        name: "",
        shortName: "",
        logo: ""
      },
      errorMsg: ""
    };
  },
  watch: {},
  computed: {
    shortNamePlaceholder(){
      let placeholder = this.$t('lang.public_shortName_placeholder');
      if (this.type == "brand") {
        placeholder = this.$t('lang.reg_abbreviation_logo_required');
      }
      return placeholder;
    },
    title_c() {
      let str = this.$t('lang.public_tooltip_edit');
      let str1 = this.$t('lang.public_product_label');
      if (this.isNew) {
        str = this.$t('lang.public_add');
      }
      if (this.type == "brand") {
        str1 = this.$t('lang.public_brand_label');
      }
      return str + str1;
    },
    fetchUrl() {
      let url = "";
      if (this.type == "brand") {
        url = "/brands";
      } else {
        url = "/products";
      }
      if (this.isNew) {
        url = url + "/add";
      } else {
        url = url + "/edit";
      }
      return url;
    }
  },
  created() {
    if (!this.isNew) {
      this.form.name = this.name;
      this.form.shortName = this.shortName;
      this.form.logo = this.url;
      this.imageUrl = "api/" + this.url;
    }
    if (this.type == "product") {
      this.rules.logo[0]["required"] = false;
      this.rules.shortName[0]["required"] = true;
    }
  },
  mounted() {},
  methods: {
    ...mapActions("permissions", ["fetch_permission"]),
    handleAvatarError(err, file, fileList) {
      this.$message.error(err);
    },
    handleAvatarSuccess(res, file) {
      if (res.ret == 0) {
        this.imageUrl = URL.createObjectURL(file.raw);
        this.form.logo = res.data.url;
      } else {
        this.$message.error(res.msg);
      }
      this.$refs.form.validateField("logo");
    },
    beforeAvatarUpload(file) {
      return new Promise((resolve, reject) => {
        this.$getImageWH(file)
          .then(res => {
            let fileType = ["image/jpeg", "image/png"];
            const isJPGPNG = fileType.indexOf(file.type) !== -1;
            const isLtM = file.size / 1024 < 50;

            if (!isJPGPNG) {
              this.$message.error(this.$t('lang.reg_upload_picture_form_error'));
            }
            if (!isLtM) {
              this.$message.error(this.$t('lang.reg_upload_picture_size_error'));
            }
            let isSizeOk = true;
            if (res.width != res.height) {
              isSizeOk = false;
              this.$message.error(this.$t('lang.reg_upload_picture_square_error'));
            }
            isJPGPNG && isLtM && isSizeOk ? resolve() : reject();
          })
          .catch(err => {
            this.$message.error(this.$t('lang.system_client_get_image_size_fail'));
            reject();
          });
      });
    },
    onCancel() {
      this.$emit("update:isShow", false);
    },
    onConfirm() {
      // this.$eventHub.$emit("addBrand", this.id);
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.fetchNewEdit();
        } else {
          return false;
        }
      });
    },
    getParam() {
      let param = {
        name: this.form.name,
        sub_name: this.form.shortName
      };
      if (this.type == "brand") {
        param.logo = this.form.logo;
      }
      if (this.isNew) {
        if (this.type == "brand") {
          param.customer_id = this.id;
        } else {
          param.brand_id = this.id;
        }
      } else {
        param.id = this.id;
      }
      return param;
    },
    async fetchNewEdit() {
      let param = this.getParam();
      this.isLoading = true;

      try {
        let data = await fetch.post(this.fetchUrl, param);
        // Bug 12668 
        
        if (this.type == "product") {
          this.fetch_permission();
        }
        
        this.emitEvent();
        this.onCancel();
      } catch (err) {
        // this.$dispatch("BrandList", "refresh");
        this.$message.error(err.message);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
    emitEvent() {
      if (this.type == "brand" && this.isNew) {
        this.$eventHub.$emit("addBrand", this.id);
      } else {
        this.$dispatch("BrandList", "refresh");
      }
    },
    onUpdateVisible(val) {
      this.$emit("update:isShow", val);
    }
  }
};
</script>
<style scoped>
.error-msg {
  margin-left: 60px;
  margin-top: -18px;
  color: #f56c6c;
  font-size: 12px;
  line-height: 1;
}
</style>
<style>
.brand-create-edit .form .el-form-item__label {
  color: #939aa2;
}
.avatar-uploader .el-upload {
  border: 1px solid #d9d9d9;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.brand-create-edit .avatar-uploader .el-upload:hover {
  border-color: #42a996;
}
.brand-create-edit .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
}
.brand-create-edit .avatar {
  width: 60px;
  height: 60px;
  display: block;
}
</style>
