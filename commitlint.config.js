module.exports = {
	extends: ['@commitlint/config-conventional'],
	rules: {}
}

/**
 * @example1 git commit -m 'feat: 增加 xxx 功能'
 * @example2 git commit -m 'bug: 修复 xxx 功能'
 *
 * feat      新特性、新功能
 * fix       bug修复
 * build     发布版本
 * perf      优化相关，比如提升性能、体验
 * refactor  代码重构
 * revert    版本还原
 * style     代码格式修改, 注意不是 css 修改
 * chore     其他修改, 比如改变构建流程、或者增加依赖库、工具等
 * docs      文档修改
 * ci        持续集成修改
 * test      测试用例修改
 */
