module.exports = function (directory, modules) {
	let result = {}

	modules.forEach(module => {
		if (directory[module]) {
			result[module] = directory[module]
		}
	})

	return result
}
