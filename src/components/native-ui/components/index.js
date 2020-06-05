import chart from './chart'
import highChart from './high-chart'

const components = [chart, highChart]

const install = function (Vue) {
	if (install.installed) return
	components.forEach(component => {
		Vue.component(component.name, component)
	})
}

if (typeof window !== 'undefined' && window.Vue) {
	install(window.Vue)
}

export default {
	version: '1.0.0',
	install,
	chart,
	highChart
}
