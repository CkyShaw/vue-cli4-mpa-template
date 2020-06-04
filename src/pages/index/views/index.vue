<template>
	<div class="frame">
		<!-- 导航组件 H:50px -->
		<Menu mode="horizontal" :active-name="activeModuleName" @on-select="handleSelectModule">
			<template v-for="(module, index) in moduleList">
				<MenuItem :name="module.name" :key="module.name">
					<Icon :type="module.icon" />
					{{ module.name }}
				</MenuItem>
			</template>
		</Menu>
		<!-- iframe 展示区域 -->
		<a-spin size="large" :spinning="spinning" tip="模块加载中...">
			<div class="iframe-wrap">
				<template v-for="(module, index) in moduleList">
					<iframe
						frameborder="0"
						width="100%"
						height="100%"
						scrolling="no"
						allowtransparency="true"
						:src="moduleSrcList[index]"
						:key="module.name"
						v-show="index == activeModuleIndex"
						@load="spinning = false"
					></iframe>
				</template>
			</div>
		</a-spin>
	</div>
</template>
<script>
export default {
	name: 'frame',
	components: {},
	directives: {},
	filters: {},
	mixins: {},
	props: {},
	data() {
		return {
			moduleList: [],
			moduleSrcList: [],
			activeModuleName: '',
			activeModuleIndex: null,
			spinning: false
		}
	},
	computed: {},
	watch: {},
	created() {
		this.init()
	},
	mounted() {},
	activated() {},
	beforeUpdate() {},
	updated() {},
	beforeDestroy() {},
	methods: {
		async init() {
			await this.getModuleListByLocal()
			this.loadFirstModule(this.moduleList)
		},
		// 获取模块配置静态文件
		async getModuleListByLocal() {
			let { data } = await this.$_api.common.loadStaticDataByLocalFile('module.json')
			this.moduleSrcList = new Array(data.length)
			data.forEach(module => {
				module.src = this.updateModuleSrc(module.src)
			})
			this.moduleList = data
		},
		// 根据不同环境转换地址
		updateModuleSrc(url) {
			// 外部链接
			let src = window.location.href + '404'
			if (url && url.indexOf('http') != -1) {
				src = url
			} else {
				// 解析
				let moduleString = url.split('#')[0]
				let moduleName = moduleString.split('?')[0]
				let moduleQuery = ''
				if (moduleString.split('?')[1]) {
					moduleQuery = '?' + moduleString.split('?')[1]
				}
				let hashPath = url.split('#')[1]
				// 部署环境
				if (url && process.env.NODE_ENV == 'production') {
					// 全路径 404模板需要
					let pathname = window.location.pathname
					let folderPath = pathname.substring(0, pathname.lastIndexOf('/'))
					src =
						window.location.origin +
						folderPath +
						`/module/${moduleName}/index.html${moduleQuery}#` +
						(hashPath || '/')
					// 自动拼接补全
					// return url
				}
				// 开发环境
				if (url && process.env.NODE_ENV == 'development') {
					src = moduleName + '.html' + moduleQuery + '#' + (hashPath || '/')
				}
			}
			return src
		},
		// 切换模块
		handleSelectModule(name) {
			this.spinning = true
			this.activeModuleName = name
			this.activeModuleIndex = this.moduleList.findIndex(module => module.name == name)

			if (typeof this.moduleSrcList[this.activeModuleIndex] === 'undefined') {
				this.moduleSrcList[this.activeModuleIndex] = this.moduleList[this.activeModuleIndex].src
			} else {
				this.spinning = false
			}
		},
		// 初始化加载第一个模块
		loadFirstModule(moduleList) {
			try {
				if (moduleList && moduleList.length > 0) {
					this.$nextTick(() => {
						this.handleSelectModule(moduleList[0]['name'])
					})
				} else {
					this.$ocxMessage.error(`模块数据读取失败！`)
				}
			} catch (e) {
				this.$ocxMessage.error(`${e}`)
			}
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
.frame {
	width: 1920px;
  	height: 100vh;
  	background-size: 100% 100vh;
  	overflow: hidden;

  	.ivu-menu-horizontal {
		display: flex;
    	justify-content: center;
    	height: 50px;
    	line-height: 50px;
	}

	/deep/ .ant-spin-blur::after {
    	opacity: 0;
  	}

  	.iframe-wrap {
    	width: 100%;
    	height: calc(100vh - 50px);

	    .mask {
	      	width: 1920px;
	       	height: calc(100vh - 50px);
	      	background: #0af;
	      	background-size: 1920px calc(100vh - 50px);
	      	position: absolute;
	      	z-index: 1;
	    }

	    iframe {
	       	height: calc(100vh - 50px);
	    }
  	}
}
</style>
