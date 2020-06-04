const glob = require('glob')
// 多页面文件夹
const PAGES_PATH = './src/pages'

module.exports.init = function() {
	//  首先得到包含pages文件夹里面符合条件的路径数组
	let filePathList = glob.sync(PAGES_PATH + '/*/*.html')

	// 准备选项值
	let pages = {}

	filePathList.forEach(filePath => {
		let fileName = filePath.substring(filePath.indexOf('pages') + 6, filePath.lastIndexOf('/'))

		// 开发模式必须区分html模板名称
		let htmlName = ''
		if (process.env.NODE_ENV == 'development') {
			htmlName = fileName
		} else {
			htmlName = 'index'
		}

		// 动态组织
		pages[fileName] = {
			// 入口文件
			entry: `src/pages/${fileName}/main.js`,
			// 模板来源
			template: `src/pages/${fileName}/index.html`,
			// 在 dist/index.html 的输出
			filename: `${htmlName}.html`,
			// 提取出来的通用 chunk 和 vendor chunk。
			chunks: ['chunk-vendors', 'chunk-common', fileName]
		}
	})

	return pages
}
