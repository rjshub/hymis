<template>
  <hy-dialog :visible="true"
      :title="$t('lang.public_upload')"
      custom-class='basic-data-upload'
      @close="onClose"
      width='445px'
      v-loading="isLoading"
      :close-on-click-modal="false">
    <div class="box" v-loading="isLoading">
      <div class="item">
        <span class="label" >Basic Data:</span>
        <span class="file-name" v-if='bd_name'>{{bd_name}}</span>
        <el-upload style="display:inline-block"
          class="upload-text"
          :data='{project_id:projectID}'
          action="/api/basicdata/importbasicdata"
          :show-file-list="false"
          :before-upload='onBeforeUpload'
          accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'
          :on-success="BDOnSuccess">
          <span class="upload-text">{{bd_name? $t('lang.public_upload_again'):$t('lang.public_select_file')}}</span>
        </el-upload>
        <!-- <span class="upload-text">{{bd_name?'重新上传':'选择文件'}}</span> -->
      </div>
      <div class="item"
          style="margin-top: 5px;margin-bottom: 5px;">
        <span  class="label">{{$t('lang.public_other')}}:</span>
        <el-radio-group v-model="other" @change='onChange'>
          <el-radio label="cpm">{{$t('lang.AS_detail_basic_data_create_form.target_CPM')}}</el-radio>
          <el-radio label="reach_goal">Reach Goal</el-radio>
        </el-radio-group>
      </div>
      <div style="margin-left: 80px;">
        <span class="file-name" v-if='otherFileName'>{{otherFileName}}</span>
        <el-upload style="display:inline-block"
          class="upload-text"
          :data='{project_id:projectID}'
          :action="otherUrl"
          :show-file-list="false"
          :before-upload='onBeforeUpload'
          accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'
          :on-success="otherOnSuccess">
          <span class="upload-text">{{otherFileName? $t('lang.public_upload_again'):$t('lang.public_select_file')}}</span>
        </el-upload>
        <!-- <span class="upload-text">{{otherFileName?'重新上传':'选择文件'}}</span> -->
      </div>
    </div>
    <div slot="footer">
      <span class="tip" v-show="showTip">{{$t('lang.AS_detail_basic_data_upload_check')}}</span>
      <!-- accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel' -->
      <el-button @click="onSubmit">{{$t('lang.public_button_submit')}}</el-button>
      <!-- <el-button plain
          @click="onClose">关闭</el-button> -->
    </div>
  </hy-dialog>

</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import _ from "lodash";
import math from "mathjs";
import fetch from "@/services/fetch";

export default {
  name: "basic-data-upload",

  components: {},
  data() {
    return {
      other: "cpm",
      bd_name:"",
      tc_name:"",
      rg_name:"",
      showTip:false,
      isLoading: false,

    };
  },
  props: {
    isShow: {
      type: Boolean,
      required: false
    }
  },
  computed: {
    ...mapState("project", ["projectID"]),
    otherUrl(){
      let url = '/api/reachgoal/importreachgoal';
      if (this.other=='cpm') {
        url = '/api/goalcpm/importcpm';
      }
      return url;
    },
    otherFileName(){
      if (this.other=='cpm') {
        return this.tc_name
      }else{
        return this.rg_name
      }
    },
  },
  watch: {},
  created() {
    this.getFileName();
    // this.update_project_id("4"); //临时代码
  },
  mounted() {},
  methods: {
    ...mapActions("project", [
      // "fetch_step_status",
      // "fetch_preview_data",
      // "fetch_log_info",
      "update_project_id",
      "updata_preview_log_step_status"
    ]),
    otherOnSuccess(res, file){
      this.isLoading = false;
      if (res && res.ret == 0) {
        if (this.other=='cpm') {
          this.rg_name = '';
          this.tc_name = res.data.filename;
        }else{
          this.tc_name = '';
          this.rg_name = res.data.filename;
        }
        // this.imageUrl = URL.createObjectURL(file.raw);
        // this.form.logo = res.data.url;
        this.showTip = true;
        this._message(this.$t('lang.public_upload_success'));
      } else {
        this._message(res.msg|| this.$t('lang.public_upload_fail'));
      }
    },
    BDOnSuccess(res, file){
      this.isLoading = false;
      if (res && res.ret == 0) {
        // this.imageUrl = URL.createObjectURL(file.raw);
        this.bd_name = res.data.filename
        this.showTip = true;
        this._message(this.$t('lang.public_upload_success'));
      } else {
        this._message(res.msg|| this.$t('lang.public_upload_fail'));
      }
    },
    _message(msg){
      this.$message({
        message: msg,
        showClose:true,
        duration:2000,
        type: 'error'
      });
    },
    onBeforeUpload(){
      this.isLoading = true;
    },
    onChange(val){
      if (val=='cpm') {
        
      }else{

      }
    },
    setRadio(){
      if (this.tc_name) {
        this.other = 'cpm'
      }
      if (this.rg_name) {
        this.other = 'reach_goal'
      }
    },
    async getFileName(){
      this.isLoading = true;
      let param = {
        project_id: this.projectID,
      };
      let data = await this.fetchCore("/basicdata/getfilename", param);
      this.bd_name= data.bd_name;
      this.tc_name= data.tc_name;
      this.rg_name= data.rg_name;
      this.setRadio();
      this.isLoading = false;
    },
  
    async fetchCore(url, data, hasLoading = true) {
      hasLoading && (this.isLoading = true);
      try {
        let _data = await fetch.post(url, data);
        return _data;
      } catch (err) {
        this._message(err.message);
        throw err;
      } finally {
        hasLoading && (this.isLoading = false);
      }
    },
    async onSubmit() {
      await this.fetchCore("/basicdata/checkdata", {
        project_id: this.projectID
      });
      this.onClose();
    },
    onClose() {
      this.updata_preview_log_step_status();
      this.$emit("update:isShow", false);
      this.$dispatch("BasicDataChart", "updateCharIco");
    }
  }
};
</script>
<style scoped>
/*本地部分*/
.label{
  display: inline-block;
  margin-right: 4px;
  width: 100px;
  text-align: right;
}
.box {
  box-sizing: border-box;
  height: 100%;
  padding-left: 20px;
  padding-top: 35px;
  color: #999999;
}
.upload-text {
  color: #2d9c96;
  cursor: pointer;
}
.file-name{
  color: #ffffff;
}
.tip{
  font-size: 12px;
  color: #ffcc00;
  text-align: left;
  /* float: left; */
  /* line-height: 28px; */
  padding-right: 20px;
}
</style>
<style>
.basic-data .el-form-item__content {
  line-height: initial;
}
.basic-data-upload .el-radio__input.is-checked + .el-radio__label {
  color: #a9adb8;
}
.basic-data-upload .el-radio + .el-radio {
  margin-left: 10px;
}
/*全局部分*/
</style>