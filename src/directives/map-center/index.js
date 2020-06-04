import mapCenter from './map-center'

mapCenter.install = Vue => {
	Vue.directive(mapCenter.name, mapCenter)
}

export default mapCenter
