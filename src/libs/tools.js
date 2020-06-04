/*!
 * 工具函数
 */
import Vue from 'vue'
import { isString, isObject } from './types'

export const forEach = (arr, fn) => {
	if (!arr.length || !fn) {
		return
	}
	let i = -1

	let len = arr.length

	while (++i < len) {
		let item = arr[i]

		fn(item, i, arr)
	}
}

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的交集, 两个数组的元素为数值或字符串
 */
export const getIntersection = (arr1, arr2) => {
	let len = Math.min(arr1.length, arr2.length)

	let i = -1

	let res = []

	while (++i < len) {
		const item = arr2[i]

		if (arr1.indexOf(item) > -1) {
			res.push(item)
		}
	}
	return res
}

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的并集, 两个数组的元素为数值或字符串
 */
export const getUnion = (arr1, arr2) => {
	return Array.from(new Set([...arr1, ...arr2]))
}

/**
 * @param {Array} target 目标数组
 * @param {Array} arr 需要查询的数组
 * @description 判断要查询的数组是否至少有一个元素包含在目标数组中
 */
export const hasOneOf = (targetarr, arr) => {
	return targetarr.some(_ => arr.indexOf(_) > -1)
}

/**
 * @param {String|Number} value 要验证的字符串或数值
 * @param {*} validList 用来验证的列表
 */
export function oneOf(value, validList) {
	for (let i = 0; i < validList.length; i++) {
		if (value === validList[i]) {
			return true
		}
	}
	return false
}

/**
 * @param {Number} timeStamp 判断时间戳格式是否是毫秒
 * @returns {Boolean}
 */
const isMillisecond = timeStamp => {
	const timeStr = String(timeStamp)

	return timeStr.length > 10
}

/**
 * @param {Number} timeStamp 传入的时间戳
 * @param {Number} currentTime 当前时间时间戳
 * @returns {Boolean} 传入的时间戳是否早于当前时间戳
 */
const isEarly = (timeStamp, currentTime) => {
	return timeStamp < currentTime
}

/**
 * @param {Number} num 数值
 * @returns {String} 处理后的字符串
 * @description 如果传入的数值小于10，即位数只有1位，则在前面补充0
 */
const getHandledValue = num => {
	return num < 10 ? '0' + num : num
}

/**
 * @param {Number} timeStamp 传入的时间戳
 * @param {Number} startType 要返回的时间字符串的格式类型，传入'year'则返回年开头的完整时间
 */
const getDate = (timeStamp, startType) => {
	const d = new Date(timeStamp * 1000)
	const year = d.getFullYear()
	const month = getHandledValue(d.getMonth() + 1)
	const date = getHandledValue(d.getDate())
	const hours = getHandledValue(d.getHours())
	const minutes = getHandledValue(d.getMinutes())
	const second = getHandledValue(d.getSeconds())

	let resStr = ''

	if (startType === 'year') {
		resStr = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + second
	} else {
		resStr = month + '-' + date + ' ' + hours + ':' + minutes
	}
	return resStr
}

/**
 * @param {String|Number} timeStamp 时间戳
 * @returns {String} 相对时间字符串
 */
export const getRelativeTime = timeStamp => {
	// 判断当前传入的时间戳是秒格式还是毫秒
	const IS_MILLISECOND = isMillisecond(timeStamp)
	// 如果是毫秒格式则转为秒格式

	if (IS_MILLISECOND) {
		Math.floor((timeStamp /= 1000))
	}
	// 传入的时间戳可以是数值或字符串类型，这里统一转为数值类型
	timeStamp = Number(timeStamp)
	// 获取当前时间时间戳
	const currentTime = Math.floor(Date.parse(new Date()) / 1000)
	// 判断传入时间戳是否早于当前时间戳
	const IS_EARLY = isEarly(timeStamp, currentTime)
	// 获取两个时间戳差值

	let diff = currentTime - timeStamp
	// 如果IS_EARLY为false则差值取反

	if (!IS_EARLY) {
		diff = -diff
	}
	let resStr = ''
	const dirStr = IS_EARLY ? '前' : '后'
	// 少于等于59秒

	if (diff <= 59) {
		resStr = diff + '秒' + dirStr
	}
	// 多于59秒，少于等于59分钟59秒
	else if (diff > 59 && diff <= 3599) {
		resStr = Math.floor(diff / 60) + '分钟' + dirStr
	}
	// 多于59分钟59秒，少于等于23小时59分钟59秒
	else if (diff > 3599 && diff <= 86399) {
		resStr = Math.floor(diff / 3600) + '小时' + dirStr
	}
	// 多于23小时59分钟59秒，少于等于29天59分钟59秒
	else if (diff > 86399 && diff <= 2623859) {
		resStr = Math.floor(diff / 86400) + '天' + dirStr
	}
	// 多于29天59分钟59秒，少于364天23小时59分钟59秒，且传入的时间戳早于当前
	else if (diff > 2623859 && diff <= 31567859 && IS_EARLY) {
		resStr = getDate(timeStamp)
	} else {
		resStr = getDate(timeStamp, 'year')
	}
	return resStr
}

/**
 * @returns {String} 当前浏览器名称
 */
export const getExplorer = () => {
	const ua = window.navigator.userAgent
	const isExplorer = exp => {
		return ua.indexOf(exp) > -1
	}

	if (isExplorer('MSIE')) {
		return 'IE'
	} else if (isExplorer('Firefox')) {
		return 'Firefox'
	} else if (isExplorer('Chrome')) {
		return 'Chrome'
	} else if (isExplorer('Opera')) {
		return 'Opera'
	} else if (isExplorer('Safari')) {
		return 'Safari'
	}
}

/**
 * @description 绑定事件 on(element, event, handler)
 */
export const on = (function() {
	if (document.addEventListener) {
		return function(element, event, handler) {
			if (element && event && handler) {
				element.addEventListener(event, handler, false)
			}
		}
	}
	return function(element, event, handler) {
		if (element && event && handler) {
			element.attachEvent('on' + event, handler)
		}
	}
})()

/**
 * @description 解绑事件 off(element, event, handler)
 */
export const off = (function() {
	if (document.removeEventListener) {
		return function(element, event, handler) {
			if (element && event) {
				element.removeEventListener(event, handler, false)
			}
		}
	}
	return function(element, event, handler) {
		if (element && event) {
			element.detachEvent('on' + event, handler)
		}
	}
})()

/**
 * 判断一个对象是否存在key，如果传入第二个参数key，则是判断这个obj对象是否存在key这个属性
 * 如果没有传入key这个参数，则判断obj对象是否有键值对
 */
export const hasKey = (obj, key) => {
	if (key) {
		return key in obj
	}

	let keysArr = Object.keys(obj)

	return keysArr.length
}

/**
 * @param {*} obj1 对象
 * @param {*} obj2 对象
 * @description 判断两个对象是否相等，这两个对象的值只能是数字或字符串
 */
export const objEqual = (obj1, obj2) => {
	const keysArr1 = Object.keys(obj1)
	const keysArr2 = Object.keys(obj2)

	if (keysArr1.length !== keysArr2.length) {
		return false
	} else if (keysArr1.length === 0 && keysArr2.length === 0) {
		return true
	}
	/* eslint-disable-next-line */ return !keysArr1.some(key => obj1[key] != obj2[key])
}

/**
 * @description 返回转换首字母大写后的字符串
 */
export function upperStringFirst(str) {
	return str.substring(0, 1).toUpperCase() + str.substring(1)
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
	if (arguments.length === 0) {
		return null
	}
	const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
			time = parseInt(time)
		}
		if (typeof time === 'number' && time.toString().length === 10) {
			time = time * 1000
		}
		date = new Date(time)
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}
	const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
		let value = formatObj[key]
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') {
			return ['日', '一', '二', '三', '四', '五', '六'][value]
		}
		if (result.length > 0 && value < 10) {
			value = '0' + value
		}
		return value || 0
	})
	return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
	if (('' + time).length === 10) {
		time = parseInt(time) * 1000
	} else {
		time = +time
	}
	const d = new Date(time)
	const now = Date.now()

	const diff = (now - d) / 1000

	if (diff < 30) {
		return '刚刚'
	} else if (diff < 3600) {
		// less 1 hour
		return Math.ceil(diff / 60) + '分钟前'
	} else if (diff < 3600 * 24) {
		return Math.ceil(diff / 3600) + '小时前'
	} else if (diff < 3600 * 24 * 2) {
		return '1天前'
	}
	if (option) {
		return parseTime(time, option)
	} else {
		return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
	}
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
	url = url == null ? window.location.href : url
	const search = url.substring(url.lastIndexOf('?') + 1)
	const obj = {}
	const reg = /([^?&=]+)=([^?&=]*)/g
	search.replace(reg, (rs, $1, $2) => {
		const name = decodeURIComponent($1)
		let val = decodeURIComponent($2)
		val = String(val)
		obj[name] = val
		return rs
	})
	return obj
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
	// returns the byte length of an utf8 string
	let s = str.length
	for (var i = str.length - 1; i >= 0; i--) {
		const code = str.charCodeAt(i)
		if (code > 0x7f && code <= 0x7ff) s++
		else if (code > 0x7ff && code <= 0xffff) s += 2
		if (code >= 0xdc00 && code <= 0xdfff) i--
	}
	return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
	const newArray = []
	for (let i = 0; i < actual.length; i++) {
		if (actual[i]) {
			newArray.push(actual[i])
		}
	}
	return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
	if (!json) return ''
	return cleanArray(
		Object.keys(json).map(key => {
			if (json[key] === undefined) return ''
			return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
		})
	).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
	const search = url.split('?')[1]
	if (!search) {
		return {}
	}
	return JSON.parse(
		'{"' +
			decodeURIComponent(search)
				.replace(/"/g, '\\"')
				.replace(/&/g, '","')
				.replace(/=/g, '":"')
				.replace(/\+/g, ' ') +
			'"}'
	)
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
	const div = document.createElement('div')
	div.innerHTML = val
	return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
	if (typeof target !== 'object') {
		target = {}
	}
	if (Array.isArray(source)) {
		return source.slice()
	}
	Object.keys(source).forEach(property => {
		const sourceProperty = source[property]
		if (typeof sourceProperty === 'object') {
			target[property] = objectMerge(target[property], sourceProperty)
		} else {
			target[property] = sourceProperty
		}
	})
	return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
	if (!element || !className) {
		return
	}
	let classString = element.className
	const nameIndex = classString.indexOf(className)
	if (nameIndex === -1) {
		classString += '' + className
	} else {
		classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length)
	}
	element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
	if (type === 'start') {
		return new Date().getTime() - 3600 * 1000 * 24 * 90
	} else {
		return new Date(new Date().toDateString())
	}
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
	let timeout, args, context, timestamp, result

	const later = function() {
		// 据上一次触发时间间隔
		const last = +new Date() - timestamp

		// 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
		if (last < wait && last > 0) {
			timeout = setTimeout(later, wait - last)
		} else {
			timeout = null
			// 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
			if (!immediate) {
				result = func.apply(context, args)
				if (!timeout) context = args = null
			}
		}
	}

	return function(...args) {
		context = this
		timestamp = +new Date()
		const callNow = immediate && !timeout
		// 如果延时不存在，重新设定延时
		if (!timeout) timeout = setTimeout(later, wait)
		if (callNow) {
			result = func.apply(context, args)
			context = args = null
		}

		return result
	}
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
	if (!source && typeof source !== 'object') {
		throw new Error('error arguments', 'deepClone')
	}
	const targetObj = source.constructor === Array ? [] : {}
	Object.keys(source).forEach(keys => {
		if (source[keys] && typeof source[keys] === 'object') {
			targetObj[keys] = deepClone(source[keys])
		} else {
			targetObj[keys] = source[keys]
		}
	})
	return targetObj
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
	return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString() {
	const timestamp = +new Date() + ''
	const randomNum = parseInt((1 + Math.random()) * 65536) + ''
	return (+(randomNum + timestamp)).toString(32)
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
	return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
	if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
	if (hasClass(ele, cls)) {
		const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
		ele.className = ele.className.replace(reg, ' ')
	}
}

const hasOwnProperty = Object.prototype.hasOwnProperty

export function noop() {}

export function hasOwn(obj, key) {
	return hasOwnProperty.call(obj, key)
}

function extend(to, _from) {
	for (let key in _from) {
		to[key] = _from[key]
	}
	return to
}

export function toObject(arr) {
	var res = {}
	for (let i = 0; i < arr.length; i++) {
		if (arr[i]) {
			extend(res, arr[i])
		}
	}
	return res
}

export const getValueByPath = function(object, prop) {
	prop = prop || ''
	const paths = prop.split('.')
	let current = object
	let result = null
	for (let i = 0, j = paths.length; i < j; i++) {
		const path = paths[i]
		if (!current) break

		if (i === j - 1) {
			result = current[path]
			break
		}
		current = current[path]
	}
	return result
}

export function getPropByPath(obj, path, strict) {
	let tempObj = obj
	path = path.replace(/\[(\w+)\]/g, '.$1')
	path = path.replace(/^\./, '')

	let keyArr = path.split('.')
	let i = 0
	for (let len = keyArr.length; i < len - 1; ++i) {
		if (!tempObj && !strict) break
		let key = keyArr[i]
		if (key in tempObj) {
			tempObj = tempObj[key]
		} else {
			if (strict) {
				throw new Error('please transfer a valid prop path to form item!')
			}
			break
		}
	}
	return {
		o: tempObj,
		k: keyArr[i],
		v: tempObj ? tempObj[keyArr[i]] : null
	}
}

export const generateId = function() {
	return Math.floor(Math.random() * 10000)
}

export const valueEquals = (a, b) => {
	// see: https://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
	if (a === b) return true
	if (!(a instanceof Array)) return false
	if (!(b instanceof Array)) return false
	if (a.length !== b.length) return false
	for (let i = 0; i !== a.length; ++i) {
		if (a[i] !== b[i]) return false
	}
	return true
}

export const escapeRegexpString = (value = '') => String(value).replace(/[|\\{}()[\]^$+*?.]/g, '\\$&')

// TODO: use native Array.find, Array.findIndex when IE support is dropped
export const arrayFindIndex = function(arr, pred) {
	for (let i = 0; i !== arr.length; ++i) {
		if (pred(arr[i])) {
			return i
		}
	}
	return -1
}

export const arrayFind = function(arr, pred) {
	const idx = arrayFindIndex(arr, pred)
	return idx !== -1 ? arr[idx] : undefined
}

// coerce truthy value to array
export const coerceTruthyValueToArray = function(val) {
	if (Array.isArray(val)) {
		return val
	} else if (val) {
		return [val]
	} else {
		return []
	}
}

export const isIE = function() {
	return !Vue.prototype.$isServer && !isNaN(Number(document.documentMode))
}

export const isEdge = function() {
	return !Vue.prototype.$isServer && navigator.userAgent.indexOf('Edge') > -1
}

export const autoprefixer = function(style) {
	if (typeof style !== 'object') return style
	const rules = ['transform', 'transition', 'animation']
	const prefixes = ['ms-', 'webkit-']
	rules.forEach(rule => {
		const value = style[rule]
		if (rule && value) {
			prefixes.forEach(prefix => {
				style[prefix + rule] = value
			})
		}
	})
	return style
}

export const kebabCase = function(str) {
	const hyphenateRE = /([^-])([A-Z])/g
	return str
		.replace(hyphenateRE, '$1-$2')
		.replace(hyphenateRE, '$1-$2')
		.toLowerCase()
}

export const capitalize = function(str) {
	if (!isString(str)) return str
	return str.charAt(0).toUpperCase() + str.slice(1)
}

export const looseEqual = function(a, b) {
	const isObjectA = isObject(a)
	const isObjectB = isObject(b)
	if (isObjectA && isObjectB) {
		return JSON.stringify(a) === JSON.stringify(b)
	} else if (!isObjectA && !isObjectB) {
		return String(a) === String(b)
	} else {
		return false
	}
}

export const arrayEquals = function(arrayA, arrayB) {
	arrayA = arrayA || []
	arrayB = arrayB || []

	if (arrayA.length !== arrayB.length) {
		return false
	}

	for (let i = 0; i < arrayA.length; i++) {
		if (!looseEqual(arrayA[i], arrayB[i])) {
			return false
		}
	}

	return true
}

export const isEqual = function(value1, value2) {
	if (Array.isArray(value1) && Array.isArray(value2)) {
		return arrayEquals(value1, value2)
	}
	return looseEqual(value1, value2)
}

export const isEmpty = function(val) {
	// null or undefined
	if (val == null) return true

	if (typeof val === 'boolean') return false

	if (typeof val === 'number') return !val

	if (val instanceof Error) return val.message === ''

	switch (Object.prototype.toString.call(val)) {
		// String or Array
		case '[object String]':
		case '[object Array]':
			return !val.length

		// Map or Set or File
		case '[object File]':
		case '[object Map]':
		case '[object Set]': {
			return !val.size
		}
		// Plain Object
		case '[object Object]': {
			return !Object.keys(val).length
		}
	}

	return false
}

export default function contains(root, n) {
	var node = n
	while (node) {
		if (node === root) {
			return true
		}
		node = node.parentNode
	}

	return false
}

/**
 * @param {Number} times 回调函数需要执行的次数
 * @param {Function} callback 回调函数
 */
export const doCustomTimes = (times, callback) => {
	let i = -1

	while (++i < times) {
		callback(i)
	}
}

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = url => {
	const keyValueArr = url.split('?')[1].split('&')

	let paramObj = {}

	keyValueArr.forEach(item => {
		const keyValue = item.split('=')

		paramObj[keyValue[0]] = keyValue[1]
	})
	return paramObj
}
