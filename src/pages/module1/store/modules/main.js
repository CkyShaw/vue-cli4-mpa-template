export default {
	state: {
		flag: false
	},
	mutations: {
		flagToggle: state => {
			state.flag = !state.flag
		}
	}
}
