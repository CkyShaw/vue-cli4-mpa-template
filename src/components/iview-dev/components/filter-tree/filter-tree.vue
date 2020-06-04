<template>
	<div ref="filter-tree" class="filter-tree">
		<i-input
			ref="iview-input"
			v-bind="$attrs"
			v-on="$listeners"
			:search="search"
			@on-change="handleInput"
			@on-search="handleSearch"
		>
			<template v-for="sl in Object.keys(this.$slots)" :slot="sl">
				<slot :name="sl"></slot>
			</template>
		</i-input>
		<Tree v-if="treeReady" ref="iview-tree" v-bind="$attrs" v-on="$listeners" :data="filtrationResult"></Tree>
	</div>
</template>
<script>
import pinyin from 'pinyin2'
import { dataDeepCopy } from '../../utils/assist'
import { getDataType } from '../../utils/assist'
export default {
	name: 'filter-tree',
	components: {},
	props: {
		data: {
			type: Array,
			default() {
				return []
			}
		},
		search: {
			type: Boolean,
			default: false
		},
		selected: {
			type: Boolean,
			default: false
		},
		checked: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			stateTree: [],
			treeReady: true,
			targetValue: ''
		}
	},
	computed: {
		filtrationResult: function() {
			dataDeepCopy(this.stateTree, this.data, false)
			return this.setExpand(this.filterTreeNode(this.data, this.target), this.target)
		}
	},
	filters: {},
	watch: {
		data: {
			deep: true,
			handler(value, old) {
				JSON.stringify(value) == '[]' && (this.stateTree = [])
				JSON.stringify(value) == '{}' && (this.stateTree = {})
				getDataType(old) === 'Array' && old.length > 1 && (this.stateTree = [])
				this.convertToPinyin(value)
				dataDeepCopy(value, this.stateTree, false)
				this.treeReady = false
				this.$nextTick(() => {
					this.treeReady = true
				})
			}
		}
	},
	created() {
		this.convertToPinyin(this.data)
		dataDeepCopy(this.data, this.stateTree, false)
	},
	mounted() {},
	activated() {},
	updated() {},
	beforeDestroy() {},
	methods: {
		convertToPinyin(data) {
			data.forEach(
				(item => {
					const _pinyin = pinyin(item.title, {
						style: pinyin.STYLE_NORMAL //全拼风格
					})
					item.pinyin = _pinyin.join('').toLowerCase()
					item.py = _pinyin
						.map(item => {
							return item[0].substr(0, 1)
						})
						.join('')
						.toLowerCase()
					if (item.children instanceof Array && item.children.length > 0) {
						this.convertToPinyin(item.children)
					}
				}).bind(this)
			)
		},
		handleInput({ target }) {
			if (target.value == '') this.targetValue = target.value
			if (!this.search) this.targetValue = target.value
			this.$emit('on-change', target)
		},
		handleSearch(value) {
			if (this.search) this.targetValue = value
			this.$emit('on-search', value)
		},
		filterTreeNode(treeData, target) {
			let result = []
			if (!treeData) {
				return false
			}
			result = treeData.filter(item => {
				if (this.targetValue == '') {
					return true
				} else if (
					/^[\u4e00-\u9fa5]+$/gi.test(this.targetValue) &&
					item.title.includes(this.targetValue) &&
					this.targetValue != ''
				) {
					this.checked && (item.checked = true)
					this.selected && (item.selected = true)
					item.children = this.filterTreeNode(item.children, target)
					return true
				} else if (
					// item.pinyin.includes() 全拼搜索
					escape(this.targetValue).indexOf('%u') < 0 &&
					item.py.includes(this.targetValue.toLowerCase()) &&
					this.targetValue != ''
				) {
					this.checked && (item.checked = true)
					this.selected && (item.selected = true)
					item.children = this.filterTreeNode(item.children, target)
					return true
				} else if (item.children && item.children.length > 0) {
					item.children = this.filterTreeNode(item.children, target)
					return item.children.length > 0
				} else {
					return false
				}
			})
			return result
		},
		setExpand(node, target) {
			if (this.targetValue == '') {
				return node
			}
			let result = []
			result = node.filter(element => {
				element.expand = true
				if (element.children && element.children.length > 0) {
					element.children = this.setExpand(element.children, target)
					return element.children.length > 0
				}
				return true
			})
			return result
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
.filter-tree {

}
</style>
