import 'core-js/stable'
import 'regenerator-runtime/runtime'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
Vue.use(Antd)

import DsaDesign from '@qif/dsa-design'
import '@qif/dsa-design/lib/theme-dark-blue/index.css'
Vue.use(DsaDesign)

// 挂载api
import api from './api'
Vue.prototype.$_api = api

// dsa utils http://172.26.1.231:12000/dsa-utils-doc/index.html
/*import * as dsaUtils from 'dsa-utils'
Vue.prototype.$_d = dsaUtils*/

// bbo https://tnfe.github.io/bbo/#logs
/*import bbo from 'bbo'
Vue.prototype.$_b = bbo*/

// 图表 https://echarts.apache.org/zh/index.html
/*let echarts = require('echarts')
Vue.prototype.$_echarts = echarts*/

// 设置根字体
import '@/libs/rem-children'

Vue.config.productionTip = false

// eslint-disable-next-line vue/require-name-property
new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
