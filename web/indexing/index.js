import {PapersAPI} from "../api/kabeercloud/papers-api";
import {MongoDB} from "../database";
import {Recogniser} from "../recogniser";
import {ReadPDF} from "../recogniser/pdf";
import * as fs from "fs/promises";
const uuid = require("uuid");
const insertReturn = async (collection, doc) => {
    const {insertedId} = await collection.insertOne(doc);
    return ({...doc, _id: insertedId});
}
export const Spyder = async () => {
    const db = await MongoDB;
    const cats = await (await fetch(PapersAPI.getCategories)).json();
    console.log("Cats Found: ", cats.length);
    for (let cat of cats) {
        cat = (await (await db.collection("cat")).findOne({
            name: cat.name,
            slug: cat.slug
        })) ?? (await insertReturn(await db.collection("cat"), {
            "name": cat.name,
            "id": uuid.v4(),
            "location": cat.url,
            "slug": cat.slug
        }));

        const topics = await (await fetch(PapersAPI.getTopics(cat.slug))).json();
        console.log("Topics Found: ", topics.length);
        for (let topic of topics) {
            topic = (await (await db.collection("topic")).findOne({
                code: topic["@meta"]["code"],
                cat: cat.id,
                slug: topic.slug
            })) ?? (await insertReturn(await db.collection("topic"), {
                "name": topic["@meta"]["name"],
                "description": null,
                "code": topic["@meta"]["code"],
                "id": uuid.v4(),
                cat: cat.id, // Multiple Cats can have the same topic
                "@meta": {
                    "name_full": topic["@meta"]["name_full"],
                    "timestamp": Date.now()
                },
                "slug": topic.slug,
                "location": topic.url
            }));
            const years = await (await fetch(PapersAPI.getYears(topic.slug))).json();
            console.log("Years Found: ", years.length);
            for (const year of years) {
                const files = await (await fetch(PapersAPI.getContents(year.slug))).json();
                for (const file of files) {
                    const arrayBuffer = (await (await fetch(file["@file"].location)).arrayBuffer());
                    const buffer = Buffer.from(new Uint8Array(arrayBuffer));
                    const {fingerprints, metadata, images: screenShotBuffers} = await ReadPDF(buffer);
                    const documentType = await (await db.collection('cat-document-type')).findOne({
                        cat: cat.id,
                        alias: file["@meta"]["inferred"]["type"].toLowerCase()
                    });
                    const documentSession = await (await db.collection('cat-sessions')).findOne({
                        cat: cat.id,
                        alias: file["@meta"]["inferred"]["session"].toUpperCase()
                    });
                    const document = (await (await (db.collection("pdf-indexed")).findOne({
                        "file.location": file.location,
                        cat: cat.id,
                        topic: topic.id,
                    }))) ?? (await insertReturn(await db.collection('pdf-indexed'), {
                        "id": uuid.v4(),
                        "tags": file["@meta"]["tags"],
                        "cat": cat.id,
                        "topic": topic.id,
                        "year": year,
                        "resource": {
                            "document-type": documentType.id,
                            "paper": file["@meta"]["inferred"]["paper_number"],
                            "year": file["@meta"]['inferred']["year"],
                            "variant": file["@meta"]["inferred"]["variant_number"],
                            "session": documentSession.id,
                        },
                        "@meta": {
                            "fingerprint": fingerprints,
                            "timestamp": Date.now(),
                            "metadata": metadata
                        },
                        "file": {
                            "location": file["@file"].location,
                            "name": file["@file"].name,
                        }
                    }));
                    const recognition = (await Recogniser(screenShotBuffers));
                    const pages = recognition.map((pageText, index) => {
                        const pageId = uuid.v4();
                        fs.writeFile(("/Users/asadrizvi/Documents/Projects/Papers/next/indexing/" + "images/" + pageId + ".png"), (screenShotBuffers[index].image));
                        return ({
                            "text": pageText.texts.data.text,
                            confidence: pageText.texts.data.confidence,
                            // blocks: pageText.texts.data.blocks,
                            "id": pageId,
                            topic: topic.id,
                            cat: cat.id,
                            "@meta": {
                                "ocr": "kn.mlkit.ocr.tesseract",
                                "timestamp": Date.now()
                            },
                            "image": {
                                "hosted": `https://docs.kabeercloud.tk/static/papers/screenshots/${pageId}.png`
                            },
                            "pdf": document.id,
                            "index": index
                        })
                    });
                    console.log(pages);
                    (await db.collection('pdf-pages-indexed')).insertMany(pages);
                }
            }
        }
    }
}
