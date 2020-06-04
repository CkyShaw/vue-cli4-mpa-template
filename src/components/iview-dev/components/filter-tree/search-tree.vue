<template>
	<div>
		<i-input
			v-if="slotReady"
			ref="input"
			:type="type"
			:placeholder="placeholder"
			:value="currentValue"
			:size="size"
			:maxlength="maxlength"
			:disabled="disabled"
			:icon="icon"
			:autosize="autosize"
			:rows="rows"
			:readonly="readonly"
			:number="number"
			:autofocus="autofocus"
			:spellcheck="spellcheck"
			:autocomplete="autocomplete"
			:clearable="clearable"
			:id="elementId"
			:wrap="wrap"
			:prefix="prefix"
			:suffix="suffix"
			:search="search"
			:enterButton="enterButton"
			@on-enter="handleEnter"
			@on-click="handleIconClick"
			@on-change="handleInput"
			@on-focus="handleFocus"
			@on-blur="handleBlur"
			@on-keyup="handleKeyup"
			@on-keydown="handleKeydown"
			@on-keypress="handleKeypress"
			@on-search="handleSearch"
		>
			<div slot="prepend" v-if="slots.prepend">
				<slot name="prepend"></slot>
			</div>
			<div slot="append" v-if="slots.append">
				<slot name="append"></slot>
			</div>
			<div slot="prefix" v-if="slots.prefix">
				<slot name="prefix"></slot>
			</div>
			<div slot="suffix" v-if="slots.suffix">
				<slot name="suffix"></slot>
			</div>
		</i-input>
		<Tree
			v-if="treeReady"
			ref="tree"
			:data="filtrationResult"
			:multiple="multiple"
			:show-checkbox="showCheckbox"
			:empty-text="emptyText"
			:load-data="loadData"
			:render="render"
			:children-key="childrenKey"
			:check-strictly="checkStrictly"
			@on-select-change="handleSelect"
			@on-check-change="handleCheck"
			@on-toggle-expand="handleToggleExpand"
		></Tree>
	</div>
</template>
<script>
import { oneOf } from '../../utils/assist'
import pinyin from 'pinyin2'

export default {
	name: 'SearchTree',
	components: {},
	props: {
		// Input
		type: {
			validator(value) {
				return oneOf(value, ['text', 'textarea', 'password', 'url', 'email', 'date'])
			},
			default: 'text'
		},
		value: {
			type: [String, Number],
			default: ''
		},
		size: {
			validator(value) {
				return oneOf(value, ['small', 'large', 'default'])
			},
			default() {
				return !this.$IVIEW || this.$IVIEW.size === '' ? 'default' : this.$IVIEW.size
			}
		},
		placeholder: {
			type: String,
			default: ''
		},
		maxlength: {
			type: Number
		},
		disabled: {
			type: Boolean,
			default: false
		},
		icon: String,
		autosize: {
			type: [Boolean, Object],
			default: false
		},
		rows: {
			type: Number,
			default: 2
		},
		readonly: {
			type: Boolean,
			default: false
		},
		number: {
			type: Boolean,
			default: false
		},
		autofocus: {
			type: Boolean,
			default: false
		},
		spellcheck: {
			type: Boolean,
			default: false
		},
		autocomplete: {
			validator(value) {
				return oneOf(value, ['on', 'off'])
			},
			default: 'off'
		},
		clearable: {
			type: Boolean,
			default: false
		},
		elementId: {
			type: String
		},
		wrap: {
			validator(value) {
				return oneOf(value, ['hard', 'soft'])
			},
			default: 'soft'
		},
		prefix: {
			type: String,
			default: ''
		},
		suffix: {
			type: String,
			default: ''
		},
		search: {
			type: Boolean,
			default: false
		},
		enterButton: {
			type: [Boolean, String],
			default: false
		},
		// Tree
		data: {
			type: Array,
			default() {
				return []
			}
		},
		multiple: {
			type: Boolean,
			default: false
		},
		showCheckbox: {
			type: Boolean,
			default: false
		},
		emptyText: {
			type: String
		},
		loadData: {
			type: Function
		},
		render: {
			type: Function
		},
		childrenKey: {
			type: String,
			default: 'children'
		},
		checkStrictly: {
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
			// Input
			currentValue: this.value,
			slots: {
				prepend: false,
				append: false,
				prefix: false,
				suffix: false
			},
			slotReady: true,
			// Tree
			stateTree: [],
			treeReady: true,
			targetValue: ''
		}
	},
	computed: {
		filtrationResult: function() {
			this.dataDeepCopy(this.stateTree, this.data, false)
			return this.setExpand(this.filterTreeNode(this.data, this.target), this.target)
		}
	},
	watch: {
		data: {
			deep: true,
			handler(value, old) {
				// value && (this.stateTree = value)
				JSON.stringify(value) == '[]' && (this.stateTree = [])
				JSON.stringify(value) == '{}' && (this.stateTree = {})
				this.getDataType(old) === 'Array' && old.length > 1 && (this.stateTree = [])
				this.convertToPinyin(value)
				this.dataDeepCopy(value, this.stateTree, false)
				this.treeReady = false
				this.$nextTick(() => {
					this.treeReady = true
				})
			}
		}
	},
	methods: {
		// Input
		isObjectValueEqual(a, b) {
			var aProps = Object.getOwnPropertyNames(a)
			var bProps = Object.getOwnPropertyNames(b)
			if (aProps.length != bProps.length) {
				return false
			}
			for (var i = 0; i < aProps.length; i++) {
				var propName = aProps[i]
				if (a[propName] !== b[propName]) {
					return false
				}
			}
			return true
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
					// item.pinyin.includes(this.targetValue.toLowerCase()) 全拼搜索
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
		},
		handleInput({ target }) {
			this.targetValue = target.value
			/* this.dataDeepCopy(this.data, this.stateTree, false)
			this.stateTree = this.setExpand(this.filterTreeNode(this.stateTree, target), target) */
			this.$emit('on-change', target)
		},
		handleEnter(event) {
			this.$emit('on-enter', event)
		},
		handleIconClick(event) {
			this.$emit('on-click', event)
		},
		handleFocus(event) {
			this.$emit('on-focus', event)
		},
		handleBlur(event) {
			this.$emit('on-blur', event)
		},
		handleKeyup(event) {
			this.$emit('on-keyup', event)
		},
		handleKeydown(event) {
			this.$emit('on-keydown', event)
		},
		handleKeypress(event) {
			this.$emit('on-keypress', event)
		},
		handleSearch(value) {
			this.$emit('on-search', value)
		},
		// Tree
		handleSelect(treeNode) {
			this.$emit('on-select-change', treeNode)
		},
		handleCheck(treeNode) {
			this.$emit('on-check-change', treeNode)
		},
		handleToggleExpand(treeNode) {
			this.$emit('on-toggle-expand', treeNode)
		},
		convertToPinyin(data) {
			data.forEach(item => {
				const _pinyin = pinyin(item.title, {
					style: pinyin.STYLE_NORMAL // 全拼风格
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
			})
		}
	},
	created() {
		this.convertToPinyin(this.data)
		this.dataDeepCopy(this.data, this.stateTree, false)
		for (let attr in this.slots) {
			this.slots[attr] = this.$slots[attr] !== undefined
		}
	},
	beforeUpdate() {
		let beforeSlots = {}
		let afterSlots = {}
		this.dataDeepCopy(this.slots, beforeSlots, false)
		for (let attr in this.slots) {
			this.slots[attr] = this.$slots[attr] !== undefined
		}
		this.dataDeepCopy(this.slots, afterSlots, false)
		if (!this.isObjectValueEqual(beforeSlots, afterSlots)) {
			this.slotReady = false
			this.$nextTick(() => {
				this.slotReady = true
			})
		}
		// && this.$forceUpdate()
	}
}
</script>
