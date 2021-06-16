<template>
  <div class="log-box">
    <log-win :list='log_info_render' />
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";
import _ from "lodash";
import logWin from "@/views/public/log-win";
import fetch from "@/services/fetch";

export default {
  name: "RunLog",
  components: {
    logWin
  },
  data() {
    return {
      isLoading: false,
    };
  },
  watch: {},
  computed: {
    ...mapGetters("project", ["log_info_render"]),
  },
  created() {
    this.fetch_log_info();
  },
  mounted() {},
  methods: {
    ...mapActions("project", ["fetch_log_info"]),
  }
};
</script>
<style scoped lang="scss">
.log-box{
  display: flex;
  justify-content: flex-end;
}
</style>
<style>
</style>
