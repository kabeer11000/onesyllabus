const { parentPort, workerData } = require('worker_threads');
const comlink = require('comlink');
const nodeEndpoint = require('comlink/dist/umd/node-adapter');
console.log(require.main.path)
const workerAPI = require("../worker-files/index.js");

if (!parentPort) {
    throw new Error('InvalidWorker');
}
comlink.expose(new workerAPI(), nodeEndpoint(parentPort));