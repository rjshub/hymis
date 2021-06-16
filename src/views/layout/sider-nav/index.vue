<template>
  <component class='sider-nav' :is="activeNav"></component>
</template>
<script>
import SystemManage from "./system-manage";
import MediaStrategy from "./media-strategy";
import AllotStrategy from "./allot-strategy";
export default {
  name: "NavDataCenter",
  components: { SystemManage, MediaStrategy,AllotStrategy },
  data() {
    return {};
  },
  watch: {},
  computed: {
    activeNav(){
      const map = {
        '/system':'SystemManage',
        '/strategy':'MediaStrategy',
        '/project':"AllotStrategy",
        '/budget':"AllotStrategy",
      };
      return map[this.$route.meta.nav];
    },
  },
  created() {
      // console.log(this.$route.meta.nav)
  },
  methods: {}
};
</script>
<style scoped lang="scss">

</style>
<style lang="scss">

</style>


