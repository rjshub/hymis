<template>
  <tpl :title="$t('lang.AS_detail_component_table_title_compute')"
      @click-event='clickEvent'>
    <div class="box">
      <p class="table-head">
        <span class="media">Media</span>
        <span class="market">Market</span>
        <span class="goal_cpm" :title="$t('lang.AS_detail_target_CPM')">{{$t('lang.AS_detail_target_CPM')}}</span>
        <span class="component_int">{{$t('lang.AS_detail_allocation')}}</span>
      </p>
      <p v-for="(item,i) in data"
          :key="i"
          class="table-item">
        <span class="media"
            :title="item.media">{{item.media}}</span>
        <span class="market"
            :title="item.market">{{item.market}}</span>
        <span class="goal_cpm">{{$formatNumber(item.goal_cpm,0,'')}}</span>
        <span class="component_int">{{$formatNumber(item.component_int,0,'')}}</span>
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
  name: "component-compute-preview",
  components: { tpl },
  props: {
    data: {
      type: [Object,Array],
      required: true,
      default: function() {
        return [/* {
      "market": "上海市",
      "media": "爱奇艺&PPS",
      "goal_cpm": 48102,
      "component_int": 33665
    }, {
      "market": "上海市",
      "media": "腾讯视频",
      "goal_cpm": 48102,
      "component_int": 364
    }, {
      "market": "上海市",
      "media": "优酷",
      "goal_cpm": 48102,
      "component_int": 661
    }, {
      "market": "上海市",
      "media": "芒果TV",
      "goal_cpm": 48102,
      "component_int": 154
    }, {
      "market": "上海市",
      "media": "搜狐视频",
      "goal_cpm": 48102,
      "component_int": 288
    }, {
      "market": "上海市",
      "media": "乐视",
      "goal_cpm": 48102,
      "component_int": 12968
    }, {
      "market": "北京市",
      "media": "爱奇艺&PPS",
      "goal_cpm": 41496,
      "component_int": 20156
    } */];
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
      this.$eventHub.$emit("OPEN-COMPONENT-COMPUTE");
    },
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
  background: #343434;    /*(背景调换)新建项目分量计算信息展示表头*/
  height: 30px;
  line-height: 30px;
}
.table-item {
  background-color: #4a4a4a;   /*(背景调换)新建项目分量计算信息展示表body*/
  border-bottom: 1px solid #1e1e1e;
  height: 30px;
  line-height: 30px;
  
}
.media {
  width: 80px;
  padding-left: 14px;
}
.market {
  width: 80px;
}
.goal_cpm {
  width: 103px;
}

</style>
<style>
</style>
