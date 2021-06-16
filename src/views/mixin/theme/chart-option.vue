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
        this.options.tooltip.axisPointer.label.backgroundColor = '#283b56'
        this.options.legend.textStyle.color = '#fff'
        this.options.xAxis[0].axisLine.lineStyle.color = '#fff'
        this.options.xAxis[0].axisLabel.textStyle.color = '#acadb5'
        this.options.yAxis[0].splitLine.lineStyle.color = '#424853'
        this.options.yAxis[0].axisLine.lineStyle.color = '#fff'
        this.options.yAxis[0].axisLabel.textStyle.color = '#acadb5'
        this.options.series[0].itemStyle.color = '#02f5c8'
        this.options.series[0].itemStyle.opacity = .5
      } else if (this.nowThemeInfo === "default-theme") {
        this.options.backgroundColor = '#fff'
        this.options.title.textStyle.color = '#000'
        this.options.tooltip.axisPointer.label.backgroundColor = '#42a996'
        this.options.legend.textStyle.color = '#000'
        this.options.xAxis[0].axisLine.lineStyle.color = '#333'
        this.options.xAxis[0].axisLabel.textStyle.color = '#333'
        this.options.yAxis[0].splitLine.lineStyle.color = '#999'
        this.options.yAxis[0].axisLine.lineStyle.color = '#333'
        this.options.yAxis[0].axisLabel.textStyle.color = '333'
        this.options.series[0].itemStyle.color = '#42a996'
        this.options.series[0].itemStyle.opacity = 1
      }
    }
  },
  mounted() {}
};
</script>
<style lang='scss' scoped>
</style>