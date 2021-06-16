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
        label-width="125px">

        <el-form-item :label="`${$t('lang.system_media_media_create_form.id')}:`" v-if="!!id">
          <span>{{id}}</span>
        </el-form-item>

        <el-form-item :label="`${$t('lang.system_media_media_create_form.misMediaName')}:`"
          prop="misMediaName">
          <el-input v-model.trim="form.misMediaName"
            :placeholder="$t('lang.public_MIS_media_name')"></el-input>
        </el-form-item>

        <el-form-item :label="`${$t('lang.system_media_media_create_form.pbsMediaName')}:`"
          prop="pbsMediaName">

          <!-- <el-input v-model.trim="form.pbsMediaName"
            placeholder="请输入PBS媒体名称"></el-input> -->
          <el-select v-model="form.pbsMediaName"
            style="width:303px;"
            size="mini"
            filterable
            clearable
            multiple
            :filter-method='onFilterMediaName'
            @change='onChangePbsMediaName'
            :placeholder="$t('lang.public_pbs_media_search')">
            <el-option v-for="item in pbsMediaList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              <span style="padding-right: 25px;">{{ item.id }}</span>
              <span>{{ item.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="`${$t('lang.system_media_media_create_form.levelOneAss')}:`"
          prop="levelOneAss">
          <!-- <el-input v-model.trim="form.levelOneAss"
            placeholder="请输入英文名称"></el-input> -->
          <el-select v-model="form.levelOneAss"
            style="width:303px;"
            size="mini"
            filterable
            clearable
            @change='onChangeLevelOneAss'
            :placeholder="$t('lang.public_select_primary_classification_placeholder')">
            <el-option v-for="item in levelOneAssList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="`${$t('lang.system_media_media_create_form.levelTwoAss')}:`"
          prop="levelTwoAss">
          <!-- <el-input v-model.trim="form.levelTwoAss"
            placeholder="请输入英文名称"></el-input> -->
          <el-select v-model="form.levelTwoAss"
            style="width:303px;"
            size="mini"
            filterable
            clearable
            @change='onChangeLevelTwoAss'
            :placeholder="$t('lang.public_select_second_classification_placeholder')">
            <el-option v-for="item in levelTwoAssList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
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
    id: {
      //是否是新建 或者 编辑
      type: [Number, String],
      required: true,
    },
    isShow: {
      type: [Boolean],
      required: true
    },
  },
  data() {
    var validatemisMediaName = (rule, value, callback) => {
      let reg = /^[\u4E00-\u9FA5A-Za-z][\u4E00-\u9FA5A-Za-z0-9_\(\)（）-]+$/;
      if (value === "") {
        callback(new Error(this.$t('lang.reg_MIS_media_name_required')));
      } else {
        if (!reg.test(value)) {
          callback(
            new Error(this.$t('lang.reg_MIS_media_name_error_required'))
          );
        } else {
          if (value.length > 30 || value.length < 2) {
            callback(new Error(this.$t('lang.reg_MIS_media_name_length_error')));
          } else {
            callback();
          }
        }
      }
    };

    return {
      isLoading: false,
      pbsMediaListOriginal: [
        { name: "名称A", id: 1 },
        { name: "名称B", id: 2 },
        { name: "名称C", id: 3 }
      ],
      pbsMediaList: [],
      levelOneAssList: [],
      levelTwoAssList: [],
      rules: {
        misMediaName: [
          {
            required: true,
            validator: validatemisMediaName,
            trigger: ["blur", "change"]
          }
        ],
        pbsMediaName: [
          { required: true, message: this.$t('lang.reg_select_pbs_name_placeholder'), trigger: "change" }
        ],
        levelOneAss: [
          { required: true, message: this.$t('lang.reg_select_primary_classification_placeholder'), trigger: "change" }
        ],
        levelTwoAss: [
          { required: true, message: this.$t('lang.reg_select_second_classification_placeholder'), trigger: "change" }
        ]
      },
      form: {
        misMediaName: "",
        pbsMediaName: "",
        levelOneAss: "",
        levelTwoAss: ""
      }
    };
  },
  watch: {},
  computed: {
    isNew(){
      return !this.id
    },
    title_c() {
      let str = this.$t('lang.public_tooltip_edit');
      if (this.isNew) {
        str = this.$t('lang.public_tooltip_create');
      }
      return str + this.$t('lang.public_media_label');
    },
  },
  async created() {
    if (!this.isNew) {
      await this.fetchDetail();
    }
    this.getSelectList();
  },
  mounted() {},
  methods: {
    async getSelectList(){
      let data = await this.fetchCore('/mediamanage/selectedlist',{type_id_1:this.form.levelOneAss});
      this.pbsMediaListOriginal = data.pbsmedias
      this.pbsMediaList = data.pbsmedias
      this.levelOneAssList = data.type.one||[]
      this.levelTwoAssList = data.type.two||[]
    },
    async fetchDetail(){
      let data = await this.fetchCore('/mediamanage/mediadetail',{media_id:this.id});
      let obj = {};
      obj.levelOneAss=data.type_id_1+""
      obj.levelTwoAss=data.type_id_2+""
      obj.misMediaName=data.name
      obj.pbsMediaName=data.pbs_media_ids.split(',').map(i=>i+'')
      this.form = obj;
    },
    onFilterMediaName(val) {
      let arr = val.split(",");
      arr = arr.map(i => _.trim(i));
      //按照id查
      if (arr.length > 1) {
        let tem = [];
        let nofind = [];
        for (const i of arr) {
          let obj = this.pbsMediaListOriginal.find(k => k.id == i);
          if (obj) {
            tem.push(obj);
          } else {
            nofind.push(i);
          }
        }
        this.pbsMediaList = tem;
          
        nofind = _.uniq(nofind)
        nofind = _.without(nofind,'');
        if (nofind.length) {
          this.$message({
            message: this.$t('lang.system_media_ids') + nofind.join(",") + this.$t('lang.system_media_pbs_not_id'),
            type: "error",
            customClass: "create-edit-media"
          });
        }
      } else if (arr.length == 1) {
        let tem = [];
        let str = arr;
        tem = this.pbsMediaListOriginal.filter(i => {
          return i.name.includes(str) || i.id == str;
        });
        this.pbsMediaList = tem;
      } else {
        this.pbsMediaList = this.pbsMediaListOriginal;
      }
    },
    onChangePbsMediaName() {},
    onChangeLevelOneAss() {
      this.form.levelTwoAss = '';
      this.getSelectList();
    },
    onChangeLevelTwoAss() {},
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
        name: this.form.misMediaName,
        type_id_1: this.form.levelOneAss,
        type_id_2: this.form.levelTwoAss,
        pbs_media_ids:this.form.pbsMediaName.join(','),
      };

      if (!this.isNew) {
        param.media_id = this.id;
      }

      return param;
    },
    async fetchNewEdit() {
      let param = this.getParam();
      await this.fetchCore('/mediamanage/modifymedia', param)
      this.emitEvent();
      this.onCancel();
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
    emitEvent() {
      this.$eventHub.$emit("refreshMediaList",this.isNew);
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
.city-create-edit {
  .form .el-form-item__label {
    color: #939aa2;
    word-break: keep-all;
  }
}
.el-message--error.create-edit-media {
  z-index: 3000 !important;
}
</style>
