<template>
	<div class="chart" :id="chartId"></div>
</template>
<script>
export default {
	name: 'chart',
	components: {},
	props: {
		option: {
			type: Object
		},
		loading: {
			type: Boolean,
			default: false
		},
		loadingConfig: {
			type: Object,
			default: function() {
				return {
					text: 'loading',
					color: '#c23531',
					textColor: '#000',
					maskColor: 'rgba(255, 255, 255, 0.8)',
					zlevel: 0
				}
			}
		}
	},
	data() {
		return {
			// 动态生成id, 保证多个可以挂载
			chartId:
				'id-' +
				Math.random()
					.toString(16)
					.substr(2, 8),
			timerId: null
		}
	},
	computed: {
		// 利用缓存特性只初始化一次
		chartIns() {
			return this.$_echarts.init(document.getElementById(this.chartId))
		}
	},
	filters: {},
	watch: {
		option: {
			handler(newVal, oldVal) {
				// 重新加载引用
				this.renderChart()
			},
			deep: true
		},
		loading: {
			handler(newVal) {
				this.isShowLoading(newVal)
			}
			// immediate: true
		}
	},
	created() {
		// console.log('chartId:', this.chartId)
	},
	mounted() {
		this.init()
	},
	activated() {},
	updated() {},
	beforeDestroy() {
		this.handleRemoveResizeEvent()
	},
	methods: {
		// 判断 loading
		isShowLoading(status) {
			if (status) {
				this.chartIns.showLoading(this.loadingConfig)
			} else {
				this.chartIns.hideLoading()
			}
		},
		// 渲染 chart
		renderChart() {
			this.isShowLoading(this.loading)
			this.chartIns.clear()
			this.chartIns.setOption(this.option)
			this.chartIns.resize()

			// 派发图表点击事件
			this.chartIns.off('click')
			this.chartIns.on(
				'click',
				function(param) {
					this.$emit('on-click', param)
				}.bind(this)
			)
			// 派发画布点击事件
			// this.chartIns.getZr().off('click')
			this.chartIns.getZr().on(
				'click',
				function(param) {
					if (param.topTarget && param.topTarget.anid && param.topTarget.anid.indexOf('label') != -1) {
						const pointInPixel = [param.offsetX, param.offsetY]

						// 使用 convertFromPixel方法 转换像素坐标值到逻辑坐标系上的点。获取点击位置对应的x轴数据的索引         值，借助于索引值的获取到其它的信息
						let pointInGrid = this.chartIns.convertFromPixel({ seriesIndex: 0 }, pointInPixel)

						// x轴数据的索引值
						let xIndex = pointInGrid[0]

						// 获取当前点击位置要的数据
						let name = this.option.xAxis[0].data[xIndex] || ''

						this.$emit('on-canvas-click', param, name)
					}
				}.bind(this)
			)
			// 派发legend点击事件
			this.chartIns.off('legendselectchanged')
			this.chartIns.on(
				'legendselectchanged',
				function(param) {
					// console.log('派发legend点击事件', param)
					this.$emit('legend-click', param)
				}.bind(this)
			)
		},
		// 处理 resize 事件
		handleResizeChart() {
			clearTimeout(this.timerId)
			this.timerId = setTimeout(() => {
				this.chartIns.resize()
			}, 500)
		},
		// 绑定 resize 事件
		handleAddResizeEvent() {
			window.addEventListener('resize', this.handleResizeChart, false)
		},
		// 解绑 resize 事件
		handleRemoveResizeEvent() {
			window.removeEventListener('resize', this.handleResizeChart, false)
			this.timerId = null
		},
		// 初始化
		init() {
			this.renderChart()
			this.handleAddResizeEvent()
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
.chart {
	width: 100%;
	height: 100%;
}
</style>
