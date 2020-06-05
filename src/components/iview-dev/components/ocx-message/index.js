import ocxMessage from './ocx-message.js'

/* istanbul ignore next */
ocxMessage.install = function (Vue) {
	Vue.prototype.$ocxMessage = ocxMessage
}

export default ocxMessage
