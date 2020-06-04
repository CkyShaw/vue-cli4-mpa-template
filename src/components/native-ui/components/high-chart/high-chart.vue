<template>
	<div class="high-chart" :id="highChartId"></div>
</template>
<script>
export default {
	name: 'high-chart',
	components: {},
	directives: {},
	filters: {},
	mixins: {},
	props: {
		option: {
			type: Object
		}
	},
	data() {
		return {
			highChartId:
				'id-' +
				Math.random()
					.toString(16)
					.substr(2, 8),
			cloneOption: {}
		}
	},
	computed: {},
	watch: {
		option: {
			handler(newVal, oldVal) {
				this.init()
			},
			deep: true
		}
	},
	created() {},
	mounted() {
		this.init()
	},
	activated() {},
	beforeUpdate() {},
	updated() {},
	beforeDestroy() {},
	methods: {
		init() {
			this.renderHighChart()
		},
		getDataType(data) {
			return Object.prototype.toString.call(data).match(/^\[object\s(.*)\]$/)[1]
		},
		dataDeepCopy(current, target, filter) {
			for (let key in current) {
				if (filter && target[key]) {
					continue
				}
				if (this.getDataType(current[key]) === 'Array') {
					target[key] = []
					this.dataDeepCopy(current[key], target[key], filter)
				} else if (this.getDataType(current[key]) === 'Object') {
					target[key] = {}
					this.dataDeepCopy(current[key], target[key], filter)
				} else {
					target[key] = current[key]
				}
			}
		},
		renderHighChart() {
			// 因为 high charts 特殊的引用链更替不可以直接使用option，会陷入watch循环
			this.dataDeepCopy(this.option, this.cloneOption, false)
			this.$_highCharts.chart(this.highChartId, this.cloneOption)
		}
	},
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
.high-chart {
	width: 100%;
	height: 100%;
}
</style>
