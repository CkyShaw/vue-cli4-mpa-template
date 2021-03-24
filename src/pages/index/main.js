import 'core-js/stable'
import 'regenerator-runtime/runtime'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
Vue.use(Antd)

import DsaDesign from 'dsa-design'
import 'dsa-design/lib/theme-chalk/index.css'
Vue.use(DsaDesign)

// 挂载api
import api from './api'
Vue.prototype.$_api = api

// dsa utils
/*import * as dsaUtils from 'dsa-utils'
Vue.prototype.$_d = dsaUtils*/

// bbo
/*import bbo from 'bbo'
Vue.prototype.$_b = bbo*/

// 当前模块全局 mqtt连接
/*import { client, listen, stop } from './libs/mqtt'
Vue.prototype.$_mqtt = client
Vue.prototype.$_listen = listen
Vue.prototype.$_stop = stop*/

// 图表
/*let echarts = require('echarts')
Vue.prototype.$_echarts = echarts*/

// HighCharts 补充Echarts 特别是3D方面
/*import Highcharts from 'highcharts/highstock';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsDrilldown from 'highcharts/modules/drilldown';
import Highcharts3D from 'highcharts/highcharts-3d';
import Highmaps from 'highcharts/modules/map';
HighchartsMore(Highcharts)
HighchartsDrilldown(Highcharts);
Highcharts3D(Highcharts);
Highmaps(Highcharts);
Vue.prototype.$_highCharts = Highcharts*/

// 设置根字体
import '@/libs/rem-parent'

Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
