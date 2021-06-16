<template>
  <el-menu-item :index="index">
    <i class='triangle left-top'></i>
    <i class='triangle right-bottom'></i>
    <span slot="title"
      class='text'>{{text}}</span>
  </el-menu-item>
</template>
<script>
export default {
  name: "sider-el-menu-sub-item",
  components: {},
  props: {
    index: {
      type: String,
      required: false
    },
    text: {
      type: String,
      required: false
    },
  },
  data() {
    return {
    };
  },
  watch: {

  },
  computed: {},
  created() {
    // alert('345')
  },
  methods: {
  }
};
</script>
<style scoped lang="scss">
</style>
<style lang="scss">

</style>


