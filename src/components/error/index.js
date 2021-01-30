import error401 from './error401'
import error404 from './error404'
import error500 from './error500'

const components = [error401, error404, error500]

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
	error401,
	error404,
	error500
}
