dblib = require('../lib/data')

module.exports = (req, res, method, headers, path, query, body) => {
	console.log(method.toUpperCase())
	if (method.toUpperCase() === "PUT"){

		dblib.update('cats', path, body).then(() => {
			res.statusCode = 200;
			res.end(JSON.stringify(body));
		}).catch((e) => {
			console.log(e)
			res.statusCode = 400;
			res.end('FAILED')
		})

	}
};
