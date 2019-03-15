const fs = require('fs');
const util = require("util");
const readdir = util.promisify(fs.readdir);
const routes = [];
const init = async () => {
    const files = await readdir(__dirname);
    files.filter(file => "index.js" !== file)
        .map(file => routes.push(require("./" + file)));
};
init().catch(console.error);
module.exports = (req, res, method, headers, path, query, body) => {
    routes.forEach(route => route(req, res, method, headers, path, query, body));
};

