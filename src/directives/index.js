/*!
 * 全局指令插件
 */
import mapCenter from './map-center'
import clickoutside from './clickoutside'
import pin from './pin'

const directives = [mapCenter, clickoutside, pin]

const install = function(Vue) {
	directives.forEach(directive => {
		Vue.directive(directive.name, directive)
	})
}

if (typeof window !== 'undefined' && window.Vue) {
	install(window.Vue)
}

export default {
	version: '1.0.0',
	install,
	mapCenter,
	clickoutside,
	pin
}
