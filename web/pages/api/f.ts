import {startWorkers, workers} from "../../indexing/scripts/Worker";

export default async function handler (req, res) {
    startWorkers();
    const c = [...workers][0].co();

    return res.json(c);
}