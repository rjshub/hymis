<template>
  <div class="strategy-content">
    <div class="clearfix breadcrumb-wrap">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '' }">
          <span class="breadcrumb-item-line">|</span>{{$t('lang.MS_Strategy_management')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <unopened />
  </div>
</template>

<script>
import unopened from "@/views/error/unopened";

export default {
  name: "strategy",
  componentName: "strategy",
  components: { unopened },
  props: {},
  data() {
    return {};
  },

  watch: {},
  created() {},
  mounted() {},
  methods: {
    onSubmit() {}
  }
};
</script>
<style scoped>
</style>
<style>
</style>
<style scoped lang="scss">
.strategy-content{
  margin:0 20px;
}
</style>