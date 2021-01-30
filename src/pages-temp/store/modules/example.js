export default {
	// 状态
	state: {
		count: 8
	},
	// 改变状态的标识方法
	mutations: {
		ADD_HANDLE: state => {
			state.count++
			console.log('+1')
		},
		SUB_HANDLE: (state, json) => {
			state.count -= json.a + json.b
			console.log('-5')
		}
	},
	// 异步的执行 mutations
	actions: {
		addHandle({ commit }) {
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					commit('ADD_HANDLE')
					resolve()
					reject()
				}, 700)
			})
		},
		subHandle({ commit }, number) {
			return new Promise(resolve => {
				setTimeout(() => {
					commit('SUB_HANDLE', number)
					resolve()
				}, 700)
			})
		},
		groupHandle({ dispatch }) {
			return dispatch('addHandle').then(() => {
				dispatch('subHandle', { a: 2, b: 3 })
			})
		},
		async actionA({ dispatch, commit }) {
			commit('ADD_HANDLE', await dispatch('addHandle'))
		},
		async actionB({ dispatch, commit }) {
			await dispatch('actionA') // 等待 actionA 完成
			commit('SUB_HANDLE', { a: 2, b: 3 }, await dispatch('subHandle', { a: 2, b: 3 }))
		}
	}
	/*getters : {
		decorateCount(state) {
			return `当前数值：${state.count}`
		}
	}*/
}
