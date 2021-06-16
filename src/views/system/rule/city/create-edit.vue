<template>
  <hy-dialog :visible="isShow"
    @update:visible='onUpdateVisible'
    custom-class='city-create-edit'
    v-loading='isLoading'
    :title="title_c"
    width='470px'>

    <div class="box"
      style="padding:24px 20px 0 20px;color:#939aa2;">

      <el-form size='mini'
        ref="form"
        :model="form"
        :rules="rules"
        class="form"
        label-width="auto">
        <el-form-item :label="`${$t('lang.system_rule_city_create_form.name')}：`"
          prop="name">
          <el-input v-model.trim="form.name"
            :placeholder="$t('lang.public_chinese_name_placeholder')"></el-input>
        </el-form-item>

        <el-form-item :label="`${$t('lang.system_rule_city_create_form.name_en')}：`"
          prop="name_en">
          <el-input v-model.trim="form.name_en"
            :placeholder="$t('lang.public_english_name_placeholder')"></el-input>
        </el-form-item>

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
import fetch from "@/services/fetch";

export default {
  name: "city-create-edit",
  props: {
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
      required: false
    },
    name: {
      type: [String],
      required: false
    },
    name_en: {
      type: [String],
      required: false
    },
  },
  data() {
    var validateName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t('lang.reg_chinese_name_required')));
      } else {
        if (!this.$constReg.chinese.test(value)) {
          callback(new Error(this.$t('lang.reg_chinese_name_error_required')));
        } else {
          if (value.length > 20||value.length < 2) {
            callback(new Error(this.$t('lang.reg_chinese_name_length_error')));
          } else {
            callback();
          } 
          
        }
      }
    };
    var validateEnName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(this.$t('lang.reg_english_name_required')));
      } else {
        let reg = /^[A-Za-z\(\)]+$/;
        if (!reg.test(value)) {
          callback(new Error(this.$t('lang.reg_english_name_error_required')));
        } else {
          if (value.length > 20||value.length < 2) {
            callback(new Error(this.$t('lang.reg_english_name_length_error')));
          } else {
            callback();
          } 
        }
      }
    };

    return {
      isLoading: false,
      rules: {
        name: [{ required: true, validator: validateName, trigger: "blur" }],
        name_en: [
          { required: true, validator: validateEnName, trigger: "blur" }
        ],
      },
      form: {
        name: "",
        name_en: "",
      },
    };
  },
  watch: {},
  computed: {
    title_c() {
      let str = this.$t('lang.public_tooltip_edit');
      if (this.isNew) {
        str = this.$t('lang.public_tooltip_create');
      }
      return str + this.$t('lang.system_rule_city_label');
    },
    fetchUrl() {
      let url = "/markets";

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
      this.form.name_en = this.name_en;
    }
  },      
  mounted() {},
  methods: {
    onCancel() {
      this.$emit("update:isShow", false);
    },
    onConfirm() {
      // this.$eventHub.$emit("addBrand", this.id);
      /* this.$refs["form"].validateField('name_en',err=>{
				console.log("TCL: onConfirm -> err", err)
      }) */
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
        name_en: this.form.name_en
      };

      if (!this.isNew) {
        param.id = this.id;
      } 

      return param;
    },
    async fetchNewEdit() {
      let param = this.getParam();
      this.isLoading = true;

      try {
        let data = await fetch.post(this.fetchUrl, param);
        this.emitEvent();
        this.onCancel();
      } catch (err) {
        this.$message.error(err.message);
        throw err;
      } finally {
        this.isLoading = false;
      }
    },
    emitEvent() {
      this.$eventHub.$emit("refreshCityList");
    },
    onUpdateVisible(val) {
      this.$emit("update:isShow", val);
    }
  }
};
</script>
<style scoped>

</style>
<style lang="scss">
.city-create-edit{
  .form .el-form-item__label {
    color: #939aa2;
  }
}
</style>
