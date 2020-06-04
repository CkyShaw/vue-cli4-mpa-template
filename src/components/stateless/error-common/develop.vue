<template>
	<div class="develop">
		<!-- <Alert type="warning">模块开发中...</Alert> -->
		<Card style="width:350px">
			<p>功能开发中,敬请期待...</p>
		</Card>
	</div>
</template>
<script>
export default {
	name: 'develop',
	components: {},
	props: {},
	data() {
		return {}
	},
	computed: {},
	filters: {},
	watch: {},
	created() {},
	mounted() {},
	activated() {},
	updated() {},
	beforeDestroy() {},
	methods: {},
	beforeRouteEnter(to, from, next) {
		next()
	},
	beforeRouteUpdate(to, from, next) {
		next()
	},
	beforeRouteLeave(to, from, next) {
		next()
	}
}
</script>
<style lang="stylus" scoped>
.develop {
.ivu-card-body{
    width 100%;
    height 100%;
    p{
        font-size 18px;
    }
}
}
</style>
