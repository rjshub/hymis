<template>
  <div class="chart-container">
    <figure>
      <v-chart :options="options"
        ref="bar"
        :theme="chartTheme"
        autoresize />
    </figure>
  </div>
</template>
<script>
import _ from "lodash";
import fetch from "@/services/fetch";
import theme from '@/views/mixin/theme/chart-option.vue'

export default {
  name: "medium-detail",
  components: {
  },
  mixins: [theme],
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
        grid: {
          left: "10%",
          // right:"7%",
          bottom: "40",
          top: "100"
        },
        backgroundColor: "#2c333f",   
        title: {
          text: `xx-xx${this.$t('lang.MS_uv_no_unit')}`,
          textStyle: {
            color: "#ffffff",
            fontWeight: "lighter",
            fontSize: 16
          },
          left: 20,
          top: 20

          // subtext: "纯属虚构"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross", //line
            label: {
              backgroundColor: "#283b56"   
            }
          }
        },
        legend: {
          // padding: 5,
          top: 20,
          textStyle: {
            color: "#ffffff"
          },
          // data: ["月独立设备数（万台）", "环比增幅（%）"]
          // data: ["月独立设备数（万台）"]
          data: [this.$t('lang.MS_uv')]
        },

        dataZoom: {
          show: false,
          start: 0,
          end: 100
        },
        xAxis: [
          {
            axisTick: {
              inside: false
            },
            axisLine: {
              lineStyle: {
                // color:"#acadb5",
                color: "#ffffff"
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: "#acadb5"
              }
            },
            type: "category",
            boundaryGap: true,
            data: []
          }
        ],
        yAxis: [
          {
            splitLine: {
              //控制网格线是否显示
              lineStyle: {
                type: "dotted",
                color: "#424853"
              }
            },
            axisLine: {
              lineStyle: {
                // color:"#acadb5",
                color: "#ffffff"
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: "#acadb5"
              },
              formatter: "{value}"
            },
            scale: true,
            type: "value",
            // name: "设备数(万台)",
            name: this.$t('lang.MS_devices'),
            // axisLabel: {
            //   formatter: "{value}"
            // }
          },
          /* {
            splitLine: {
              lineStyle: {
                type: "dotted",
                color: "#424853"
              }
            },
            axisLine: {
              lineStyle: {
                // color:"#acadb5",
                color: "#ffffff"
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: "#acadb5"
              }
            },
            scale: true,
            type: "value",
            name: "增幅(%)",
            axisLabel: {
              formatter: "{value}"
            }
          } */
        ],
        series: [
          {
            itemStyle: {
              color: "#02f5c8",
              opacity: 0.5
            },
            lineStyle: {
              type: "dashed"
            },
            // xAxisIndex: 0,
            // yAxisIndex: 1,
            // name: "月独立设备数（万台）",
            name: this.$t('lang.MS_uv'),
            type: "bar",
            barWidth:'60%',
            yAxisIndex: 0,
            data: []
          },
          /* {
            smooth: true, //平滑曲线
            itemStyle: {
              // color:"#26f2ff",
              normal: {
                color: "#26f2ff", // 会设置点和线的颜色，所以需要下面定制 line
                borderColor: "#26f2ff" // 点边线的颜色
              }
            },
            lineStyle: {
              normal: {
                color: "#26f2ff" // 线条颜色
              }
            },
            markPoint: {
              emphasis: {
                itemStyle: {
                  opacity: 0.1
                }
              }
            },
            symbol: "circle", // 默认是空心圆（中间是白色的），改成实心圆
            symbolSize: 6,
            yAxisIndex: 1,
            name: "环比增幅（%）",
            type: "line",
            data: []
          } */
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

  },
  mounted() {
    this.$refs.bar.showLoading({
      text: 'Loading…',
      color: '#4ea397',
      textColor: 'rgba(255, 255, 255, 0.5)',
      maskColor: '#2C333F'
    })
  },
  methods: {
    initOptions({ month, device, increase,title }) {
      let cloneOptions = _.cloneDeep(this.options);

      cloneOptions.title.text=title+this.$t('lang.MS_uv_no_unit'),
      cloneOptions.xAxis[0]["data"] = month;
      cloneOptions.series[0]["data"] = device;
      // cloneOptions.series[1]["data"] = increase;

      this.options = cloneOptions;
      this.$refs.bar.hideLoading()
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

