/*!
 * 工具函数
 */

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

export const isUndefined = val => {
	return val === void 0
}

export const isDefined = val => {
	return val !== undefined && val !== null
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
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
	let timeout, args, context, timestamp, result

	const later = function () {
		// 据上一次触发时间间隔
		const last = Number(new Date()) - timestamp

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

	return function (...args) {
		context = this
		timestamp = Number(new Date())
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
export const arrayFindIndex = function (arr, pred) {
	for (let i = 0; i !== arr.length; ++i) {
		if (pred(arr[i])) {
			return i
		}
	}
	return -1
}

export const arrayFind = function (arr, pred) {
	const idx = arrayFindIndex(arr, pred)
	return idx !== -1 ? arr[idx] : undefined
}

// coerce truthy value to array
export const coerceTruthyValueToArray = function (val) {
	if (Array.isArray(val)) {
		return val
	} else if (val) {
		return [val]
	}
	return []
}

export const looseEqual = function (a, b) {
	const isObjectA = isObject(a)
	const isObjectB = isObject(b)
	if (isObjectA && isObjectB) {
		return JSON.stringify(a) === JSON.stringify(b)
	} else if (!isObjectA && !isObjectB) {
		return String(a) === String(b)
	}
	return false
}

export const arrayEquals = function (arrayA, arrayB) {
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

export const isEqual = function (value1, value2) {
	if (Array.isArray(value1) && Array.isArray(value2)) {
		return arrayEquals(value1, value2)
	}
	return looseEqual(value1, value2)
}

export const isEmpty = function (val) {
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

export function contains(root, n) {
	var node = n
	while (node) {
		if (node === root) {
			return true
		}
		node = node.parentNode
	}

	return false
}
