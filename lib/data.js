const fs = require('fs');
const path = require('path');
const util = require("util");

// Container for module (to be exported)
const lib = {};

// Base directory of data folder
lib.baseDir = path.join(__dirname, '/../database/');

// Promisify necessary file operation methods for usage ease!
const fsOpen = util.promisify(fs.open);
const fsWriteFile = util.promisify(fs.writeFile);
const fsClose = util.promisify(fs.close);
const fsReadFile = util.promisify(fs.readFile);
const fsFtruncate = util.promisify(fs.ftruncate);
const fsUnlink = util.promisify(fs.unlink);
const fsReaddir = util.promisify(fs.readdir);

/**
 * Creates a file with given collection directory and document name and writes the given data.
 * @param collection {string}
 * @param document {string}
 * @param data {object}
 * @returns {Promise<void>}
 */
lib.create = async (collection, document, data) => {
    const fileDescriptor = await fsOpen(lib.baseDir + collection + '/' + document + '.json', 'wx');
    const stringData = JSON.stringify(data);
    await fsWriteFile(fileDescriptor, stringData);
    await fsClose(fileDescriptor);
};

/**
 * Reads the contents of the document in collection
 * @param collection
 * @param document
 * @returns {Promise<object>}
 */
lib.read = (collection, document) =>
    fsReadFile(lib.baseDir + collection + '/' + document + '.json', 'utf8')
        .then(result => JSON.parse(result));

/**
 * Updates the contents of the file where given collection directory and with given document name.
 * @param collection {string}
 * @param document {string}
 * @param data {object}
 * @returns {Promise<void>}
 */
lib.update = async (collection, document, data) => {
    const fileDescriptor = await fsOpen(lib.baseDir + collection + '/' + document + '.json', 'r+');
    const stringData = JSON.stringify(data);
    await fsFtruncate(fileDescriptor);
    await fsWriteFile(fileDescriptor, stringData);
    await fsClose(fileDescriptor);
};

/**
 * Deletes given document in a collection.
 * @param collection
 * @param document
 * @returns {Promise<void>}
 */
lib.delete = (collection, document) => fsUnlink(lib.baseDir + collection + '/' + document + '.json');

/**
 * Reads all documents of a collection.
 * @param collection
 * @returns {Promise<[Object]>}
 */
lib.findAll = collection => fsReaddir(lib.baseDir + collection)
    .then(result => result.map(file => file.replace(".json", "")))
    .then(ids => Promise.all(ids.map(id => lib.read(collection, id))));

// Export the module
module.exports = lib;
