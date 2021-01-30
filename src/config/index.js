/*!
 * app配置文件
 */
let { $_connection } = global
export default {
	/**
	 * @description 接口配置
	 */
	baseUrl: `${$_connection.request.location}/${$_connection.request.serviceModule}`,
	/**
	 * @description 是否开启主题模式
	 */
	theme: false
}
