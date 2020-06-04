import highChart from './high-chart.vue'

highChart.install = function(Vue) {
	Vue.component(highChart.name, highChart)
}

export default highChart
