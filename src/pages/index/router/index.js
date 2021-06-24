import Vue from 'vue'
import Router from 'vue-router'
import DsaDesign from '@qif/dsa-design'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

import main from './main'

const router = new Router({
	routes: [...main],
	mode: 'hash'
})
// 加载条配置
/*DsaDesign.LoadingBar.config({
	color: '#0af',
	failedColor: '#fa0',
	height: 3,
	duration: 800
})*/
router.beforeEach((to, from, next) => {
	DsaDesign.LoadingBar.start()
	next()
})
router.afterEach(to => {
	if (to.meta.title) window.document.title = to.meta.title
	DsaDesign.LoadingBar.finish()
	window.scrollTo(0, 0)
})

export default router
