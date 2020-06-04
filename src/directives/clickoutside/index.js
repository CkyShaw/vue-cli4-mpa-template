import clickoutside from './clickoutside'

clickoutside.install = Vue => {
	Vue.directive(clickoutside.name, clickoutside)
}

export default clickoutside
