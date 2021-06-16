<template>
  <tpl title="Basic Data" :hasSearch='true'
      @click-event='clickEvent'>
    <div class="box">
      <p class="table-head">
        <span class="media">Media</span>
        <span class="market">Market</span>
        <span class="reach_goal">{{$t('lang.AS_detail_basic_data_preview_config.reach_goal')}}</span>
        <span class="customer_cpm" :title="$t('lang.AS_detail_basic_data_preview_config.customer_cpm')">{{$t('lang.AS_detail_basic_data_preview_config.customer_cpm')}}</span>
      </p>
      <p v-for="(item,i) in data"
          :key="i"
          class="table-item">
        <span class="media"
            :title="item.media">{{item.media}}</span>
        <span class="market"
            :title="item.market">{{item.market}}</span>
        <span class="reach_goal">{{item.media_supply}}</span>
        <span class="customer_cpm">{{item.customer_cpm}}</span>
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
  name: "basic-data-preview",
  components: { tpl },
  props: {
    data: {
      type: [Object,Array],
      required: true,
      default: function() {
        return [
          /* {
            media: "芒果TVSSSSSS",
            market: "上海市",
            reach_goal: "4+30%",
            customer_cpm: "81.0000"
          },
          {
            media: "芒果TV",
            market: "浙江省浙江省浙江省浙江省",
            reach_goal: "2+40%",
            customer_cpm: "91.0000"
          },
          {
            media: "芒果TV",
            market: "天津市",
            reach_goal: "3+25%",
            customer_cpm: "81.0000"
          },
          {
            media: "芒果TV",
            market: "天津市",
            reach_goal: "3+25%",
            customer_cpm: "81.0000"
          },
          {
            media: "芒果TV",
            market: "天津市",
            reach_goal: "3+25%",
            customer_cpm: "81.0000"
          },
          {
            media: "芒果TV",
            market: "南京市",
            reach_goal: "4+15%",
            customer_cpm: "69.0000"
          } */
        ];
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
    ...mapState("project", ["log_info","preview_data"]),
    ...mapGetters("project", ["log_info_render"]),
    showSearch(){
      return !!(this.preview_data.RG.length||this.preview_data.TC.length)
    },
    firstLog() {
      return this.log_info_render[0];
    }
  },
  created() {},
  mounted() {
  },
  methods: {
    clickEvent() {
      this.$eventHub.$emit("OPEN-BASIC-DATA");
    },
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
  background: #343434;   
  height: 30px;
  line-height: 30px;
}
.table-item {
  background-color: #4a4a4a; 
  border-bottom: 1px solid #1e1e1e;
  height: 30px;
  line-height: 30px;
  
}
.media {
  
  width: 74px;
  padding-left: 14px;
}
.market {

  width: 63px;
}
.reach_goal {
  width: 103px;
}
.customer_cpm {
}
</style>
<style>
</style>
