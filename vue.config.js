/*!
 * 	开发
 * 		1.单独运行： npm run dev module1 或者 yarn dev module1
 * 		2.多个运行： npm run dev module1,module2 或者 yarn dev module1,module2
 * 		3.一组运行： npm run dev:group 或者 yarn dev:group
 * 		4.全部运行： 最多支持 9个项目 同时运行
 *
 *  打包
 *  	1.单独打包： npm run build module1 或者 yarn build module1
 *  	2.多个打包： npm run build module1,module2 或者 yarn build module1,module2
 *  	3.一组打包： npm run build:group 或者 yarn build:group
 *  	3.全部打包： npm run build:all 或者 yarn build:all (多线程打包效率至少提高 70%)
 *
 */
const path = require('path')

const resolve = dir => {
	return path.join(__dirname, dir)
}

const CompressionPlugin = require('compression-webpack-plugin')

const ESLintPlugin = require('eslint-webpack-plugin')

const StylelintPlugin = require('stylelint-webpack-plugin')

const { name, version } = require('./package.json')
const { program } = require('commander')
const { chalk, execa, error, exit } = require('@vue/cli-shared-utils')

const directory = require('./build/get-directory')()
const filterPages = require('./build/filter-pages')

let pages = {}
let outputDir = 'dist/empty/'

program
	.command('serve [module]')
	.description('startup project')
	.option('-m, --module', '指定运行模块')
	.action(modules => {
		let _modules = []

		if (process.env.npm_lifecycle_event.includes(':all')) {
			_modules = Object.keys(directory)

			if (_modules.length > 9) {
				error('当前运行所有模块，内存占用过多，请手动或分组运行')
				exit(1)
			}

			pages = filterPages(directory, _modules)
		} else {
			if (!modules) {
				error(
					`模块获取失败, 格式: ${chalk.yellow('npm run dev module1,module2')} or ${chalk.yellow(
						'yarn dev module1,module2'
					)}`
				)
				exit(1)
			}

			_modules = modules.split(',')

			if (_modules.length > 9) {
				error('由于内存限制，限制同时运行9个及以下模块！')
				exit(1)
			}

			pages = filterPages(directory, _modules)

			// 组标识
			if (!process.env.npm_lifecycle_event.includes(':') && !pages.index) {
				// 非组开发模式下自动注入容器框架
				pages.index = directory.index
			}
		}
	})

program
	// 每运行一个 build 服务会运行一次
	.command('build [module]')
	.description('build project')
	.option('-m, --module', '指定打包模块')
	.action(modules => {
		let _modules = []

		if (process.env.npm_lifecycle_event.includes(':all') && modules == undefined) {
			// 只拾取一次目录
			_modules = Object.keys(directory)
		} else {
			if (!modules) {
				error(
					`模块获取失败, 格式: ${chalk.yellow('npm run build module1,module2')} or ${chalk.yellow(
						'yarn build module1,module2'
					)}`
				)
				exit(1)
			}

			_modules = modules.split(',')
		}

		// 两个及以上 手动调用打包，注意从第二个开始
		if (_modules.length > 1) {
			for (let i = 1; i < _modules.length; i++) {
				execa('vue-cli-service', ['build', '--module', _modules[i]])
			}
		}

		let currentModule = _modules[0]

		pages[currentModule] = directory[currentModule]

		// 打包输出路径
		if (currentModule == 'index') {
			outputDir = `dist/${name}_${version}/`
		} else {
			outputDir = `dist/${name}_${version}/module/${currentModule}`
		}
	})

// 放行
program.command('lint').option('--cache', 'ESLint缓存').option('--fix', '自动修复')

program.parse(process.argv)

module.exports = {
	// 静态资源引用路径
	publicPath: './',

	// mpa
	pages,

	// 打包目录
	outputDir,

	// webpack资源目录
	assetsDir: 'pack',

	/**
	 * 因为启用了 eslint-webpack-plugin 不必开启此项
	 */
	lintOnSave: false,

	// 开发服务配置
	devServer: {
		open: false, // 自动打开页面
		// host: 'localhost', // 主机名，也可以127.0.0.0 || 做真机测试时候 0.0.0.0
		port: 9800, // 端口号，默认8080
		https: false, // 协议
		hotOnly: false, // 没啥效果，热模块，webpack已经做好了
		overlay: {
			warnings: true,
			errors: true
		}
		// 代理相关
		/*proxy: {
	        '/': {
	            target: 'https://58.144.147.140:443',
	            ws: true,
	            changOrigin: true,
	            secure: false,
	        }
	    }*/
	},

	// 打包时不生成.map文件
	productionSourceMap: false,

	// 处理依赖包的兼容性
	transpileDependencies: ['echarts', 'debug'],

	// css相关
	css: {
		loaderOptions: {
			stylus: {
				use: [require('nib')(), require('stylus-bem-mixins')()],
				// 导入全局 styl
				import: ['~@/assets/style/global.styl', '~nib/index.styl', 'stylus-bem-mixins']
			}
		},
		extract: false
	},

	// 可视化优化检查
	pluginOptions: {
		webpackBundleAnalyzer: {
			openAnalyzer: false,
			analyzerHost: '0.0.0.0',
			analyzerPort: 9801
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

		// 已弃用 转移至 eslint-webpack-plugin
		/*config.module.rule('eslint').use('eslint-loader').options({
			fix: true
		})*/
	},

	configureWebpack: config => {
		// fixOnSave
		if (process.env.NODE_ENV !== 'production') {
			return {
				plugins: [
					new ESLintPlugin({
						extensions: ['js', 'jsx', 'ts', 'vue'],
						cache: true,
						fix: true
					}),
					new StylelintPlugin({
						configFile: './stylelint.config.js',
						customSyntax: 'stylelint-plugin-stylus/custom-syntax',
						extensions: ['css', 'styl', 'vue'],
						files: ['**/*.css', '**/*.styl', '**/*.vue'],
						cache: true,
						fix: true
					})
				]
			}
		}
		// GZ压缩 nginx配置参考 https://blog.csdn.net/nidynie/article/details/86693780
		if (process.env.NODE_ENV === 'production') {
			return {
				plugins: [
					new CompressionPlugin({
						exclude: /\/iconfont/,
						test: /\.(js|css|json|txt|html|ico|svg|png|jpg|ttf|woff|woff2)(\?.*)?$/i,
						algorithm: 'gzip',
						compressionOptions: { level: 9 },
						threshold: 10240,
						minRatio: 0.8,
						deleteOriginalAssets: false
					})
				]
			}
		}
	}
}
