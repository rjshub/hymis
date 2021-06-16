<template>
  <div class="more">
    <div v-if="!isLoadingMore"
      @click="getMore"
      class="loading-more">
      <!-- el-icon-arrow-up -->
      <!-- el-icon-arrow-down -->
      <i :class="class_c"
        style="color:#9FA2A9;"></i>
      <span style="color:#8B9094;">{{title}}</span>
    </div>
    <div v-else>
      <i class="el-icon-loading"
        style="color:#9FA2A9;"></i>
      <span style="color:#8B9094;">{{$t('lang.public_loading')}}</span>
    </div>
  </div>

</template>

<script>
import _ from "lodash";
import fetch from "@/services/fetch";

export default {
  name: "getMore",
  components: {
    //子组件
  },
  props: {
    isLoadingMore: {
      type: [Boolean],
    },
    direction:{
      type: [Boolean,Number,String],
      default: true//true是向上  false是向下
    },
    title:{
      type: String,
      default: '加载更多'
    },
  },
  data() {
    return {
    };
  },
  computed: {
    class_c(){
      return this.direction?'el-icon-arrow-down':'el-icon-arrow-up'
    }
  },
  watch: {},
  created() {
    //初始化,无法操作dom
  },
  mounted() {},
  methods: {
    getMore() {
      this.$emit("more");
    }
  }
};
</script>
<style scoped>
.more {
  position: relative;
  z-index: 1;
  height: 18px;
  text-align: center;
  border-top: 1px solid black;
  background-color: #434a54;     /*(背景调换)项目列表收起展开背景*/
  margin-top: -1px;
  padding: 15px 0;
}

.more .loading-more {
  display: inline-block;
  cursor: pointer;
}
</style>

<style>
/*全局部分*/
</style>