<template>
  <tpl :title="$t('lang.AS_detail_component_table_title')"
      @click-event='clickEvent'>
    <div class="box">
      <p class="table-head">
        <span class="market">Market</span>
        <span class="real_reach">{{getType=='goal_cpm'? $t('lang.AS_detail_component_table_preview_config.goal_cpm'):$t('lang.AS_detail_component_table_preview_config.real_reach')}}</span>
        <span class="real_cpm" :title="$t('lang.AS_detail_component_table_preview_config.real_cpm')">{{$t('lang.AS_detail_component_table_preview_config.real_cpm')}}</span>
        <span class="customer_total_cost" :title="$t('lang.AS_detail_component_table_preview_config.customer_total_cost')">{{$t('lang.AS_detail_component_table_preview_config.customer_total_cost')}}</span>
      </p>
      <p v-for="(item,i) in data"
          :key="i"
          class="table-item">
        <span class="market"
            :title="item.market">{{item.market}}</span>
        <span class="real_reach">{{getType=='goal_cpm'?$formatNumber(item.goal_cpm,0,''):item.real_reach}}</span>
        <span class="real_cpm">{{$formatNumber(item.real_cpm,0,'')}}</span>
        <span class="customer_total_cost"> {{$formatNumber(item.customer_total_cost,4,'')}}</span>
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
  name: "component-table-preview",
  components: { tpl },
  props: {
    data: {
      type: [Object,Array],
      required: true,
      default: function() {
        return [
          /* {
            market: "上海市",
            real_reach: "4+30.24%",
            real_cpm: 48100,
            customer_total_cost: 2863545
          },
          {
            market: "北京市",
            real_reach: "3+35.66%",
            real_cpm: 41495,
            customer_total_cost: 2741032
          },
          {
            market: "南京市",
            real_reach: "4+15%",
            real_cpm: 12051,
            customer_total_cost: 779649
          },
          {
            market: "天津市",
            real_reach: "3+26.13%",
            real_cpm: 12856,
            customer_total_cost: 879938
          },
          {
            market: "浙江省",
            real_reach: "2+40.25%",
            real_cpm: 9459,
            customer_total_cost: 634522
          },
          {
            market: "Total",
            real_reach: "",
            real_cpm: 123961,
            customer_total_cost: 7898686
          }
         */];
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
    getType(){
      let type = 'goal_cpm'
      if (this.data[0]['real_reach']) {
        type = 'reach_goal'
      }
      return type
    },

  },
  created() {},
  mounted() {
  },
  methods: {
    clickEvent() {
      this.$eventHub.$emit("OPEN-COMPONENT-TABLE");
    }
  }
};
</script>
<style scoped>
p {
  display: flex;
  flex-wrap: nowrap;
}
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
  background: #343434;   /*(背景调换)新建项目分量表信息展示表头*/
  height: 30px;
  line-height: 30px;
}
.table-item {
  background-color: #4a4a4a;  /*(背景调换)新建项目分量表信息展示表头*/
  border-bottom: 1px solid #1e1e1e;
  height: 30px;
  line-height: 30px;
}

.market {
  width: 80px;
  padding-left: 14px;
}
.real_reach,.real_cpm{
  width: 80px;
}
</style>
<style>
</style>
