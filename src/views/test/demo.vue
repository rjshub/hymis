<template>

</template>
<script>

import _ from "lodash";
import moment from "moment";
import fetch from "@/services/fetch";

export default {
  name: "demo",
  data() {
    return {
      
    };
  },
  watch: {},
  computed: {
    
  },
  created() {},
  mounted() {
    this.init();
  },
  methods: {
    
    async init(url, data, hasLoading = false) {
      hasLoading && (this.isLoading = true);
      try {
        let _data = await fetch.post(url, data);
        return _data;
      } catch (err) {
        this.$message.error(err.message);
        throw err;
      } finally {
        hasLoading && (this.isLoading = false);
      }
    },

  }
};
</script>
<style scoped>

</style>
<style>

</style>
