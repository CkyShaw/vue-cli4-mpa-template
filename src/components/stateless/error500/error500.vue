<template>
	<error-content code="500" desc="Oh~~鬼知道服务器经历了什么~" :src="src" />
</template>

<script>
import error500 from '@/assets/img/error-page/error-500.svg'
import errorContent from '../error-common/error-content.vue'
export default {
	name: 'error500',
	components: {
		errorContent
	},
	data() {
		return {
			src: error500
		}
	}
}
</script>
