// 判断参数是否是其中之一
export function oneOf(value, validList) {
	for (let i = 0; i < validList.length; i++) {
		if (value === validList[i]) {
			return true
		}
	}
	return false
}

// 获取数据类型
export function getDataType(data) {
	return Object.prototype.toString.call(data).match(/^\[object\s(.*)\]$/)[1]
}

function dataDeepCopy(current, target, filter) {
	for (let key in current) {
		if (filter && target[key]) {
			continue
		}
		if (getDataType(current[key]) === 'Array') {
			target[key] = []
			dataDeepCopy(current[key], target[key], filter)
		} else if (getDataType(current[key]) === 'Object') {
			target[key] = {}
			dataDeepCopy(current[key], target[key], filter)
		} else {
			target[key] = current[key]
		}
	}
}

export { dataDeepCopy }

/*function dataDeepCopy(current, target, filter) {
	for (let key in current) {
		if (filter && target[key]) {
			continue
		}
		if (current[key] instanceof Function) {
			target[key] = current[key]
			continue
		}
		if (current[key] instanceof Array) {
			target[key] = []
			dataDeepCopy(current[key], target[key], filter)
		} else if (current[key] instanceof Object) {
			target[key] = {}
			dataDeepCopy(current[key], target[key], filter)
		} else {
			target[key] = current[key]
		}
	}
}*/

function typeOf(obj) {
	const toString = Object.prototype.toString
	const map = {
		'[object Boolean]': 'boolean',
		'[object Number]': 'number',
		'[object String]': 'string',
		'[object Function]': 'function',
		'[object Array]': 'array',
		'[object Date]': 'date',
		'[object RegExp]': 'regExp',
		'[object Undefined]': 'undefined',
		'[object Null]': 'null',
		'[object Object]': 'object'
	}
	return map[toString.call(obj)]
}

// deepCopy
function deepCopy(data) {
	const t = typeOf(data)
	let o

	if (t === 'array') {
		o = []
	} else if (t === 'object') {
		o = {}
	} else {
		return data
	}

	if (t === 'array') {
		for (let i = 0; i < data.length; i++) {
			o.push(deepCopy(data[i]))
		}
	} else if (t === 'object') {
		for (let i in data) {
			o[i] = deepCopy(data[i])
		}
	}
	return o
}

export { deepCopy }

// Find components upward
function findComponentUpward(context, componentName, componentNames) {
	if (typeof componentName === 'string') {
		componentNames = [componentName]
	} else {
		componentNames = componentName
	}

	let parent = context.$parent
	let name = parent.$options.name
	while (parent && (!name || componentNames.indexOf(name) < 0)) {
		parent = parent.$parent
		if (parent) name = parent.$options.name
	}
	return parent
}
export { findComponentUpward }

// Find component downward
export function findComponentDownward(context, componentName) {
	const childrens = context.$children
	let children = null

	if (childrens.length) {
		for (const child of childrens) {
			const name = child.$options.name
			if (name === componentName) {
				children = child
				break
			} else {
				children = findComponentDownward(child, componentName)
				if (children) break
			}
		}
	}
	return children
}

// Find components downward
export function findComponentsDownward(context, componentName) {
	return context.$children.reduce((components, child) => {
		if (child.$options.name === componentName) components.push(child)
		const foundChilds = findComponentsDownward(child, componentName)
		return components.concat(foundChilds)
	}, [])
}

// Find components upward
export function findComponentsUpward(context, componentName) {
	let parents = []
	const parent = context.$parent
	if (parent) {
		if (parent.$options.name === componentName) parents.push(parent)
		return parents.concat(findComponentsUpward(parent, componentName))
	} else {
		return []
	}
}

// Find brothers components
export function findBrothersComponents(context, componentName, exceptMe = true) {
	let res = context.$parent.$children.filter(item => {
		return item.$options.name === componentName
	})
	let index = res.findIndex(item => item._uid === context._uid)
	if (exceptMe) res.splice(index, 1)
	return res
}
