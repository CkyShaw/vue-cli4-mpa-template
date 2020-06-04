import 'core-js/stable'
import 'regenerator-runtime/runtime'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 实际打包时应该不引入mock
/* eslint-disable */
if (process.env.NODE_ENV !== 'production') require('@/mock')

// iView 全局(按需引入接入体积优化有问题，会固定引入iview.min.js)
import iView from 'view-design/dist/iview.min.js'
import 'view-design/dist/styles/iview.css'
Vue.use(iView)

// ElementUI 按需
import { Loading, Scrollbar, Tree, Table, TableColumn, Option } from 'element-ui'
const ElementUI = [Loading, Scrollbar, Tree, Table, TableColumn, Option]

// Antd 按需
import { Icon, Spin } from 'ant-design-vue'
const Antd = [Icon, Spin]

// iviewDev 按需
import { ocxModal, ocxMessage } from '@/components/iview-dev'
const iviewDev = [ocxModal, ocxMessage]

// NativeUI 原生组件库
import { chart } from '@/components/native-ui'
const NativeUI = [chart]

// 捆绑注册
function* register(name) {
	Vue.use(name)
}
;[...ElementUI, ...Antd, ...iviewDev, ...NativeUI].forEach(component => register(component).next())

// 挂载api
import api from './api'
Vue.prototype.$_api = api

// 当前模块全局 mqtt连接
import { client, listen, stop } from '@/libs/mqtt'
Vue.prototype.$_mqtt = client
Vue.prototype.$_listen = listen
Vue.prototype.$_stop = stop

// 图表
import echarts from 'echarts/dist/echarts.min.js'
Vue.prototype.$_echarts = echarts

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

/**
 * 多模块相同集中配置
 * rem响应设置 样式重置 基本过渡效果 字体文件
 */
// 动态响应rem
import '@/libs/rem'
// 重置样式
import '@/assets/style/base.css'
// 全局过渡效果
import '@/assets/style/transition.css'
// 当前模块滚动条样式
import './assets/style/webkit-scrollbar.css'
// 字体文件
import '@/assets/font/font.css'

Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
