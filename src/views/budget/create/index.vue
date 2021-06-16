<template>
    <div class="budget-input-content"
        v-loading.fullscreen='isLoading'>
        <div class="breadcrumb-wrap">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item to="/budget/manage">
                    <span class="breadcrumb-item-line">|</span>{{$t('lang.third_nav_budget_list')}}</el-breadcrumb-item>
                <el-breadcrumb-item>
                    <span class="breadcrumb-item-line"></span>{{handle_type === 'create'? $t('lang.public_add'):$t('lang.public_tooltip_edit')}}</el-breadcrumb-item>
            </el-breadcrumb>
            <div v-if='step==2'>
                <el-button plain
                    @click="onBack">{{$t('lang.public_back')}}</el-button>
                <el-button plain
                    @click="onDownLoad">{{$t('lang.public_tooltip_download')+ $t('lang.AS_detail_result')}}</el-button>
                <!-- 下载结果 -->
            </div>
        </div>

        <div v-show='step==1'>
            <base-info ref='refBaseInfo'
                :edit_info="edit_form"
                :selectList="edit_select"
                @currentPort="changeBasePort" />
            <media-point ref='refMediaPoint'
                :RtreeResult="RtreeResult"
                :currentPortVal="currentPortVal" />
            <el-button style="margin-left: 6px;"
                v-if="handle_type === 'create'"
                @click="onStartCalculate('new')">{{$t('lang.public_Start_calculating')}}</el-button>
            <el-button style="margin-left: 6px;"
                v-if="handle_type === 'edit'"
                @click="view_last_result">{{$t('lang.public_view_last_result')}}</el-button>
            <el-button style="margin-left: 6px;"
                v-if="handle_type === 'edit'"
                @click="onStartCalculate('old')">{{$t('lang.public_Again_calculating')}}</el-button>
            <el-button style="margin-left: 6px;"
                @click="go_back">{{$t('lang.public_button_cancel')}}</el-button>
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
      currentPortVal: "", //当前选中的端口值
      isShowTA: false, //计算结果中是否显示ta列
      edit_form: {
        gender: "",
        projectName: "",
        customer: "",
        brand: "",
        product: "",
        cycle: "",
        budget: "",
        targetFunc: "",
        port: [], //端口
        target: "", //目标函数项
      },
      ta_item: [],
      edit_select: {},
      RtreeResult: [],
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
  mounted() {
    if (this.handle_type === "edit") {
      this.find_one();
    }
  },
  computed: {
    ...mapState("budget", ["handle_type", "budgetID"]),
  },
  watch: {},
  methods: {
    ...mapActions("budget", ["update_budget_id", "update_is_fromback", "update_handle_type", "update_select_value"]),
    async find_one() {
      const url = "/algorithm/details";
      const param = {
        id: this.budgetID,
      };
      const data = await this.fetchCore(url, param, true);
      if (data) {
        // base_info
        this.edit_form.projectName = data.project_name;
        this.edit_form.customer = data.customer_id;
        this.edit_form.brand = data.brand_id;
        this.edit_form.product = data.product_id;
        this.edit_form.cycle = data.days[0];
        this.edit_form.budget = data.total_price;
        this.edit_form.targetFunc = data.taper_value;
        this.edit_form.port = data.port;
        this.edit_form.target = data.taper_key;
        if (data.ta_item) {
          const male = data.ta_item.includes("sex_male_rate");
          const female = data.ta_item.includes("sex_female_rate");
          if (male && female) {
            this.edit_form.gender = "0";
          } else if (!male && female) {
            this.edit_form.gender = "sex_female_rate";
          } else if (male && !female) {
            this.edit_form.gender = "sex_male_rate";
          }

          data.ta_item.forEach((item) => {
            this.$refs.refBaseInfo.update_ageRange(item);
          });
        }
        // this.$refs.refBaseInfo.set_edit_form(this.edit_form);

        // media-point
        if (data.pos_list) {
          let checked_keys = [];
          let RChecked = []; // 右侧树数据
          data.pos_list.forEach((item) => {
            // 待修改
            // const key = item.media_type_id+'_'+item.media_id+'_'+item.position_id
            const param = {
              key: item.key,
              lowday: item.lowday,
              upday: item.upday,
              period_safety: item.period_safety,
            };
            checked_keys.push(item.key);
            RChecked.push(param);
          });
          this.RtreeResult = RChecked;
          this.$refs.refMediaPoint.fetchGetTree(checked_keys, data.period_safety, this.edit_form.port.join(','));
        }
      }
    },
    back() {
      this.$router.replace("/budget/manage");
    },
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
        rs = list.filter((i) => i.media_type_id == mediaType);
      }
      if (media) {
        rs = list.filter((i) => i.media_id == media);
      }
      if (point) {
        rs = list.filter((i) => i.position_id == point);
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
            kpi: [],
          },
        };
      }
      if (res.algorithm_id) {
        this.update_budget_id(res.algorithm_id);
      }
      if (!_.isPlainObject(res.results.data)) {
        this.$message.error(this.$t("lang.budget_Calculate_fail"));
        res.results = {
          data: {
            data: [],
            data_total: {},
            kpi: [],
          },
        };
      }
      return res;
    },
    go_back() {
      this.$router.replace("/budget/manage");
    },
    async view_last_result() {
      const url = "/algorithm/viewresult";
      const param = {
        id: this.budgetID,
      };
      const data = await this.fetchCore(url, param, true);
      if (data) {
        if (data.results.data.data.length) {
          if (Object.keys(data.results.data.data[0]).includes("ta")) {
            this.isShowTA = true;
          }
        }
        this.kpiPredictResult = data.results;
        this.allocateResult = data.results;
        this.selectList = data.selected;
        this.totalData = data.results.data.data_total;
        this.allocateList = data.results.data.data;
        this.kpiList = data.results.data.kpi;

        if (this.kpiList.length && this.allocateList.length) {
          this.step = 2;
        }
      }
    },
    onStartCalculate(type) {
      let promiseList = [];
      let bip = this.$refs.refBaseInfo.onSubmit();
      let mpp = this.$refs.refMediaPoint.onSubmit();
      promiseList.push(bip, mpp);
      Promise.all(promiseList)
        .then(async (arr) => {
          let param = Object.assign({}, arr[0], arr[1]);
          if (type === "old") this.$set(param, "algorithm_id", this.budgetID);
          this.isShowTA = arr[0].taper_key == "ta" ? true : false;
          this.param = param;
          let data = await this.fetchCalculate(param);
          this.kpiPredictResult = data.results;
          this.allocateResult = data.results;
          this.selectList = data.selected;
          this.totalData = data.results.data.data_total;
          this.allocateList = data.results.data.data;
          this.kpiList = data.results.data.kpi;

          if (this.kpiList.length && this.allocateList.length) {
            this.step = 2;
          }
        })
        .catch((err) => {
          // debugger
        });
    },
    onBack() {
      if (this.handle_type === "create" && this.budgetID) {
        this.update_handle_type("edit");
      }
      this.step = 1;
    },
    async onDownLoad() {
      // this.isLoading = true;
      // let results = this.allocateResult;
      // let kpi = this.kpiPredictResult;
      // let url = await this.fetchCore("/algorithm/downloadlist", {
      //   results,
      //   kpi,
      // });
      const url = '/algorithm/download'
      const param = {
        id: this.budgetID
      }
      const data = await this.fetchCore(url, param, true)
      if (data) {
        this.$downloadFile("/api/" + data);
      }
      // this.isLoading = false;
      
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
    },
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === "BudgetManage") {
      this.update_is_fromback(true);
    }
    this.update_select_value("");
    next();
  },
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
  line-height: 12px;
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
  /* padding-left: 60px; */
  padding-left: 50px;
}
.operatelog-popover .el-table {
  max-height: 600px;
  overflow: auto;
}
</style>

