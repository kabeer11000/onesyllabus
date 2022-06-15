/**
 * https://github.com/GoogleChromeLabs/comlink/blob/master/docs/examples/06-node-example/main.mjs
 * https://github.com/GoogleChromeLabs/comlink/issues/476#issuecomment-642765445
 * esModuleInterop to true in tsconfig.json compilerOptions.
 */
import {Worker} from 'worker_threads';
import * as comlink from 'comlink';
import nodeEndpoint from 'comlink/dist/umd/node-adapter';
import {cpus} from 'os';
import type {Api} from './_worker.ts';

export const workers = new Set<comlink.Remote<Api>>();

export function startWorkers() {
    const count = cpus().length;

    for (let i = 0; i < count; i += 1) {
        const worker = new Worker(new URL(import.meta.url.slice(0, import.meta.url.length - 9) + "worker-export/index.js"), {
            type: 'module',
            workerData: {idx: i}
        });
        workers.add(comlink.wrap<Api>(nodeEndpoint(worker)));
    }
}

export function stopWorkers() {
    workers.forEach((worker) => worker.exit());
}

const chunkArray = (arr, size) =>
    arr.length > size
        ? [arr.slice(0, size), ...chunkArray(arr.slice(size), size)]
        : [arr];

export const _Workers = workers;
export const ProcessTopic = async (scraper, {years, topic, group, cat, appearance}) => {
    const chunks = chunkArray(years, workers.size);
    const response = [];
    for (const chunk of chunks) {
        const promises = [];
        for (const index in chunks) {
            promises.push(workers[index].indexContent(scraper, {
                year: chunk[index], topic, group, cat, appearance
            }));
        }
        response.push(await Promise.all(promises))
    }
    return response.flat();
}
export const init = async () => {

    const promises = [];
    for (const worker of workers) {
        promises.push(worker.pi(1000));
    }

    console.time('comlink');
    // console.log(await Promise.all(promises));
    console.timeEnd('comlink');

    const p = await Promise.all(promises);

    stopWorkers();
    return p;
};