<template>
  <label v-loading.fullscreen.lock="isLoading"
      style="z-index:1"
      :element-loading-text="loadingText">
    <i class="iconfont icon-export" :title="$t('lang.public_upload')"></i>
    <input type="file"
        :disabled='status=="disabled"'
        class="upload-input"
        @change="changeFile"
        name="file"
        ref="uploadRef" />
  </label>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import _ from "lodash";
import moment from "moment";
import math from "mathjs";
import fetch from "@/services/fetch";

export default {
  name: "process-upload-plugin",
  props: {
    uploadUrl: {
      type: String
    },
    status: {
      type: String
    },
  },
  computed: {
    ...mapState("project", ["projectID"])
  },
  data() {
    return {
      isLoading: false,
      loadingText: "",
      message: "",
      file: [],
    };
  },
  created() {
    // this.$on("item-upload", this.uploadFile);
  },
  methods: {
    onFormatUploadPercent(evt) {
      let percent = this.$formatNumber(math.eval(evt.loaded / evt.total) * 100, 2, "");
      if (percent!='100.00') {
        this.loadingText = this.$t('lang.public_uploading')+ percent + "%";
      }else{
        this.loadingText = this.$t('lang.public_uploaded') + percent + "%, "+this.$t('lang.public_The_server_is_processing');
      }
    },
    getParam(e) {
      let file = e.target.files[0];
      let project_id = this.projectID;
      let formData = new FormData();
      formData.append("file", file);
      formData.append("project_id", project_id);
      return formData;
    },
    async changeFile(e) {
      this.isLoading = true;
      let param = this.getParam(e);
      try {
        let ret = await fetch.post(this.uploadUrl, param, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: this.onFormatUploadPercent
        });
        // debugger
        this.$message.success(this.$t('lang.public_upload_success'));
        this.$emit('upload-success');
      } catch (err) {
        // debugger
        this.$message.error(err.message);
        this.$emit('upload-fail')
        throw err;
      } finally {
        this.$refs.uploadRef.value = null; //可以重复上传同一张文件
        this.isLoading = false;
      }
    },
    uploadFile() {
      if (this.disabled) {
        return;
      }
      // this.$dispatch("progressButton", "item-upload", { uploadLink: this.uploadUrl });
    }
  },

  created() {
    //初始化,无法操作dom
  },

  mounted() {
    //初始化，可以操作dom
    //this.refs
  },

  components: {
    //子组件
  }
};
</script>
<style scoped>
.right-bottom-plugin i {
  font-size: 20px;
  padding: 4px;
  display: inline-block;
}
.upload-input {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}
</style>
<style>
/*全局部分*/
</style>