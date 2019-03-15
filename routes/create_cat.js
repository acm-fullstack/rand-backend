const datalib = require('../lib/data.js')


module.exports = (req, res, method, headers, path, query, body) => {

    console.log("Enterence body -> ", body);
    
    if ( method.toUpperCase() === "POST" ) {

        const {id, nickname="", number} = body;
        const cat = {id, nickname, number};

        if ( typeof cat.id !== "number" || typeof cat.nickname !== 'string' || typeof cat.number !== 'number' ){
            res.end("Invalid types found");
            return;
        }

        datalib.create('cats', cat.id, cat)
            .then(() => {
                res.end("Cat Created with id:" + cat.id.toString());
            })
            .catch(() => {
                res.end("Cat could not be created");
            });
    } else {
        res.end("Error, invalid usage");
    }
};
