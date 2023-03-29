module.exports = {
	typeOf: (data) => {
		return Object.prototype.toString.call(data).splice(8, -1);
	},
};
