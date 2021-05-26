<template>
	<div class="home">
		<img alt="Vue logo" src="../assets/img/logo.png" />
		<hello-world msg="Welcome to Your Vue.js App" />
	</div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/hello-world.vue'

export default {
	name: 'home',
	components: { HelloWorld },
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
.home {

}
</style>
