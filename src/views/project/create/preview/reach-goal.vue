<template>
  <tpl title="Reach Goal" :hasSearch='true'
      @click-event='clickEvent'>
    <div class="box">
      <p class="table-head">
        <span class="market">Market</span>
        <span class="ranking">Reach Goal</span>
      </p>
      <p v-for="(item,i) in data"
          :key="i"
          class="table-item">
        <span class="market"
            :title="item.market">{{item.market}}</span>
        <span class="ranking"
            :title="item.ranking">{{item.reach_goal}}</span>
      </p>
    </div>
  </tpl>
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";
import _ from "lodash";
import tpl from "./tpl";
import fetch from "@/services/fetch";

export default {
  name: "reach-goal-preview",
  components: { tpl },
  props: {
    data: {
      type: [Object,Array],
      required: true,
      default: function() {
        return [/* {
      "media": "爱奇艺&PPS",
      "market": "上海市",
      "ranking": "3"
    }, {
      "media": "腾讯视频",
      "market": "上海市",
      "ranking": "1"
    }, {
      "media": "优酷",
      "market": "上海市",
      "ranking": "6"
    }, {
      "media": "芒果TV",
      "market": "上海市",
      "ranking": "2"
    }, {
      "media": "搜狐视频",
      "market": "上海市",
      "ranking": "4"
    }, {
      "media": "乐视",
      "market": "上海市",
      "ranking": "5"
    }, {
      "media": "爱奇艺&PPS",
      "market": "北京市",
      "ranking": "3"
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
    ...mapState("project", ["log_info","preview_data"]),
    showSearch(){
      return !!this.preview_data.BD.length
    },
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
  width: 120px;
  padding-left: 14px;
}
.market {
  padding-left: 40px;
  width: 114px;
}
.ranking {
  padding-left: 40px;
}

</style>
<style>
</style>
