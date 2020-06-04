import ocxModal from './confirm'

let modalInstance

function getModalInstance(render = undefined) {
	modalInstance =
		modalInstance ||
		ocxModal.newInstance({
			closable: false,
			maskClosable: false,
			footerHide: true,
			render: render
		})

	return modalInstance
}

function confirm(options) {
	const render = 'render' in options ? options.render : undefined
	let instance = getModalInstance(render)

	options.onRemove = function() {
		modalInstance = null
	}

	instance.show(options)
}

ocxModal.info = function(props = {}) {
	props.icon = 'info'
	props.showCancel = false
	return confirm(props)
}

ocxModal.success = function(props = {}) {
	props.icon = 'success'
	props.showCancel = false
	return confirm(props)
}

ocxModal.warning = function(props = {}) {
	props.icon = 'warning'
	props.showCancel = false
	return confirm(props)
}

ocxModal.error = function(props = {}) {
	props.icon = 'error'
	props.showCancel = false
	return confirm(props)
}

ocxModal.confirm = function(props = {}) {
	props.icon = 'confirm'
	props.showCancel = true
	return confirm(props)
}

ocxModal.remove = function() {
	if (!modalInstance) {
		// at loading status, remove after Cancel
		return false
	}

	const instance = getModalInstance()

	instance.remove()
}

/* istanbul ignore next */
ocxModal.install = function(Vue) {
	Vue.component('ocx-modal', ocxModal)
	Vue.prototype.$ocxModal = ocxModal
}

export default ocxModal
