<template>
	<div class="not-find">
		<error404></error404>
	</div>
</template>

<script>
import error404 from '@c/error/error404'
export default {
	name: 'not-find',
	components: { error404 },
	directives: {},
	filters: {},
	mixins: {},
	beforeRouteEnter(to, from, next) {
		next()
	},
	beforeRouteUpdate(to, from, next) {
		next()
	},
	beforeRouteLeave(to, from, next) {
		next()
	},
	props: {},
	data() {
		return {}
	},
	computed: {},
	watch: {},
	created() {},
	mounted() {},
	activated() {},
	beforeUpdate() {},
	updated() {},
	beforeDestroy() {},
	methods: {}
}
</script>

<style lang="stylus" scoped>
.not-find {
	width: 100vw;
	height: 100vh;
	position: relative;
}
</style>
