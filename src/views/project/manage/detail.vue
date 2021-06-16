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
          <span class="text">{{formatTime(values.start_time)}}{{$t('lang.public_DatePicker_between')}}{{formatTime(values.end_time)}}</span>
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
          <span class="text">{{formatPort()}}</span>
        </dd>
        <dd>
          <span>{{$t('lang.public_audience_label')}}：</span>
          <span class="text">{{formatGender(values.gender)}}</span>
        </dd>
        <dd>
          <span>{{$t('lang.public_age')}}：</span>
          <span class="text" >{{ageRange()}}</span>
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
      required: true
    },
    values: {
      type: [Object],
      required: true
    }
  },
  data() {
    return {};
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {
    // this.init();
  },
  methods: {
    formatGender(gender) {
      let map = {
        "2": this.$t('lang.public_all'),
        "1": this.$t('lang.public_male'),
        "0": this.$t('lang.public_female')
      };
      return map[gender];
    },
    ageRange() {
      let strArr = [];
      if (this.values.age.length == 0) {
        return this.$t('lang.public_all');
      } else {
        for (const item of this.values.age) {
          strArr.push(item[0] + this.$t('lang.public_DatePicker_between') + item[1] + this.$t('lang.AS_detail_years_old'));
        }
        return strArr.join(" | ");
      }
    },
    formatPort() {
      let arr = this.values.port.split(",");
      let hasOTT = arr.findIndex(i => i == 5) != -1;

      arr = arr.filter(item => {
        return item != 5;
      });

      let OTV_map = {
        "1": "Phone",
        "2": "Pad",
        "3": "PC",
        "4": "Mobile(Phone+Pad)"
      };
      let OTV_str = [];
      let strArr = [];
      for (const item of arr) {
        OTV_str.push(OTV_map[item + ""]);
      }
      if (OTV_str.length) {
        strArr.push("OTV(" + OTV_str.join("+") + ")");
      }
      if (hasOTT) {
        strArr.push("OTT");
      }

      return strArr.join("+");
    },
    formatTime(val) {
      return moment(val).format("YYYY-MM-DD");
    },
    onUpdateVisible(val) {
      this.$emit("update:isShow", val);
    },
    onClose() {
      this.$emit("update:isShow", false);
    }
  }
};
</script>
<style scoped>
dl {
  font-size: 12px;
}
dd {
  color: #939aa2;
  height: 20px;
  line-height: 20px;
}
dd > span:nth-child(1) {
  width: 70px;
  display: inline-block;
  text-align: right;
}
.text {
  color: #fbfeff;
}
</style>
<style>
</style>
