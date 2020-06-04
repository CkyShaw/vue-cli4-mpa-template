import chart from './chart.vue'

chart.install = function(Vue) {
	Vue.component(chart.name, chart)
}

export default chart
