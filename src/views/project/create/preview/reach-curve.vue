<template>
  <tpl title="Reach Curve"
      @click-event='clickEvent'>
    <div class="box">
      <div class="area">{{data.area}}</div>
      <p v-for="(item,i) in data.list"
          :key="i"
          class="table-item">
        <span class="total_imp"
            :title="item.total_imp">{{item.total_imp}}</span>
        <span class="num"
            :class="{yellow:data.value==item['0']}"
            :title="$formatNumber(item['0'],4,'')">{{$formatNumber(item['0'],4,'')}}</span>
        <span class="num"
            :class="{yellow:data.value==item['1']}"
            :title="$formatNumber(item['1'],4,'')">{{$formatNumber(item['1'],4,'')}}</span>
        <span class="num"
            :class="{yellow:data.value==item['2']}"
            :title="$formatNumber(item['2'],4,'')">{{$formatNumber(item['2'],4,'')}}</span>
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
  name: "reach-curve-preview",
  components: { tpl },
  props: {
    data: {
      type: [Object,Array],
      required: true,
      default: function() {
        return {
          /* area: "上海市",
          value: 30,
          list: [
            /* {
              total_imp: "Total Imp",
              "0": 46928199,
              "1": 30,
              "2": 49274609
            },
            {
              total_imp: "2+(%)",
              "0": 30,
              "1": 63.7963076723202,
              "2": 64.9785175858145
            },
            {
              total_imp: "3+(%)",
              "0": 43.8531407462299,
              "1": 44.8271890097653,
              "2": 45.7914218707495
            },
            {
              total_imp: "4+(%)",
              "0": 29.5415395876528,
              "1": 30.2383064532364,
              "2": 30.9319422497825
            },
            {
              total_imp: "5+(%)",
              "0": 22.6640403970254,
              "1": 23.212514163599,
              "2": 23.7595688383353
            },
            {
              total_imp: "6+(%)",
              "0": 18.0266794706143,
              "1": 18.472314302358,
              "2": 18.9173163945214
            } 
          ]*/
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
    ...mapGetters("project", ["log_info_render"]),
    
  },
  created() {},
  mounted() {
  },
  methods: {
    clickEvent() {
      this.$eventHub.$emit("OPEN-REACH-CURVE");
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
.yellow {
  color: #f9ca04;
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
.total_imp {
  width: 74px;
  padding-left: 14px;
}
.num {
  width: 83px;
}
.area {
      position: absolute;
    top: -22px;
    right: 0px;
    padding: 3px;
  background: #43a998;  /*(背景调换)新建项目第二步预览区域Reach Curve地域显示*/
}
</style>
<style>
</style>
