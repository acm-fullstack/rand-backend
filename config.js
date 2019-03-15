const environments = {};

environments.dev = {
    name: "dev",
    debug: true,
    httpPort: 3000,
};

environments.production = {
    name: "production",
    debug: false,
    httpPort: 80,
};

const NODE_ENV = typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV.toLowerCase() : "dev";

module.exports = environments[NODE_ENV];
