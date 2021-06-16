<template>
  <div class="chart-container">
    <figure style="display: flex;">
      <v-chart :options="options"
        autoresize
        :theme="chartTheme" />
    </figure>
  </div>
</template>
<script>
import _ from "lodash";
import fetch from "@/services/fetch";
import geoCoordMap from "@/services/map/geo-coord-map.json";
import theme from '@/views/mixin/theme/region-option.vue'

function convertData(data) {
  let res = [];
  for (let i = 0; i < data.length; i++) {
    let geoCoord = geoCoordMap[data[i].name];
    if (geoCoord) {
      res.push({
        name: data[i].name,
        value: geoCoord.concat(data[i].value)
      });
    }
  }
  return [];
  return res;
}

export default {
  name: "region-map",
  components: {
  },
  mixins: [theme],
  props: {
    list: {
      //是否是新建 或者 编辑
      type: [Array],
      // required: true,
      default: true
    }
  },
  watch: {
    list: {
      /* handler: function (val, oldVal) {
        console.log(val)
        this.$set(this.options.series[0], 'data', val)
        // .splice()
      },
      deep: true */
    }
  },
  data() {
    let self = this;
    return {
      mapMax: 2333,
      options: {
        tooltip: {
          trigger: "item",
          // formatter: "{b}<br/>{c} (万台)",
          formatter:function(params) {
            return params.name+'<br/>'+self.$formatNumber(params.data.value,0,'')+` ${self.$t('lang.MS_10K_')}`;
            // return params.name+'<br/>'+params.data.value+" (万台)";
          }
        },
        title: {
          /* rich: {
            value: {
                width: 100,
                backgroundColor: 'yellow'
            }
        }, */
          // text: "使用地域占比",
          text: [this.$t('lang.MS_media_cover_rank_Geographical_distribution'), `{b|(${this.$t('lang.MS_media_cover_rank_all_area')})}`].join(""),
          /* subtext:"SKD",
          subtextStyle:{
            align:"right",
            verticalAlign:"top"
          },
          textAlign:"left",
          textVerticalAlign:"top", */
          textStyle: {
            color: "#ffffff",
            fontWeight: "lighter",
            fontSize: 16,
            rich: {
              b: {
                fontSize: 14,
                padding: [0, 0, 0, 8]
              }
            }
          },
          left: 20,
          top: 20
        },
        // backgroundColor: "#f1f2f8",
        backgroundColor: "#2c333f",   /*背景调换，媒介策略->媒介推荐->详情->地图背景*/
        legend: {
          show: false
          // orient: "vertical",
          // left: "left",
          // data: []
        },
        visualMap: {
          min: 800,
          max: 50000,
          text: ["High", "Low"],
          realtime: false, // 拖拽时，是否实时更新。
          calculable: true, // 是否显示拖拽用的手柄（手柄能拖拽调整选中范围）。
          hoverLink: true, // 打开 hoverLink 功能时，鼠标悬浮到 visualMap 组件上时，鼠标位置对应的数值 在 图表中对应的图形元素，会高亮。
          inRange: {
            color: ["#698bb1", "#7dddd1"]
          },
          orient: "horizontal",
          bottom: 20,
          left: 50
        },
        series: [
          {
            name: this.$t('lang.MS_area'),
            // zoom:1.05,
            zoom: 1.1,
            type: "map",
            mapType: "china",
            showLegendSymbol: false, //是否显示 小圆点
            roam: false,
            label: {
              normal: {
                show: true,
                textStyle: {
                  color: "#9C4304"
                }
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                borderColor: "rgba(0, 0, 0, 0.2)",
                borderWidth: 0.5,
                color: "#E87320"
              }
            },
            data: []
          }
        ]
      },
      options2: {
        title: {
          text: this.$t('lang.MS_media_cover_rank_Geographical_distribution'),
          textStyle: {
            color: "#ffffff",
            fontWeight: "lighter",
            fontSize: 16
          },
          left: 20,
          top: 20
          // subtext: "纯属虚构"
        },
        backgroundColor: "#2c333f",  /*背景调换，媒介策略->媒介推荐->详情->地图->未知元素*/
        tooltip: {
          trigger: "item",
          formatter: "{b}<br/>{c} (p / km2)"
        },
        /* legend: {
          orient: "vertical",
          y: "bottom",
          x: "right",
          data: ["pm2.5"],
          textStyle: {
            color: "#fff"
          }
        }, */
        geo: {
          show: true,
          map: "china",
          label: {
            // show:true,
          },
          emphasis: {
            show: true
          },
          itemStyle: {
            normal: {
              areaColor: "#323c48",
              borderColor: "#111"
            },
            emphasis: {
              areaColor: "#2a333d"
            }
          }
        },
        visualMap: {
          min: 800,
          max: 50000,
          text: ["High", "Low"],
          realtime: false, // 拖拽时，是否实时更新。
          calculable: true, // 是否显示拖拽用的手柄（手柄能拖拽调整选中范围）。
          hoverLink: true, // 打开 hoverLink 功能时，鼠标悬浮到 visualMap 组件上时，鼠标位置对应的数值 在 图表中对应的图形元素，会高亮。
          inRange: {
            color: ["#698bb1", "#7dddd1"]
          },
          orient: "horizontal",
          bottom: 60,
          left: 50
        },
        series: [
          {
            name: this.$t('lang.MS_media_cover_rank_Geographical_distribution'),
            type: "map",
            map: "china",
            label: {
              // fontSize:20
            },
            zoom: 1.2,
            label: {
              normal: {
                textStyle: {
                  fontSize: 12,
                  // fontWeight: 'bold',
                  color: "#8b4513"
                }
              }
            },
            // mapType: 'HK', // 自定义扩展图表类型
            itemStyle: {
              normal: { label: { show: true } },
              emphasis: { label: { show: true } }
            }
            // data:convertData(mapData),
          }
        ]
        /* series: [
          {
            name: "pm2.5",
            type: "scatter",
            coordinateSystem: "geo",
            data: convertData(mapData),
            symbolSize: val => val[2] / 10,
            label: {
              normal: {
                formatter: "{b}",
                position: "right",
                show: false
              },
              emphasis: {
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: "#ddb926"
              }
            }
          },
          {
            name: "Top 5",
            type: "effectScatter",
            coordinateSystem: "geo",
            data: convertData(
              mapData.sort((a, b) => b.value - a.value).slice(0, 6)
            ),
            symbolSize: val => val[2] / 10,
            showEffectOn: "render",
            rippleEffect: {
              brushType: "stroke"
            },
            hoverAnimation: true,
            label: {
              normal: {
                formatter: "{b}",
                position: "right",
                show: true
              }
            },
            itemStyle: {
              normal: {
                color: "#f4e925",
                shadowBlur: 10,
                shadowColor: "#333"
              }
            },
            zlevel: 1
          }
        ] */
      }
    };
  },
  watch: {},
  computed: {
    c_options() {
      // this.options.series[0]["data"];
    }
  },
  created() {
    // alert(333)
    /* if (!this.isNew) {
      this.form.name = this.name;
      this.form.name_en = this.name_en;
    } */
  },
  mounted() {},
  methods: {
    initOptions({ list, min, max,area_total }) {
      // console.log("TCL: initOptions -> initOptions", list, min, max,area_total)
      let options = _.cloneDeep(this.options);
      options.series[0]["data"] = list;
      options.visualMap.min = min;
      options.visualMap.max = max;

      options.title.text=this.setTitle(area_total),

      this.options = options;
    },
    setTitle(area_total){
      let total = this.$formatNumber(area_total,0,'')
      let str = `{b|(${this.$t('lang.MS_media_cover_rank_user_total')+total+this.$t('lang.MS_10K')})}`
      return [this.$t('lang.MS_media_cover_rank_Geographical_distribution'), str].join("")
    },
  }
};
</script>
<style scoped>
figure .echarts {
  width: 660px;
  /* width: 722px; */
  height: 510px;
  /* height: 554px; */
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

