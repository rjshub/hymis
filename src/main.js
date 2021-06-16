// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'

import Vue from 'vue'
import { sync } from 'vuex-router-sync'

import ElementUI from 'element-ui' 
import 'element-ui/lib/theme-chalk/index.css'

import Animate from 'animate.css'
import '@/assets/css/index.css'
import '@/assets/css/theme/theme.scss'
// 国际化
import VueI18n from 'vue-i18n'
import messages from './VueI18n'




import ECharts from "vue-echarts";
import chinaMap from "@/services/map/china.json";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/line";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/axis";
import "echarts/lib/component/legend";
import "echarts/lib/component/title";
import "echarts/lib/chart/map";
import "echarts/lib/component/visualMap";
import "echarts/lib/chart/pie";
import "echarts/lib/chart/treemap";
import "echarts/lib/component/graphic";
import "echarts/lib/component/toolbox";
import "echarts/lib/component/dataZoom";
import "echarts/lib/component/grid";
import "echarts/theme/dark";
ECharts.registerMap("china", chinaMap);
Vue.component("v-chart", ECharts);


// Vue.use(ElementUI)
Vue.use(Animate)

// import '@/mock'
import math from "mathjs";
math.config({
  number: "BigNumber", // Default type of number:
  precision: 14 // Number of significant digits for BigNumbers
});



import Dialoger from "@/views/public/hy-dialog";
Vue.component("hy-dialog", Dialoger);




import App from './App'

import router from './router'
import store from './store'
import Util from '@/services/util'
Vue.use(Util)

sync(store, router)

// 国际化
// store.state.theme.languageInfo
Vue.use(VueI18n)
const i18n = new VueI18n({
  locale: store.state.user.languageInfo, // 语言标识 //this.$i18n.locale // 通过切换locale的值来实现语言切换
  messages
})
// Vue.config.productionTip = false
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})


// 为了能正常显示图片
if (process.env.NODE_ENV == 'production') {
  Vue.host = Vue.prototype.$host = '/';
}
else {
  Vue.host = Vue.prototype.$host = 'http://192.168.80.11:8004/';
}
// 深拷贝

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  watch: {
    // 监测路径改变相应的 title
    $route: {
      handler: function (route) {
        let title = route.meta && route.meta.title || ''
        document.title = "华扬媒体智能管理系统 - " + title;
      },
      immediate: true
    }
  },
  render(h) {
    return (
      <App />
    )
  }
})
