<template>
  <div class="clearfix breadcrumb-wrap" v-loading.fullscreen="isLoading">
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{path: ''}"
        @click.native="onBack">
        <span class="breadcrumb-item-line">|</span>{{pageType=='ProjectManage'?'项目列表':'归档项目'}}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '' }">{{projectName}}</el-breadcrumb-item>
    </el-breadcrumb> -->

    <div class="hy-breadcrumb">
      <span>|</span>
      <span @click="onBack">{{pageType=='ProjectManage'? $t('lang.third_nav_project_list'):$t('lang.third_nav_archived_project')}}</span>
      <i class="el-icon-arrow-right"></i>
      <span style="font-weight: initial;">{{c_projectName}}</span>
    </div>

    <div class="right-btn-box">
      <el-select v-model="temCurVersion"
        style="width: 200px;line-height:28px"
        :placeholder="$t('lang.public_version_placeholder')"
        size="mini"
        :filterable='false'
        class="version-select"
        @change="changeVersion">
        <div slot="prefix"
          class="select-prefix">{{$t('lang.public_version_label')}}:</div>
        <el-option v-for="item in c_versionList"
          :key="item.version"
          :label="item.name"
          :value="item.version">
        </el-option>
      </el-select>

      <el-button plain
        :disabled="curVersion==0"
        @click="onDownload">{{$t('lang.public_tooltip_download')}}</el-button>
    </div>

  </div>
</template>
<script>
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";
import { mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "create-project-back",
  data() {
    return {
      isLoading:false,
      temCurVersion: "",
      version_list: [{ id: 1, name: "版本1" }, { id: 2, name: "版本2" }]
    };
  },
  watch: {},
  computed: {
    ...mapState("project", [
      "projectName",
      "customerName",
      "customerID",
      "projectID",
      "pageType",
      "version",
      "curVersion",
      "versionList"
    ]),
    c_projectName() {
      return this.projectName || this.$t('lang.third_nav_add_project');
    },
    c_versionList() {
      let arr = [{ name: this.$t('lang.public_current_version_label'), version: 0 }];
      for (let item of this.versionList) {
        if (item.version != 0) {
          let timeStr = moment(item.ctime).format("YYYYMMDDHHmm");
          let version = item.version-0;
          let name = "V" + version + "_" + timeStr;
          arr.push({ name, version });
        }
      }
      return arr;
    },
    renderVersionList() {
      let list = this.versionList;
      if (this.versionList.length == 0) {
        list = [];
      }
      return list;
    }
  },
  created() {
    this.update_version_list();
    this.setCurversion();
  },
  mounted() {
    // this.init();
  },
  methods: {
    ...mapActions("project", [
      "update_is_fromback",
      "update_curVersion",
      "update_version_list"
    ]),
    setCurversion(){
      this.temCurVersion = this.curVersion-0;
    },
    onBack() {
      let name = this.pageType;
      this.update_is_fromback(true);
      this.$router.push({
        name
      });
    },
    changeVersion(val) {
      this.update_curVersion(val-0);
      // this.$router.go(0)
      this.$dispatch("CreateProject", "change-version",val-0);
    },

    async onDownload() {
      this.isLoading = true;
      try {
        let res = await fetch.post("/projects/downloadhistory", {
          project_id: this.projectID,
          version: this.curVersion
        });
        this.isLoading = false;
        this.$downloadFile("api/" + res);
      } catch (err) {

      } finally {
        this.isLoading = false;
      }
    },
    async fetchCore(url, data, hasLoading = false) {
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
    }
  }
};
</script>
<style scoped lang="scss">
.hy-breadcrumb {
  color: #a7acb2;
  font-weight: 700;
  font-size: 16px;
  text-decoration: none;
  transition: color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  display: inline-block;
  line-height: 70px;
  i:nth-of-type(1) {
    font-weight: 500;
    font-size: 16px;
  }
  :nth-child(1) {
    color: #fff;
    font-size: 16px;
    font-weight: 800;
  }
  :nth-child(2):hover {
    color: #42a996;
    cursor: pointer;
  }
}
.back {
  margin-bottom: 24px;
}
.back .el-button {
  vertical-align: middle;
}
.project-name {
  color: #a4abb5;
  font-size: 16px;
  vertical-align: middle;
  padding-left: 6px;
}
.right-btn-box {
  float: right;
  line-height: 70px;
  margin-right: 20px;
}
</style>

<style>
.version-select .el-input--prefix .el-input__inner {
  padding-left: 50px;
}
</style>
