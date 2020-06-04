/*!
 * app配置文件
 */
export default {
	/**
	 * @description 接口配置
	 */
	baseUrl: {
		dev: `${$_development.request.location}/${$_development.request.serviceModule}`,
		pro: `${$_production.request.location}/${$_production.request.serviceModule}`
	},
	/**
	 * @description 是否开启主题模式
	 */
	theme: false
}
