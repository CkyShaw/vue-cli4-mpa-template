/*!
 * 基于iview的二次封装组件库
 */
import FilterTree from './filter-tree'
import ocxModal from './ocx-modal'
import ocxMessage from './ocx-message/ocx-message.js'

const components = [FilterTree, ocxMessage]

const install = function (Vue) {
	components.forEach(component => {
		Vue.component(component.name, component)
	})
	Vue.prototype.$ocxMessage = ocxMessage
	Vue.component('ocx-modal', ocxModal)
	Vue.prototype.$ocxModal = ocxModal
}

if (typeof window !== 'undefined' && window.Vue) {
	install(window.Vue)
}

export default {
	version: '2.0.0',
	install,
	FilterTree,
	ocxModal,
	ocxMessage
}
