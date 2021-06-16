<template>
    <div class="budget-input-content"
        v-loading.fullscreen='isLoading'>
        <div class="breadcrumb-wrap">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '' }">
                    <span class="breadcrumb-item-line">|</span>Display预算分配</el-breadcrumb-item>
            </el-breadcrumb>
            <div v-if='step==2'>
                <el-button plain
                    @click="onBack">返回上一步</el-button>
                <el-button plain
                    @click="onDownLoad">下载结果</el-button>
            </div>
        </div>

        <div v-show='step==1'>
            <base-info ref='refBaseInfo'
                @currentPort="changeBasePort" />
            <media-point ref='refMediaPoint'
                :currentPortVal="currentPortVal" />
            <el-button style="margin-left: 6px;"
                @click="onStartCalculate">开始计算</el-button>
        </div>
        <template v-if='step==2'>
            <allocate-result :list='allocateList'
                :isShowTA='isShowTA'
                :total='totalData'
                :selectList='selectList' />
            <kpi-predict :list='kpiList'
                :selectList='selectList'></kpi-predict>
        </template>

    </div>

</template>

<script>
import _ from "lodash";
import { mapState, mapGetters, mapActions } from "vuex";
import moment from "moment";
import fetch from "@/services/fetch";
// import headFold from "@/views/public/head-fold";
import baseInfo from "./base-info";
import mediaPoint from "./media-point";
import allocateResult from "./allocate-result";
import kpiPredict from "./kpi-predict";

export default {
  name: "UserManage",
  components: { baseInfo, mediaPoint, allocateResult, kpiPredict },
  data() {
    return {
      step: 1,
      isLoading: false,
      selectList: {},
      allocateList: [],
      kpiList: [],
      totalData: {},
      param: {},
      kpiPredictResult: {},
      allocateResult: {},
      currentPortVal: "",//当前选中的端口值
      isShowTA:false,//计算结果中是否显示ta列
    };
  },
  props: {},
  created() {
    this.$eventHub.$on("KPI-PREDICT", ({ mediaType, media }) => {
      // console.log('mediaType,media',mediaType,',',media)
      this.getKpiPredict({ mediaType, media });
    });
    this.$eventHub.$on("ALLOCATE-RESULT", ({ mediaType, media, point }) => {
      // console.log('mediaType,media',mediaType,',',media)
      this.getAllocateResult({ mediaType, media, point });
    });
  },
  mounted() {},
  computed: {},
  watch: {},
  methods: {
    async getKpiPredict({ mediaType, media }) {
      let param = this.getFilterParam({ mediaType, media });
      let data = await this.fetchCalculate(param);
      this.kpiPredictResult = data.results;
      // if (_.isPlainObject(data.results.data.kpi)) {
      this.kpiList = data.results.data.kpi;
      // }
    },
    async getAllocateResult({ mediaType, media, point }) {
      let param = this.getFilterParam({ mediaType, media, point });
      let data = await this.fetchCalculate(param);
      this.allocateResult = data.results;
      // if (_.isPlainObject(data.results.data.data_total)) {
      this.totalData = data.results.data.data_total;
      // }
      // if (_.isPlainObject(data.results.data.data)) {
      this.allocateList = data.results.data.data;
      // }
    },
    getFilterParam({ mediaType, media, point }) {
      // return
      let cParam = _.cloneDeep(this.param);
      let list = cParam.pos_list;
      let rs = [];
      if (mediaType) {
        rs = list.filter(i => i.media_type_id == mediaType);
      }
      if (media) {
        rs = list.filter(i => i.media_id == media);
      }
      if (point) {
        rs = list.filter(i => i.position_id == point);
      }
      if (rs.length) {
        cParam.pos_list = rs;
      }
      return cParam;
    },
    async fetchCalculate(param) {
      let res = await this.fetchCore("/algorithm/compute", param);
      if (!_.isPlainObject(res.selected)) {
        res.selected = {};
      }
      if (!_.isPlainObject(res.results)) {
        res.results = {
          data: {
            data: [],
            data_total: {},
            kpi: []
          }
        };
      }
      if (!_.isPlainObject(res.results.data)) {
        this.$message.error("无解，请调整配置条件后重试");
        res.results = {
          data: {
            data: [],
            data_total: {},
            kpi: []
          }
        };
      }
      return res;
    },
    onStartCalculate() {
      let promiseList = [];
      let bip = this.$refs.refBaseInfo.onSubmit();
      let mpp = this.$refs.refMediaPoint.onSubmit();
      promiseList.push(bip, mpp);
      Promise.all(promiseList)
        .then(async arr => {
          let param = Object.assign({}, arr[0], arr[1]);
          this.isShowTA = arr[0].taper_key == "ta" ? true :false;
          this.param = param;
          let data = await this.fetchCalculate(param);
          this.kpiPredictResult = data.results;
          this.allocateResult = data.results;
          this.selectList = data.selected;
          this.totalData = data.results.data.data_total;
          this.allocateList = data.results.data.data;
          this.kpiList = data.results.data.kpi;

          if (this.kpiList.length && this.allocateList) {
            this.step = 2;
          }
        })
        .catch(err => {
          // debugger
        });
    },
    onBack() {
      this.step = 1;
    },
    async onDownLoad() {
      this.isLoading = true;
      let results = this.allocateResult;
      let kpi = this.kpiPredictResult;
      let url = await this.fetchCore("/algorithm/downloadlist", {
        results,
        kpi
      });
      this.isLoading = false;
      this.$downloadFile("/api/" + url);
    },
    changeBasePort(val) {
      this.currentPortVal = val;
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
    }
  }
};
</script>
<style scoped lang='scss'>
@import "../../../assets/css/theme/mixin.scss";

.budget-input-content {
  margin-right: 20px;
  margin-left: 20px;
  /* padding-top: 31px; */
}
.breadcrumb-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.operate i {
  margin-left: 20px;
  margin-top: 12px;
  cursor: pointer;
  opacity: 0.6;
  display: inline-block;
  color: white;
  font-size: 30px;
  width: 24px;
  height: 24px;
}
.operate i:hover {
  opacity: 0.8;
}
.detail-ico {
  font-size: 18px;
}
</style>
<style>
/*全局部分*/
.budget-input-content .hy-input-with-title .el-input--prefix .el-input__inner {
  padding-left: 60px;
}
.operatelog-popover .el-table {
  max-height: 600px;
  overflow: auto;
}
</style>

