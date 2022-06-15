import Ilmkiduniya from "../../indexing/scraper/ilmkiduniya/index";
import Gceguide from "../../indexing/scraper/gceguide";
import FetchWrapper from "../../indexing/scraper/utils/fetchWrapper";
import {Routes, Types} from "../../indexing/scraper/ilmkiduniya/types";

// export default async function __handler(req, res) {
//     console.log("request recieved")
//     const ilm = new Ilmkiduniya();
//     console.log("done")
//     const groups = await ilm.GetGroups();
//     const cats = await ilm.GetCats(groups[0]["@upstream"]["@upstream.attach"]);
//     const topics = await ilm.GetTopics(cats[0].appearances[0]["@upstream"]["@upstream.attach"]);
//     const years = await ilm.GetYears(topics[0]["@upstream"]["@upstream.attach"]);
//     console.log(years)
//
//     res.send(JSON.stringify(await ilm.GetContent(years[0]["@upstream"]["@upstream.attach"]), null, 4));
// }

export default async function handler(req, res) {
    console.log("request recieved")
    const ilm = new Ilmkiduniya();
    console.log("done")
    const groups = await ilm.GetGroups();
    console.log(groups[4]["@upstream"]["@upstream.attach"])
    const cats = await ilm.GetCats(groups[4]["@upstream"]["@upstream.attach"]);
    const topics = await ilm.GetTopics(cats[0].appearances[0]["@upstream"]["@upstream.attach"]);
    const years = await ilm.GetYears(topics[0]["@upstream"]["@upstream.attach"]);
    console.log(years)
    // return res.json(years);
    res.send(JSON.stringify(await ilm.GetContent(years[0]["@upstream"]["@upstream.attach"]), null, 4));
}