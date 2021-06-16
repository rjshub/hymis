<template>
    <hy-dialog :visible="isShow"
        @update:visible='onUpdateVisible'
        custom-class='project-detail'
        :title="$t('lang.AS_project_detail')"
        width='470px'
        :close-on-click-modal="true">
        <div class="box detail-container"
            style="padding-left:30px;padding-top:22px;">
            <div style="color:#fbfeff;margin-bottom: 10px;">{{values.project_name}}</div>
            <dl>
                <dd>
                    <span>{{$t('lang.public_period_label')}}：</span>
                    <span class="text">{{values.start_date}}{{$t('lang.public_DatePicker_between')}}{{values.end_date}}</span>
                </dd>
                <dd>
                    <span>{{$t('lang.public_budget_label')}}：</span>
                    <span class="text">{{values.total_price}} ({{$t('lang.AS_detail_basic_info_money_unit')}})</span>
                </dd>
                <dd>
                    <span>{{$t('lang.public_client_label')}}：</span>
                    <span class="text">{{values.customer_name}}</span>
                </dd>
                <dd>
                    <span>{{$t('lang.public_brand_label')}}：</span>
                    <span class="text">{{values.brand_name}}</span>
                </dd>
                <dd>
                    <span>{{$t('lang.public_product_label')}}：</span>
                    <span class="text">{{values.product_name}}</span>
                </dd>
                <dd>
                    <span>{{$t('lang.public_port_label')}}：</span>
                    <span class="text">{{values.port}}</span>
                </dd>
                <dd>
                    <span>{{$t('lang.public_audience_label')}}：</span>
                    <span class="text">{{formatGender()}}</span>
                </dd>
                <dd>
                    <span>{{$t('lang.public_age')}}：</span>
                    <span class="text">{{ageRange()}}</span>
                </dd>
                <dd>
                    <span>{{$t('lang.public_Goal_label')}}：</span>
                    <span class="text">{{set_taper()}}</span>
                </dd>
            </dl>
        </div>

        <div slot="footer">
            <el-button plain
                @click="onClose">{{$t('lang.public_close')}}</el-button>
        </div>
    </hy-dialog>
</template>
<script>
import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";

export default {
  name: "ProjectDetail",
  props: {
    isShow: {
      type: [Boolean],
      required: true,
    },
    values: {
      type: [Object],
      required: true,
    },
  },
  data() {
    return {};
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {
    // this.init();\
  },
  methods: {
    formatGender() {
      const male = this.values.ta_item.includes("sex_male_rate");
      const female = this.values.ta_item.includes("sex_female_rate");
      if (male && female) {
        return this.$t("lang.public_all");
      } else if (!male && female) {
        return this.$t("lang.public_female");
      } else if (male && !female) {
        return this.$t("lang.public_male");
      }
    },
    ageRange() {
      const map = [
        { name: this.$t("lang.public_under_19"), value: "age_19_rate" },
        { name: `19-25 ${this.$t("lang.AS_detail_years_old")}`, value: "age_19_25_rate" },
        { name: `26-30 ${this.$t("lang.AS_detail_years_old")}`, value: "age_26_30_rate" },
        { name: `31-40 ${this.$t("lang.AS_detail_years_old")}`, value: "age_31_40_rate" },
        { name: `41-50 ${this.$t("lang.AS_detail_years_old")}`, value: "age_41_50_rate" },
        { name: this.$t("lang.public_over_50"), value: "age_50_rate" },
      ];
      let strArr = [];
      for (const item of this.values.ta_item) {
        const index = map.findIndex((obj) => {
          return obj.value === item;
        });
        if (index >= 0) {
          strArr.push(map[index].name);
        }
      }
      if (strArr.length === 6) {
        return this.$t("lang.public_all");
      } else {
        return strArr.join(" | ");
      }
    },
    set_taper() {
      const map = {
        ta: this.$t("lang.budget_ta_percent"),
        uv: `UV${this.$t("lang.budget_coverage_label")}`,
        win: this.$t("lang.budget_exposures_label"),
        leads: "Leads",
        cpm: "CPM",
        cpc: "CPC",
        cpl: "CPL",
        cpuv: "CPUV",
        ctr: "CTR",
      };
      const minList = ["ta", "uv", "win", "leads", "ctr"];
      const maxList = ["cpm", "cpc", "cpl", "cpuv"];
      if (minList.includes(this.values.taper_key)) {
        if (this.values.taper_key === "ta" || this.values.taper_key === "ctr") {
          return `${map[this.values.taper_key]} >= ${this.values.taper_value}%`;
        } else {
          return `${map[this.values.taper_key]} >= ${this.values.taper_value}`;
        }
      } else if (maxList.includes(this.values.taper_key)) {
        return `${map[this.values.taper_key]} <= ${this.values.taper_value}`;
      }
    },
    formatTime(val) {
      return moment(val).format("YYYY-MM-DD");
    },
    onUpdateVisible(val) {
      this.$emit("update:isShow", val);
    },
    onClose() {
      this.$emit("update:isShow", false);
    },
  },
};
</script>
<style scoped>
dl {
  font-size: 12px;
}
dd {
  color: #939aa2;
  height: auto;
  line-height: 20px;
}
dd > span:nth-child(1) {
  display: inline-block;
  width: 70px;
  text-align: right;
}
.text {
  color: #fbfeff;
}
</style>
<style>
</style>
