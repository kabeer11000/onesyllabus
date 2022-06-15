import {MongoDB} from "../../../database";
import Fuse from "fuse.js";
import {Search} from "../../../api/ai/search";
import {IContent, IPage} from "@/types/";
// import {groupBy} from "../../../utils/utils";
// const { SimilarSearch } = require('node-nlp');
const {performance} = require('perf_hooks');

// import BSON from "bson";

interface IResponse {
    pages: Array<{
        score: number,
        page: IPage
    }>,
    execution_time: number,
    scores?: Array<number>
}

const SearchByIndex = (query, string) => {
    let count = 0
    string = string.toLowerCase()
    query = query.toLowerCase()
    let position = string.indexOf(query)
    const indexes = []
    while (position !== -1) {
        count++
        let initialPosition = position;
        position = string.indexOf(query, position + query.length)
        indexes.push([initialPosition, initialPosition + query.length])
    }
    return indexes
}

export default async function (req, res) {
    const start = performance.now();
    // if (req.method !== 'POST') return res.status(405).send({message: 'unsupported method'});
    const {filterCats = [], filterTopics = [], filterYears = [], q} = (req.query); // JSON.parse
    if (!q) return res.status(405).send({message: 'parameter missing'});
    // const similar = new SimilarSearch();
    const response: IResponse = await (await fetch(Search.buildQuery(req.query.q, 30))).json();
    const db = await MongoDB;
    const documents: Array<IContent> = await db.collection("documents").find({
        "year.@inferred.integer": filterYears.length ? {$in: filterYears} : {$exists: true},
        cat: filterCats.length ? {$in: filterCats} : {$exists: true},
        topic: filterTopics.length ? {$in: filterTopics} : {$exists: true}
    }).toArray();
    const documentIds: Array<string> = documents.map(document => document.id);
    const filteredPages: Array<{
        score: number,
        page: IPage
    }> = response.pages.filter(resource => documentIds.includes(resource.page.pdf));

    // const hierarchy = groupBy(filteredPages, item => item.page.pdf)
    // console.log(new RegExp(req.query.q.split(" ").join("+"), 'gi'));
    // const regex = new RegExp(req.query.q.split(" ").map(v => `(?:${v}|$)`).join("+"), 'idg')
    // console.log(regex)
    // content: matches.map(q => resource.page.text.substring(q[0], q[1]))
    const topics = await db.collection("topics").find({
        id: {$in: filteredPages.map(page => page.page.topic)}
    }).toArray();
    const sessions = await db.collection("category-sessions").find({
        id: {$in: documents.map(document => document.resource.session)}
    }).toArray();
    const docTypes = await db.collection("category-document-type").find({
        id: {$in: documents.map(document => document.resource["document-type"])}
    }).toArray();
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header(
    //     "Access-Control-Allow-Headers",
    //     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    // );
    return res.json({
        q: req.query.q,
        // hierarchy: Object.fromEntries(hierarchy),
        total: response.pages.length,
        items: filteredPages.map(resource => {
            const document: IContent = documents.find(document => document.id === resource.page.pdf);
            //.replace(/([^a-z0-9]+)/gi, '')
            return ({
                document,
                page: resource.page,
                highlight: [{
                    key: "document.title",
                    indices: req.query.q.replace(/[^a-z0-9]/gi, '').split(" ").map(q => SearchByIndex(q, document.file.name)).flat()
                }, {
                    key: "page.text",
                    indices: req.query.q.replace(/[^a-z0-9]/gi, '').split(" ").map(q => SearchByIndex(q, resource.page.text)).flat()
                }],
                topic: topics.find(topic => topic.id === document.topic),
                session: sessions.find(session => session.id === document.resource.session),
                type: docTypes.find(type => type.id === document.resource["document-type"]),
                score: resource.score
            })
        }),
        ann_retrieval: response.execution_time,
        execution_time: (performance.now() - start) * 0.001
    })
    // const filtered = response.documents.filter(document => !cats.include(document.cat) || !cats.include(document.topic) || !cats.include(document.year["@inferred"].integer))
}

async function handler(req, res) {
    const db = await MongoDB;
    const topics = await db.collection("topics").find({
        cat: req.query.cat
    }).toArray();
    const sessions = await db.collection("category-sessions").find({
        cat: req.query.cat
    }).toArray();
    const docTypes = await db.collection("category-document-type").find({
        cat: req.query.cat
    }).toArray();
    // return res.json(pages);
    let pages = []
    const fuse = new Fuse(pages, {
        keys: [
            {name: 'text', weight: 3},
            {name: '@pdf.year.name', getFn: page => page?.["@pdf"]?.["year"]?.name, weight: 3},
            {name: '@pdf.@type.alias', getFn: page => page?.["@pdf"]?.["@type"]?.alias, weight: 4},
            {name: '@pdf.@session.alias', getFn: page => page?.["@pdf"]?.["@session"]?.alias, weight: 4},
            {name: '@pdf.resource.variant', getFn: page => page?.["@pdf"]?.["resource"]?.variant, weight: 4},
            {name: 'page_id', weight: 0.5}
        ],
        isCaseSensitive: false,
        includeScore: true,
        shouldSort: false,
        includeMatches: true,
        findAllMatches: false,
        minMatchCharLength: 2,
        location: 0,
        tokenize: true,
        threshold: 0.0,
        distance: 500,
        useExtendedSearch: false,
        ignoreLocation: true,
        ignoreFieldNorm: true,
        fieldNormWeight: 1,
    });
    const pagesCursor = await db.collection("document-pages").find({
        cat: req.query.cat
    }); // TODO may cause memory errors
    await pagesCursor.forEach((page) => {
        page = ({...page, text: page.text.replace(/\n/g, ' ').replace(/\r/g, ' ')})
        fuse.add(page);
        const document = fuse.search(req.query.q).find(doc => doc.item.id === page.id);
        if (!document || document.score < 0.0) fuse.removeAt(pages.length - 1);
    }); // only loads item one by one, removes if score irrelevant
    const pdf_ids = [...new Set(pages.map(page => page.pdf))];
    const pdfs = await ((await MongoDB).collection("documents")).find({id: {$in: pdf_ids}}).toArray();

    pages = pages.map(page => {
        const pdf = pdfs.find(pdf => pdf.id === page.pdf);
        return ({
            ...page,
            "@pdf": ({
                ...pdf,
                "@topic": topics.find(topic => topic.id === pdf.topic),
                "@session": sessions.find(session => session.id === pdf.resource.session),
                "@type": docTypes.find(type => type.id === pdf.resource["document-type"])
            })
        })
    })
    const results = fuse.search(req.query.q);
    const response = [];
    for (const result of results) {
        const pdf = pdfs.find(pdf => pdf.id === result.item.pdf);
        response.push({
            ...result,
            item: {
                ...result.item,
                "@pdf": ({
                    ...pdf,
                    "@topic": topics.find(topic => topic.id === result.item.topic),
                    "@session": sessions.find(session => session.id === pdf.resource.session),
                    "@type": docTypes.find(type => type.id === pdf.resource["document-type"])
                })
            }
        });
    }
    // console.log(req.query.q);
    res.json(response)

}