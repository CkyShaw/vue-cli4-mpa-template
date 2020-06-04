export default {
	name: 'pin',
	bind(el, binding) {
		let postion = binding.modifiers
		if (binding.value) {
			el.style.position = 'fixed'

			if (JSON.stringify(postion) != '{}') {
				el.style.transform = 'initial'
				el.style.top = 'initial'
				for (let key in postion) {
					el.style[key] = '0px'
				}
			} else {
				el.style.top = '50%'
				el.style.transform = 'translateY(-50%)'
				el.style.left = '50%'
				el.style.transform = 'translateX(-50%)'
			}

			if (binding.arg === 'current') {
				el.style.background = '#F14F9A'
			}
		} else {
			el.style.position = 'static'
		}
	},
	update(el, binding) {
		let postion = binding.modifiers
		if (binding.value) {
			el.style.position = 'fixed'

			if (JSON.stringify(postion) != '{}') {
				el.style.transform = 'initial'
				el.style.top = 'initial'
				for (let key in postion) {
					el.style[key] = '0px'
				}
			} else {
				el.style.top = '50%'
				el.style.transform = 'translateY(-50%)'
				el.style.left = '50%'
				el.style.transform = 'translateX(-50%)'
			}

			if (binding.arg === 'current') {
				el.style.background = '#F14F9A'
			}
		} else {
			el.style.position = 'static'
		}
	}
}
