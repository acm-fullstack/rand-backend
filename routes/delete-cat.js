const datalib = require('../lib/data.js');

module.exports = (req, res, method, headers, path, query, body) => {
	
	path_split = path.split("/")
	folder = path_split[0];
	id = path_split[1];
	
    if (method === "delete" && folder === "cats" && id.length > 0){
		
		datalib.delete("cats", id);
		
		temp = "object with id:" + id + "has been deleted.";
		res.end(temp);
		
	} else {
		res.end("Error, invalid usage")
	}
};
