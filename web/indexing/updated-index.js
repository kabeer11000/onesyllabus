// import {PapersAPI} from "../api/kabeercloud/papers-api";
import {MongoDB} from "../database";
// import * as fs from "fs/promises";
import uuid from "uuid";
import Gceguide from "./scraper/gceguide";
import {convertToSlug} from "../utils/Slug";
import MLKitOCR from "../api/mlkit/ocr";

export const insertReturn = async (collection, doc) => {
    const {insertedId} = await collection.insertOne(doc);
    return ({...doc, _id: insertedId});
}

const ProcessFile = async ({db, scraper, topic, cat, group, year, appearance}) => {
    const files = await scraper.GetContent(year["@upstream"]["@upstream.attach"]);
    console.log("Files Found: ", files.length);
    for (const file of files) {

        // if (file.type !== "YEAR") {
        //     console.log("File type is not year", file.type)
        //     break;
        // }
        let exists = (await db.collection("pdf-indexed").findOne({
            group: group.id,
            cat: cat.id,
            appearance: appearance ? appearance.id : null,
            topic: topic.id,
        }));
        if (exists) {
            console.log("Skipping File", exists.file.name, {
                id: exists.id,
                group: group.id,
                cat: cat.id,
                appearance: appearance ? appearance.id : null,
                topic: topic.id,
            });
            break; //TODO document may exist but its pages may not
        }

        const {pages, total} = await MLKitOCR.RecognizePDF({pdf: file.file.location, getImages: false});
        const documentType = await (await db.collection('cat-document-type')).findOne({
            cat: cat.id,
            appearance: appearance?.id,
            alias: {$in: [file["@meta"]["inferred"]["resource"]["document-type"]?.toUpperCase()]}
        }) ?? (await insertReturn(await db.collection('cat-document-type'), {
            cat: cat.id,
            id: uuid.v4(),
            appearance: appearance ? appearance.id : null,
            alias: [file["@meta"]["inferred"]["resource"]["document-type"]?.toUpperCase()]
        }));
        const documentSession = await (await db.collection('cat-sessions')).findOne({
            cat: cat.id,
            appearance: appearance ? appearance.id : null,
            alias: {$in: [file["@meta"]["inferred"]["resource"]["session"]?.toUpperCase()]}
        }) ?? (await insertReturn(await db.collection('cat-sessions'), {
            cat: cat.id,
            id: uuid.v4(),
            appearance: appearance?.id,
            alias: [file["@meta"]["inferred"]["resource"]["session"]?.toUpperCase()]
        }));
        const document = exists ?? (await insertReturn(await db.collection('pdf-indexed'), {
            "id": uuid.v4(),
            "tags": file["@meta"]["tags"],
            group: group.id,
            "cat": cat.id,
            appearance: appearance?.id,
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
                "page-count": total,
                "timestamp": Date.now(),
            },
            "file": {
                "location": file["file"].location,
                "name": file["file"].name,
            }
        }));
        await db.collection('pdf-pages-indexed').insertMany(pages.map(({index, text, image}) => ({
            "text": text,
            "id": uuid.v4(),
            topic: topic.id,
            cat: cat.id,
            group: group.id,
            appearance: appearance?.id,
            "@meta": {
                "ocr": "kn.mlkit.ocr.tesseract",
                "timestamp": Date.now()
            },
            "image": {
                // "hosted": `https://docs.kabeercloud.tk/static/papers/screenshots/${pageId}.png`
            },
            "pdf": document.id,
            "index": index
        })));

        console.log("Inserted ", pages.length, " Pages");
    }
}

export const Spyder = async () => {
    const db = await MongoDB;
    const scraper = new Gceguide();
    const groups = await scraper.GetGroups();
    console.log("Groups Found: ", groups.length)
    for (let group of groups) {
        console.log("Indexing Group@", group.name)
        group = (await db.collection("groups").findOne({
            name: group.name,
            "@api.provider": group["@upstream"]["provider"]
        })) ?? (await insertReturn(await db.collection("groups"), {
            "id": uuid.v4(),
            "slug": convertToSlug(group.name),
            "@api": {
                "provider": group["@upstream"]["provider"],
                "@upstream": group["@upstream"]
            },
            "name": group.name
        }));
        // Schema Update
        const cats = await scraper.GetCats(group["@api"]["@upstream"]["@upstream.attach"]);
        console.log("Cats Found: ", cats.length)
        for (let cat of cats) {
            console.log("Indexing Cat@", cat.name)
            cat = (await db.collection("cat").findOne({
                name: cat.name,
                group: group.id
            })) ?? (await insertReturn(await db.collection("cat"), {
                "name": cat.name,
                "id": uuid.v4(),
                group: group.id,
                "slug": convertToSlug(cat.name),
                "@api": {
                    "provider": cat["@upstream"]["provider"],
                    "@upstream": cat["@upstream"]
                },
                "appearances": {
                    "single_appearance": !!!(cat["appearances"].length),
                    "all": cat["appearances"]
                }
            }));
            if (!cat.appearances.single_appearance) {
                for (let appearance of cat.appearances.all) {
                    console.log("Indexing Cat@", appearance.name)
                    appearance = (await db.collection("appearance").findOne({
                        "name": appearance.name,
                        cat: cat.id,
                        group: group.id
                    })) ?? (await insertReturn(await db.collection("appearance"), {
                        "name": appearance.name,
                        "id": uuid.v4(),
                        group: group.id,
                        cat: cat.id,
                        "slug": convertToSlug(appearance.name),
                        "@inferred": appearance["@inferred"],
                        "@api": {
                            "provider": appearance["@upstream"]["provider"],
                            "@upstream": appearance["@upstream"]
                        }
                    }));
                    const topics = (await scraper.GetTopics(appearance["@api"]["@upstream"]["@upstream.attach"])).reverse(); //.appearances[0]
                    console.log(appearance.name, " > ", "Topics Found: ", topics.length);
                    for (let topic of topics) {
                        topic = (await (await db.collection("topic")).findOne({
                            name: topic["name"],
                            cat: cat.id,
                            topic: topic.id
                        })) ?? (await insertReturn(await db.collection("topic"), {
                            "name": topic["name"],
                            "description": topic["description"],
                            "id": uuid.v4(),
                            "@meta": {
                                "code": topic["@inferred"]["code"],
                                "timestamp": Date.now(),
                            },
                            "@api": {
                                "provider": topic["@upstream"]["provider"],
                                "@upstream": topic["@upstream"]

                            },
                            "cat": cat.id,
                            "group": group.id,
                            "slug": convertToSlug(topic["name"] || topic["@inferred"]["name_full"])
                        }));
                        const years = (await scraper.GetYears(topics[0]["@upstream"]["@upstream.attach"])).reverse();
                        for (const year of years) await ProcessFile({db, appearance, scraper, topic, cat, group, year})

                    }
                }
            } else {
                const topics = (await scraper.GetTopics(cat["@api"]["@upstream"]["@upstream.attach"])).reverse(); //.appearances[0]
                console.log("Topics Found: ", topics.map(t => t.name));
                for (let topic of topics) {
                    topic = (await (await db.collection("topic")).findOne({
                        name: topic["name"],
                        cat: cat.id,
                        topic: topic.id
                    })) ?? (await insertReturn(await db.collection("topic"), {
                        "name": topic["name"],
                        "description": topic["description"],
                        "id": uuid.v4(),
                        "@meta": {
                            "code": topic["@inferred"]["code"],
                            name_full: topic["@inferred"]["name_full"],
                            "timestamp": Date.now(),
                        },
                        "@api": {
                            "provider": topic["@upstream"]["provider"],
                            "@upstream": topic["@upstream"]

                        },
                        "cat": cat.id,
                        "group": group.id,
                        "slug": convertToSlug(topic["@inferred"]["name_full"])
                    }));
                    console.log("indexing topic: ", topic.name);
                    const years = (await scraper.GetYears(topic["@api"]["@upstream"]["@upstream.attach"])).reverse();
                    console.log("Years Found: ", years.length);
                    for (const year of years) await ProcessFile({db, scraper, topic, cat, group, year})
                }
            }
        }
    }
}