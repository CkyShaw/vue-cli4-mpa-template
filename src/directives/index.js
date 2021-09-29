/* !
 * 全局指令插件
 */
import clickoutside from './clickoutside'

const directives = [clickoutside]

const install = function (Vue) {
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
	clickoutside
}
