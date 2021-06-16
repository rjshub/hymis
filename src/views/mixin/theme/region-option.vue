<script>
import { mapState } from "vuex";

export default {
  components: {},
  data() {
    return {};
  },
  computed: {
    ...mapState("theme", ["nowThemeInfo"]),
    chartTheme() {
      if (this.nowThemeInfo === "dark-theme") {
        return 'dark';
      } else if (this.nowThemeInfo === "default-theme") {
        return 'light';
      }
    }
  },
  watch: {
    nowThemeInfo: {
      immediate: true,
      handler: "chartOption"
    }
  },
  methods: {
    chartOption() {
      if (this.nowThemeInfo === "dark-theme") {
        this.options.backgroundColor = '#2c333f'
        this.options.title.textStyle.color = '#fff'
      } else if (this.nowThemeInfo === "default-theme") {
        this.options.backgroundColor = '#fff'
        this.options.title.textStyle.color = '#000'
      }
    }
  },
  mounted() {}
};
</script>
<style lang='scss' scoped>
</style>