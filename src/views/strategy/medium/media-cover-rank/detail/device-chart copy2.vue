<template>
  <div>
    <figure>
      <v-chart :options="options"
        ref="bar"
        theme="dark"
        autoresize />
    </figure>
  </div>
</template>
<script>
import _ from "lodash";
import fetch from "@/services/fetch";

export default {
  name: "medium-detail",
  components: {
  },
  props: {
    isNew: {
      //是否是新建 或者 编辑
      type: [Boolean],
      // required: true,
      default: true
    },
    isShow: {
      type: [Boolean]
      // required: true
    },
    id: {
      type: [Number, String]
      // required: false
    },
    name: {
      type: [String]
      // required: false
    },
    name_en: {
      type: [String]
      // required: false
    }
  },
  data() {
    return {
      options: {
        // color:['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "left",
          data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"]
        },
        series: [
          {
            name: "访问来源",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            itemStyle:{

            },
            data: [
              { value: 335, name: "直接访问" },
              { value: 310, name: "邮件营销" },
              { value: 234, name: "联盟广告" },
              { value: 135, name: "视频广告" },
              { value: 1548, name: "搜索引擎" }
            ]
          }
        ]
      },
      message: "Copy These Text",
      input: "",
      isLoading: false,
      rules: {},
      form: {
        name: "",
        name_en: ""
      }
    };
  },
  watch: {},
  computed: {},
  created() {
    // alert(333)
    /* if (!this.isNew) {
      this.form.name = this.name;
      this.form.name_en = this.name_en;
    } */
  },
  mounted() {
    /* this.$refs.bar.showLoading({
      text: "Loading…",
      color: "#4ea397",
      textColor: "rgba(255, 255, 255, 0.5)",
      maskColor: "#2C333F"
    }); */
    setTimeout(() => {

      let color=['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3']
      this.$set(this.options,'color',color);
      
      this.$nextTick(function() {
        this.defaultSelect()
      })

    }, 5000);
  },
  methods: {
    defaultSelect(){
      this.$refs.bar.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: 0
      });
    },
    initOptions({ month, device, increase, title }) {
      this.defaultSelect()
      return
      let cloneOptions = _.cloneDeep(this.options);

      (cloneOptions.title.text = title + "月独立设备数"),
        (cloneOptions.xAxis[0]["data"] = month);
      cloneOptions.series[0]["data"] = device;
      // cloneOptions.series[1]["data"] = increase;

      this.options = cloneOptions;
      this.$refs.bar.hideLoading();
    }
  }
};
</script>
<style scoped>
figure .echarts {
  width: 100%;
  min-width: 400px;
  height: 330px;
}
</style>
<style lang="scss">
.city-create-edit {
  .form .el-form-item__label {
    color: #939aa2;
  }
}
</style>
<style>
</style>

