<template>
	<div class="frame">
		<!-- 导航组件 H:50px -->
		<a-menu mode="horizontal" v-model="activeModuleName" @select="handleSelectModule">
			<template v-for="(module, index) in moduleList">
				<a-menu-item :name="module.name" :key="module.name">
					<a-icon :type="module.icon" />
					{{ module.name }}
				</a-menu-item>
			</template>
		</a-menu>
		<!-- iframe 展示区域 -->
		<a-spin size="large" :spinning="spinning" tip="模块加载中...">
			<div class="iframe-wrap">
				<template v-for="(module, index) in openListCache">
					<iframe
						frameborder="0"
						width="100%"
						height="100%"
						scrolling="no"
						allowtransparency="true"
						:src="module.src"
						:key="module.name"
						v-show="module.name == activeModuleName[0]"
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
			activeModuleName: [],
			spinning: false
		}
	},
	computed: {
		openListCache() {
			return this.moduleList.filter(item => item.isOpen)
		}
	},
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
			data.forEach(module => {
				module.isOpen = false
				module.src = this.updateModuleSrc(module.src)
			})

			this.moduleList = data
		},
		updateModuleSrc(url) {
			// 后台的数据 ac/index.html?name=jack&age=18#/system/device?id=8
			// http://172.26.3.95:5210/index.html?systemId=1001&hiddenTree=1#/intelligent
			let src = window.location.href + '404'
			if (url && url.indexOf('http') != -1) {
				src = url
			} else {
				// 解析
				let moduleName = url.split('/')[0]
				let moduleParmas = url.split('?')[1] || ''
				// 部署环境
				if (url && process.env.NODE_ENV == 'production') {
					// 全路径 404模板需要
					let pathname = window.location.pathname
					let folderPath = pathname.substring(0, pathname.lastIndexOf('/'))
					src = window.location.origin + folderPath + `/module/` + url
				}
				// 开发环境
				if (url && process.env.NODE_ENV == 'development') {
					src = moduleName + '.html' + '?' + moduleParmas
				}
			}
			return src
		},
		loadFirstModule(moduleList) {
			try {
				if (moduleList && moduleList.length > 0) {
					this.$nextTick(() => {
						this.handleSelectModule({ key: moduleList[0]['name'] })
					})
				} else {
					this.$dsaMessage.error(`模块数据读取失败！`)
				}
			} catch (e) {
				this.$dsaMessage.error(`${e}`)
			}
		},
		handleSelectModule({ key }) {
			let item = this.findItemByKey(key)
			if (!item.isOpen) {
				this.spinning = true
			}
			this.activeModuleName = [key]
			item.isOpen = true
		},
		findItemByKey(key) {
			return this.moduleList.find(item => {
				return item.name == key
			})
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

  	.ant-menu-horizontal {
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
