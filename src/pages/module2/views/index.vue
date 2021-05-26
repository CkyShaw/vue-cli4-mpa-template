<template>
	<div id="views">
		<div id="nav">
			<router-link to="/home">Home</router-link> | <router-link to="/about">About</router-link> | 模块2
		</div>
		<router-view />
	</div>
</template>

<script>
export default {
	name: 'views',
	components: {},
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

<style lang="stylus">
#views {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;

	#nav {
		padding: 30px;
		a {
			font-weight: bold;
			color: #2c3e50;

			&.router-link-exact-active {
				color: #42b983;
			}
		}
	}
}
</style>
