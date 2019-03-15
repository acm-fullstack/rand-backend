const url = require("url");
const stringDecoder = require("string_decoder");
const decoder = new stringDecoder.StringDecoder("utf-8");
const config = require("./config");

const server = (request, response) => {
    const {pathname, query} = url.parse(request.url, true);
    const path = pathname.replace(/^\/+|\/+$/g, "");
    const method = request.method.toLowerCase();
    const {headers} = request;

    let body = "";
    // listen for incoming data stream.
    request.on("data", data => {
        body += decoder.write(data);
    });
    // trigger when the stream is finished.
    request.on("end", () => {
        console.log(method, headers, path, query, body);
        response.setHeader("Content-Type", "application/json");
        response.writeHead(200);
        response.end("hello I am a happy server!");
    });
};

const init = () => {
    const http = require("http");

    const {httpPort, name: environmentName} = config;

    /**
     * HTTP server entry point.
     */
    http
        .createServer(server)
        .listen(httpPort, () =>
            console.log(`Listening http on port: ${httpPort} environment: ${environmentName}...`)
        );
};

init();
