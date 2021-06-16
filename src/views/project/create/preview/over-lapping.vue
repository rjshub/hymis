<template>
    <tpl title="Overlapping"
        @click-event='clickEvent'>
        <div class="box">
            <p class="table-head">
                <span class="market">Market</span>
                <span class="media">Media1</span>
                <span class="media">Media2</span>
                <span class="overlap" :title="`${$t('lang.third_nav_media_overlap_ranking')}%`">{{$t('lang.third_nav_media_overlap_ranking')}}%</span>
            </p>
            <p v-for="(item,i) in data"
                :key="i"
                class="table-item">
                <span class="market"
                    :title="item.market">{{item.market}}</span>
                <span class="media"
                    :title="item.media1">{{item.media1}}</span>
                <span class="media"
                    :title="item.media2">{{item.media2}}</span>
                <span class="overlap">{{formatOverlap(item.overlap)}}</span>
            </p>
        </div>
    </tpl>
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";
import math from "mathjs";
import _ from "lodash";
import moment from "moment";
import tpl from "./tpl";
import fetch from "@/services/fetch";

export default {
  name: "over-lapping-preview",
  components: { tpl },
  props: {
    data: {
      type: [Object, Array],
      required: true,
      default: function() {
        return [
          /* {
      "market": "上海市",
      "media1": "爱奇艺&PPS",
      "media2": "腾讯视频",
      "overlap": "0.066"
    }, {
      "market": "上海市",
      "media1": "爱奇艺&PPS",
      "media2": "优酷",
      "overlap": "0.061"
    }, {
      "market": "上海市",
      "media1": "爱奇艺&PPS",
      "media2": "芒果TV",
      "overlap": "0.089"
    }, {
      "market": "上海市",
      "media1": "爱奇艺&PPS",
      "media2": "搜狐视频",
      "overlap": "0.186"
    }, {
      "market": "上海市",
      "media1": "爱奇艺&PPS",
      "media2": "乐视",
      "overlap": "0.237"
    }, {
      "market": "上海市",
      "media1": "腾讯视频",
      "media2": "优酷",
      "overlap": "0.144"
    }, {
      "market": "上海市",
      "media1": "腾讯视频",
      "media2": "芒果TV",
      "overlap": "0.016"
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
    ...mapState("project", ["log_info"])
  },
  created() {},
  mounted() {},
  methods: {
    formatOverlap(overlap) {
      let num = math.eval(overlap + "*100") - 0;
      return this.$formatNumber(num, 2, "");
    },

    clickEvent() {
      this.$eventHub.$emit("OPEN-OVER-LAPPING");
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
  background: #343434;  /*(背景调换)新建项目第二步预览区域表头*/
  height: 30px;
  line-height: 30px;
}
.table-item {
  background-color: #4a4a4a;  /*(背景调换)新建项目第二步预览区域表body*/
  border-bottom: 1px solid #1e1e1e;
  height: 30px;
  line-height: 30px;
}
.media {
  width: 88px;
}
.market {
  padding-left: 14px;
  width: 70px;
}
.overlap {
}
</style>
<style>
</style>
