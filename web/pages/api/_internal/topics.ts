import {MongoDB} from "@/database/index";

export default async function handler(req, res) {
    const db = await MongoDB;
    res.json((await db.collection("topics").find({
        group: req.query.group,
        cat: req.query.cat,
        appearance: req.query.appearance
    }).toArray()).map(topic => ({...topic, _id: String(topic._id)})));
}