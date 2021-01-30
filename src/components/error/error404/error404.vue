<template>
	<error-content code="404" desc="Oh~~您的页面好像飞走了~" :src="src" />
</template>

<script>
import error404 from '@/assets/img/error-page/error-404.svg'
import errorContent from '../error-common/error-content.vue'
export default {
	name: 'error404',
	components: {
		errorContent
	},
	data() {
		return {
			src: error404
		}
	}
}
</script>
