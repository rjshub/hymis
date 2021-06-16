<template>
  <tpl :title="$t('lang.AS_detail_schedule_table_title')"
      @click-event='clickEvent'>
    <div class="box">
      <p class="table-head">
        <span class="site_area">{{$t('lang.AS_detail_schedule_table_preview_config.web_site')}}</span>
        <span class="unit_quantity">{{$t('lang.AS_detail_schedule_table_preview_config.unit_quantity')}}</span>
        <span class="start_day">{{$t('lang.AS_detail_schedule_table_preview_config.start_day')}}</span>
        <span class="end_day">{{$t('lang.AS_detail_schedule_table_preview_config.end_day')}}</span>
      </p>
      <p v-for="(item,i) in data.list"
          :key="i"
          class="table-item">
        <span class="site_area"
            :title="item.market">{{item.site_area}}</span>
        <span class="unit_quantity">{{$formatNumber(item.unit_quantity,0,'')}}</span>
        <span class="start_day">{{item.start_day}}</span>
        <span class="end_day">{{item.end_day}}</span>
      </p>
    </div>
  </tpl>
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";
import _ from "lodash";
import moment from "moment";
import tpl from "./tpl";
import fetch from "@/services/fetch";

export default {
  name: "schedule-table-preview",
  components: { tpl },
  props: {
    data: {
      type: [Object,Array],
      required: true,
      default: function() {
        return {
      /* "adname": "广告NAME1",
      "list": [{
        "site_area": "北京市",
        "unit_quantity": 867,
        "start_day": "2018-10-01",
        "end_day": "2018-10-29"
      }, {
        "site_area": "上海市",
        "unit_quantity": 12968,
        "start_day": "2018-10-01",
        "end_day": "2018-10-29"
      }, {
        "site_area": "天津市",
        "unit_quantity": 536,
        "start_day": "2018-10-01",
        "end_day": "2018-10-29"
      }, {
        "site_area": "浙江省",
        "unit_quantity": 393,
        "start_day": "2018-10-01",
        "end_day": "2018-10-29"
      }, {
        "site_area": "南京市",
        "unit_quantity": 369,
        "start_day": "2018-10-01",
        "end_day": "2018-10-29"
      }] */
    };
      }
    }
  },
  data() {
    return {
      isLoading: false,
      showLog: true,
      hasScrollBar: false
    };
  },
  watch: {},
  computed: {
    ...mapState("project", ["log_info"]),
  },
  created() {},
  mounted() {
  },
  methods: {
    clickEvent() {
      this.$eventHub.$emit("OPEN-SCHEDULE-TABLE");
    }
  }
};
</script>
<style scoped>
p > span {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.box {
  color: #ffffff;
}
.table-head {
  background: #343434;  /*(背景调换)新建项目第二步预览区域表头*/
  height: 30px;
  line-height: 30px;
}
.table-item {
  background-color: #4a4a4a;  /*(背景调换)新建项目第二步预览区域表头*/
  border-bottom: 1px solid #1e1e1e;
  height: 30px;
  line-height: 30px;
}

.site_area {
  width: 80px;
  padding-left: 14px;
}
.site_area,.unit_quantity,.start_day {
  width: 80px;
}

</style>
<style>
</style>
