/* !
 * 辅助函数
 */

// 管道
export function pipeline(...fns) {
	return function (x) {
		return fns.reduce((arg, fn) => {
			return fn(arg)
		}, x)
	}
}

// Find components upward 通过组件名称从目标源向父链查找单个组件
export function findComponentUpward(context, componentName, componentNames) {
	let _componentNames

	if (typeof componentName === 'string') {
		_componentNames = [componentName]
	} else {
		_componentNames = componentName
	}

	let parent = context.$parent
	let name = parent.$options.name
	while (parent && (!name || _componentNames.indexOf(name) < 0)) {
		parent = parent.$parent
		if (parent) name = parent.$options.name
	}
	return parent
}

// Find component downward 通过组件名称从目标源向子链查找单个组件
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

// Find components downward 通过组件名称从目标源向子链查找多个组件
export function findComponentsDownward(context, componentName) {
	return context.$children.reduce((components, child) => {
		if (child.$options.name === componentName) components.push(child)
		const foundChilds = findComponentsDownward(child, componentName)
		return components.concat(foundChilds)
	}, [])
}

// Find components upward 通过组件名称从目标源向父链查找单个组件
export function findComponentsUpward(context, componentName) {
	let parents = []
	const parent = context.$parent
	if (parent) {
		if (parent.$options.name === componentName) parents.push(parent)
		return parents.concat(findComponentsUpward(parent, componentName))
	}
	return []
}

// Find brothers components 通过组件名称找到目标源的兄弟组件，默认包含自身
export function findBrothersComponents(context, componentName, exceptMe = true) {
	let res = context.$parent.$children.filter(item => {
		return item.$options.name === componentName
	})
	let index = res.findIndex(item => item._uid === context._uid)
	if (exceptMe) res.splice(index, 1)
	return res
}
