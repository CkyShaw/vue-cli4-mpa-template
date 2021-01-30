/*!
 * api公共模块
 */

import axios from 'axios'

/**
 * 全局公共axios本地静态数据请求方法
 * @param  {String}  file 文件名称（包括后缀名）
 * @return {Promise}      axios结果
 */
const loadStaticDataByLocalFile = file => {
	return axios(`./assets/data/${file}`)
}

export default {
	loadStaticDataByLocalFile
}
