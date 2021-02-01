/*!
 * 清理打包后的重复资源
 */

const path = require('path')

const resolve = dir => {
	return path.join(__dirname, dir)
}

const { name, version } = require('../package.json')
const { error } = require('@vue/cli-shared-utils')
const rimraf = require('rimraf')

const base = `../dist/${name}_${version}/`

// 1. 删除模块内的静态数据
const modulesData = 'module/{module1,module2}/assets/data'

const result = base + modulesData
rimraf(resolve(result), function (err) {
	if (err) error(err)
})
