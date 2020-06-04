export default {
	name: 'map-center',
	bind(el) {
		el.style.marginLeft = `${-el.offsetWidth / 2}px`
	},
	inserted(el) {
		el.style.marginLeft = `${-el.offsetWidth / 2}px`
	},
	update(el) {
		el.style.marginLeft = `${-el.offsetWidth / 2}px`
	}
}
