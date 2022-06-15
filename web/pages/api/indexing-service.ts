// import {Spyder} from "../../indexing/updated-index";
import {Content, Scrapers} from "../../indexing/scripts";
import {MongoDB} from "@/database/index";
import {IContent, ITopic, IYear} from "@/types/index";
import {IContent as IContentScraper} from "../../indexing/scraper/utils/types";
// import * as fs from "fs/promises";
// import path from "path";
// import jsonArray from "../../public/dumps/years.json";
import {arrayEquals} from "../../utils/utils";

const ChunkArray = (a, size) => Array.from(new Array(Math.ceil(a.length / size)),(_, i) => a.slice(i * size, i * size + size));

export default async function handler(req, res) {
    const db = await MongoDB;
    const scraper = Scrapers[0];
    const topics: ITopic[] = await db.collection("topics").find({
        "@api.provider": "__kn.papers.crawlers.gceguide",
    }, {_id: 0}).toArray();
    console.log('found topics ', topics.length);
    let fileCount = 0;
    let fileNames = [];
    for (const topic of topics) {
        console.log("selected topic: ", topic.name);
        console.log("indexing: ", topic.name);
        const years: IYear[] = await db.collection("years").find({
            topic: topic.id,
            appearance: topic.appearance
        }, {_id: 0}).toArray();
        for (const year of years) {
            const indexedFiles: Array<IContent> = await db.collection("documents").find({year: year.id}, {_id: 0}).toArray();
            const files: Array<IContentScraper> = await scraper.initialised.GetContent(year["@upstream"]["@attach"]);
            if (arrayEquals(files.map(file => file.file.name), indexedFiles.map(file => file.file.name))) {
                console.log("nothing updated in this year");
                continue;
            }
            const filteredFileList: Array<IContentScraper> = files.filter(file => !indexedFiles.find(f => (f.file.location === file.file.location) && (f.year === year.id)));
            console.log("year: ", year.name, " files found: ", filteredFileList.length);
            await Content(scraper.initialised, {
                appearance: topic.appearance,
                topic: topic.id,
                year: year,
                group: topic.group,
                cat: topic.cat
            });
            fileCount += filteredFileList.length;
            fileNames.push(filteredFileList.map(file => file.file.name))
        }
    }
    res.json({fileCount, fileNames: fileNames.flat()});
}