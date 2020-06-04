<template>
	<div id="App" :class="theme">
		<router-view />
	</div>
</template>
<script>
import settings from '@/config'
import { getQueryObject } from '@/libs/tools'
export default {
	name: 'App',
	data() {
		return {
			theme: 'default-theme'
		}
	},
	mounted() {
		this.init()
	},
	methods: {
		init() {
			if (settings.theme) {
				this.themeInit()
			} else {
				this.theme = ''
			}
		},
		themeInit() {
			this.theme = this.loadThemeByQuery() || this.loadThemeByLocal() || 'default-theme'
		},
		loadThemeByQuery() {
			let theme = getQueryObject(window.location.search).theme
			if (theme) localStorage.setItem('theme', theme)
			return theme
		},
		loadThemeByLocal() {
			let theme = localStorage.getItem('theme')
			return theme
		}
	}
}
</script>
<style lang="stylus">
@import './assets/style/theme/default-theme/index.styl'
@import './assets/style/theme/other-theme/index.styl'
</style>
