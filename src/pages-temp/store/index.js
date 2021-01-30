import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

// 案例模块
import example from './modules/example'
// 主模块
import main from './modules/main'

Vue.use(Vuex)

const store = new Vuex.Store({
	getters,
	modules: {
		example,
		main
	}
})

export default store
