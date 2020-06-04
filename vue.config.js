/*!
 * 	开发
 * 		1.单独运行： npm run dev module1 或者 yarn dev module1
 * 		2.多个运行： npm run dev module1,module2 或者 yarn dev module1,module2
 * 		3.一组运行： npm run dev:groupName 或者 yarn dev:groupName
 * 		4.全部运行： 支持，但是v8内存爆炸放弃吧，多个和一组打包最多支持 9个项目 同时运行
 *
 *  打包
 *  	1.单独打包： npm run build module1 或者 yarn build module1
 *  	2.多个打包： npm run build module1,module2 或者 yarn build module1,module2
 *  	3.一组打包： npm run build:groupName 或者 yarn build:groupName
 *  	3.全部打包： npm run build:all 或者 yarn build:all (多线程效率至少提高 70% 包越多效率提升越大)
 *  	
 */
const path = require('path')

const resolve = dir => {
	return path.join(__dirname, dir)
}

let getPagesConfig = require('./pages.config.js')

let pages = {}

// 解析
if (!process.argv[4] && process.argv[2] == 'serve') return console.log('\x1b[91m','命令参数错误，请输入完整信息，多个模块名以","号隔开！ \n 开发阶段最多同时运行十个以下模块')
if (!process.argv[4] && process.argv[2] == 'build') return console.log('\x1b[91m','命令参数错误，请输入完整信息，多个模块名以","号隔开！ \n 打包所有项目请运行 npm run build:all or yarn build:all')

let projectArray = process.argv[4].split(',')
if (process.argv[2] == 'serve' && process.argv[4] && projectArray.length > 9) return console.log('\x1b[91m','由于内存限制，建议同时运行9个及以下模块！')
let singleCommand = projectArray[0]
let directory = getPagesConfig.init()

// 手动多线程构建全部模块，注意：vue会默认开启一个线程所以要从第二个开始打包
let spawn = require('child_process').spawn;
function threadBuild() {
	for (let i = 1; i < projectArray.length; i++) {
		let build = spawn('node', ['./node_modules/@vue/cli-service/bin/vue-cli-service.js','build', '--module', projectArray[i]]);

		build.stdout.on('data', function(data){
		    console.log('\x1b[92m', 'stdout: ' + data);
		});

		build.stderr.on('data', function(data){
		    console.log('\x1b[96m', 'stderr: ' + data);
		});

		build.on('close', function(code){
		    console.log('\x1b[97m', 'close: ' + code);
		});	
	}
}
if (process.argv[2] == 'build' && projectArray.length > 1) {
	threadBuild()
}
// console.log('process.argv', process.argv)
function getPagesByCmd() {
	Object.keys(directory).forEach(name => {
		projectArray.forEach(item => {
			if (name == item) {
				pages[item] = directory[item]
			}
		})
	})
}
// 注入
if (process.env.NODE_ENV == 'development' && process.env.npm_lifecycle_event == 'dev:groupName') {
	// 运行自定义组模块
	getPagesByCmd()
} else if (process.env.NODE_ENV == 'development') {
	// 非主题开发模式下自动注入5200框架
	pages['index'] = directory['index'];
	getPagesByCmd()
} else if (process.env.NODE_ENV == 'production') {
	Object.keys(directory).forEach(name => {
		projectArray.forEach((item, idx) => {
			// 每次线程确保匹配当前模块
			if (name == item && idx == 0) {
				pages[item] = directory[item]
			}
		})
	})
}

// 打包输出路径
let outputDir = ''
if (singleCommand == 'index') {
	outputDir = 'dist/vue-cli4-mpa-template/'
} else {
	outputDir = 'dist/vue-cli4-mpa-template/module/' + singleCommand
}


// --------------------------------------------------------------

/*let projectname = ''
process.argv[2] == 'serve' && (projectname = process.argv[4])
process.argv[2] == 'build' && (projectname = process.argv[3])
if (process.env.NODE_ENV == 'development' && projectname == 'all') {
	pages = getPagesConfig.init()
} else if (process.env.NODE_ENV == 'development') {
	pages['index'] = getPagesConfig.init()['index'];
	pages[projectname] = getPagesConfig.init()[projectname];
} else if (process.env.NODE_ENV == 'production') {
	pages[projectname] = getPagesConfig.init()[projectname]
}
let outputDir = ''
if (projectname == 'index') {
	outputDir = 'dist/vue-cli4-mpa-template/'
} else {
	outputDir = 'dist/vue-cli4-mpa-template/module/' + projectname
}*/

// --------------------------------------------------------------

// 加载静态路径基址
/*function getStaticBaseUrl() {
	let staticBaseUrl = ''
	if (process.env.NODE_ENV == 'development') {
		staticBaseUrl = '~@/assets/style/static-base-url.dev.config.styl'
	}
	if (process.env.NODE_ENV == 'production') {
		staticBaseUrl = '~@/assets/style/static-base-url.pro.config.styl'
	}
	return staticBaseUrl
}*/

module.exports = {
	// mpa
	pages,

	// 打包目录
	outputDir,

	// webpack压缩目录
	assetsDir: 'pack',

	// 静态资源引用路径
	publicPath: './',

	//默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。如果你无法使用 Vue CLI 生成的 index HTML，你可以通过将这个选项设为 false 来关闭文件名哈希。
	filenameHashing: true,

	// 开发服务配置
	devServer: {
		open: false, // 自动打开页面
		// host: 'localhost', // 主机名，也可以127.0.0.0 || 做真机测试时候 0.0.0.0
		port: 9880, // 端口号，默认8080
		https: false, // 协议
		hotOnly: false // 没啥效果，热模块，webpack已经做好了
		// 代理相关
		/*proxy: {
	    	'/api': 'http://localhost:3000'
	    }*/
	},

	// 打包时不生成.map文件
	productionSourceMap: false,

	// 如果你不需要使用eslint，把lintOnSave设为false即可
	lintOnSave: false,

	// 处理依赖包的兼容性
	transpileDependencies: ['webpack-dev-server/client', 'echarts', 'echarts/dist/echarts.min', 'debug'],

	// css相关
	css: {
		loaderOptions: {
			less: {
				javascriptEnabled: true
			},
			stylus: {
				// 导入全局 styl
				import: '~@/assets/style/global.styl'
			}
		},
		extract: false
	},

	// 可视化优化检查
	pluginOptions: {
		webpackBundleAnalyzer: {
			openAnalyzer: false,
			analyzerPort: 9881
		}
	},

	// 路径符
	chainWebpack: config => {
		config.resolve.alias
			.set('@', resolve('src'))
			.set('@@', resolve('public'))
			.set('@c', resolve('src/components'))
			.set('@v', resolve('src/views'))
			.set('@index', resolve('src/pages/index'))
			.set('@module1', resolve('src/pages/module1'))
			.set('@module2', resolve('src/pages/module2'))
	}

	// GZ压缩
	/*const CompressionPlugin = require('compression-webpack-plugin')
	configureWebpack: config => {
		if (process.env.NODE_ENV === 'production') {
			return {
				plugins: [
					new CompressionPlugin({
						filename: '[path].br[query]',
						algorithm: 'brotliCompress',
						test: /\.(js|css|html|svg)$/,
						compressionOptions: { level: 11 },
						threshold: 10240,
						minRatio: 0.8,
						deleteOriginalAssets: false,
					}),
				]
			}
		}
	}*/
}
