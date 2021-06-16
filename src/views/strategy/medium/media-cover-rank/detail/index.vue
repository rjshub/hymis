<template>
  <div class="box media-detail"
    v-loading="isLoading">
    <device-num v-bind="deviceNumProps"></device-num>
    <device-chart ref="refDeviceChart" ></device-chart>
    <div class="ratio-wrap">
      <sex-ratio v-bind="sexRatioProps"></sex-ratio>
      <age-ratio :list='ageRatioList' :age_total='age_total'></age-ratio>
    </div>
    <div class="region-wrap">
      <region ref="refRegion" :list='regionList'></region>
      <region-rank :list='regionRankList'></region-rank>
    </div>

  </div>
</template>
<script>
const AreaMap = {
	'新疆维吾尔自治区': "新疆",
	'西藏自治区': "西藏",
	'内蒙古自治区': "内蒙古",
	'青海省': "青海",
	'四川省': "四川",
	'黑龙江省': "黑龙江",
	'甘肃省': "甘肃",
	'云南省': "云南",
	'广西壮族自治区': "广西",
	'湖南省': "湖南",
	'陕西省': "陕西",
	'广东省': "广东",
	'吉林省': "吉林",
	'河北省': "河北",
	'湖北省': "湖北",
	'贵州省': "贵州",
	'山东省': "山东",
	'江西省': "江西",
	'河南省': "河南",
	'辽宁省': "辽宁",
	'山西省': "山西",
	'安徽省': "安徽",
	'福建省': "福建",
	'浙江省': "浙江",
	'江苏省': "江苏",
	'重庆市': "重庆",
	'宁夏回族自治区': "宁夏",
	'海南省': "海南",
	'台湾省': "台湾",
	'北京市': "北京",
	'天津市': "天津",
	'上海市': "上海",
	'香港特别行政区': "香港",
	'澳门特别行政区': "澳门"
}
import _ from "lodash";
import ECharts from "vue-echarts";
import "echarts/theme/dark";
// import 'echarts/theme/light'
import fetch from "@/services/fetch";
import deviceChart from "./device-chart";
import deviceNum from "./device-num";
import ageRatio from "./age-ratio";
import sexRatio from "./sex-ratio";
import regionRank from "./region-rank";
import region from "./region";
// import index from "./index.1";
export default {
  name: "medium-detail",
  // mixins: [index],
  components: {
    // index,
    deviceChart,
    deviceNum,
    ageRatio,
    sexRatio,
    regionRank,
    region
  },
  props: {
  },
  data() {
    return {
      message: "Copy These Text",
      input: "",
      isLoading: false,
      rules: {},
      form: {
        name: "",
        name_en: ""
      },
      deviceNumProps: {},
      sexRatioProps: {},
      ageRatioList: [],
      age_total:'',
      regionRankList: [],
      regionList: [],
    };
  },
  watch: {},
  computed: {},
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    async init() {
      if (this.$route.query.hymis_media_id) {
        this.getDetail(this.$route.query);
      }
    },
    async getDetail({ hymis_media_id, time }) {
      let {
        uvlist,
        area_infos,
        age_infos,
        gender_infos,
        total:{
          gender_infos:gender_total,
          age_infos:age_total,
          area_infos:area_total
        }
      } = await this.fetchCore("/strategy/compute_media_fg_detail", {
        date: time,
        hymis_media_id
        // "date":"2018-09-01","hymis_media_id":1
      }, true);
      // console.log('age_infos:',age_infos)
      // {gender_infos: 6408, age_infos: 6568, area_infos: 10202}
      this.setDeviceNumProps(uvlist[uvlist.length - 1]);
      this.setSexRatioProps({...gender_infos,...{gender_total}});
      this.setAgeRatioList({...{age_infos},...{age_total}});
      this.setRegionRankList(area_infos);
      this.setRegionList({area_infos,...{area_total}});
      this.setDeviceChart(uvlist);
    },
    setDeviceNumProps({ uv, increase }) {
      let o = {
        count: uv,
        range: increase
      };
      this.deviceNumProps = o;
    },
    setSexRatioProps(obj) {
      this.sexRatioProps = obj;
    },
    setDeviceChart(uvlist){
      let [month,device,increase,title] = [[],[],[],''];
      for (let item of uvlist) {
        month.push(item.month)
        device.push(Math.ceil(item.uv))
        increase.push(item.increase.replace('%',''))
      }
      title = this.getDeviceChartTitle(month)
      // console.log('month:',month)
      this.$refs.refDeviceChart.initOptions({month,device,increase,title});
    },
    getDeviceChartTitle(month){
      return month[0].replace('-','.')+'-'+month[month.length-1].replace('-','.')
    },
    getMinMaxVal(arr){
      // console.log("TCL: getMinMaxVal -> arr", arr)
      let max = Math.ceil(_.max(arr));
      let min = Math.floor(_.min(arr));
      return {min,max}
    },
    setRegionList({area_infos,area_total}){
      // console.log("TCL: setRegionList -> area_infos==", area_infos,area_total)
      let keys = Object.keys(AreaMap);
      let list = [];
      let vals = [];
      for (let key of keys) {
        let obj = area_infos.find(i=>i.area==key);
        let value = 0;
        let name = AreaMap[key];
        if (obj) {
          // obj.value = 4357756757.5
          // value = this.$formatNumber(Math.ceil(obj.value),0,'')
          value = Math.ceil(obj.value)
          // console.log("TCL: setRegionList -> value", value)
          vals.push(Math.ceil((obj.value)))
        }else{
          vals.push(value)
        }
        list.push({value,name})
      }
      
      let {min,max} = this.getMinMaxVal(vals);

      /* let rs = [];
      let vals = [];
      for (let item of area_infos) {
        let {value,area:name} = item;
        name = AreaMap[name]
        let tem = {value,name};
        rs.push(tem)
      }
      this.regionList = rs; */
      // console.log('list:',list)
      this.$refs.refRegion.initOptions({list,min,max,area_total});
      // console.log("TCL: setRegionList -> rs", JSON.stringify(rs))
    },
    setRegionRankList(area_infos){
      var area_infos = area_infos.slice(0,10)
      let rs = [];
      for (let item of area_infos) {
        let {value,percent,area:name} = item;
        name = AreaMap[name]
        percent = percent.replace('%','')-0
        let tem = {value,name,percent};
        rs.push(tem)
      }
      this.regionRankList = rs;
    },
    setAgeRatioList({age_infos,age_total}) {
      // console.log("TCL: setAgeRatioList -> age_infos", age_infos,age_total)
      // let map = {
      //   "19以下": "under_18",
      //   "19-25岁": "bt_19_25",
      //   "26-30岁": "bt_26_30",
      //   "31-40岁": "bt_31_40",
      //   "40-50岁": "bt_41_50",
      //   "50岁以上": "above_50"
      // };
      // let arr = ["19以下","19-25岁","26-30岁","31-40岁","40-50岁","50岁以上"];
      // let rs = [];
      // for (let item of arr) {
      //   let {value,percent} = age_infos[map[item]];
      //   percent = percent.replace('%','')-0
      //   let tem = {value,name:item,percent};
      //   rs.push(tem)
      // }
      // this.ageRatioList = rs;
      const map2 = {
        "under_18": this.$t('lang.public_under_19'),
        "bt_19_25": `19-25 ${this.$t('lang.AS_detail_years_old')}`,
        "bt_26_30": `26-30 ${this.$t('lang.AS_detail_years_old')}`,
        "bt_31_40": `31-40 ${this.$t('lang.AS_detail_years_old')}`,
        "bt_41_50": `41-50 ${this.$t('lang.AS_detail_years_old')}`,
        "above_50": this.$t('lang.public_over_50')
      }
      let keys = Object.keys(age_infos)
      let result = []
      keys.forEach(item => {
        if (map2.hasOwnProperty(item)) {
          const param = {
            name: map2[item],
            value: age_infos[item].value,
            percent: age_infos[item].percent.replace('%','')-0
          }
          result.push(param)
        }
      })
      this.ageRatioList = result;
      this.age_total = age_total;
    },
    getParam() {
      let param = {
        name: this.form.name,
        name_en: this.form.name_en
      };

      if (!this.isNew) {
        param.id = this.id;
      }

      return param;
    },
    async fetchCore(url, data, hasLoading = false) {
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
    }
  }
};
</script>
<style scoped lang="scss">
.media-detail {
  margin: 0px;
  padding: 0;
  color: #939aa2;
}
.ratio-wrap {
  height: 332px;
  margin: 10px 0;
  display: flex;
}
.region-wrap {
  display: flex;
}
</style>
<style lang="scss">
figure .echarts {
  width: 100%;
  min-width: 400px;
  height: 300px;
}
</style>

