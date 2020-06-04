import pin from './pin'

pin.install = Vue => {
	Vue.directive(pin.name, pin)
}

export default pin
