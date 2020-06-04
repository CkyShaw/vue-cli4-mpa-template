import Vue from 'vue'
import Router from 'vue-router'
import iView from 'view-design/dist/iview.min.js'

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

import example from './example'

const router = new Router({
	routes: [...example],
	mode: 'hash'
})
// 加载条配置
/*iView.LoadingBar.config({
    color: '#0af',
    failedColor: '#fa0',
    height: 3,
    duration: 800
})*/
router.beforeEach((to, from, next) => {
	iView.LoadingBar.start()
	next()
})
router.afterEach(to => {
	if (to.meta.title) window.document.title = to.meta.title
	iView.LoadingBar.finish()
	window.scrollTo(0, 0)
})

export default router
