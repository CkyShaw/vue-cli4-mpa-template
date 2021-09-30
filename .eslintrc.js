module.exports = {
	plugins: ['prettier'],
	extends: ['@qif/eslint-config', '@qif/eslint-config/vue2'],
	rules: {
		'prettier/prettier': 'error'
	}
}
