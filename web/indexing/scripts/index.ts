import Gceguide from "../scraper/gceguide/index";
import {
    ICat as ICatScraper,
    IContent as IContentScraper,
    IGroup as IGroupScraper,
    ITopic as ITopicScraper,
    IUpstream,
    IYear as IYearScraper
} from "../scraper/utils/types";
import {MongoDB} from "@/database/index"
import {
    IAppearance,
    ICategory,
    ICategorySession,
    IContent,
    IDocumentType,
    IGroup,
    IPage,
    ITopic,
    IYear
} from "@/types/index";
import {v4} from "uuid";
import {convertToSlug} from "../../utils/Slug";
import MLKitOCR from "../../api/mlkit/ocr";

export const insertReturn = async (collection, doc) => {
    const {insertedId} = await collection.insertOne(doc);
    return ({...doc, _id: insertedId});
}

export const Scrapers = [{
    type: Gceguide,
    initialised: new Gceguide(),
    ProviderArtifact: "__kn.papers.crawlers.gceguide"
}]; //  {type: Ilmkiduniya, initialised: new Ilmkiduniya(), ProviderArtifact: "__kn.papers.crawlers.ilmkiduniya"}
// THE BEST WAY YET
export const Group = async (scraper) => {
    const db = await MongoDB;
    const indexes = ["id", "@api.provider", "name"];
    const groupsFetched: Array<IGroupScraper> = await scraper.initialised.GetGroups();
    const groups: IGroup[] = groupsFetched.map(group => ({
        id: v4(),
        "slug": convertToSlug(group.name),
        "@api": {
            "provider": scraper.ProviderArtifact,
            "@upstream": group["@upstream"]
        },
        "name": group.name
    }));
    const remoteIndexes = await db.collection("groups").indexes();
    if (!remoteIndexes.find(index => indexes.includes(index.name))) await db.collection("groups").createIndex(indexes.reduce((a, v) => ({
        ...a,
        [v]: 1
    }), {}), {unique: true});
    for (const [index, group] of groups.entries()) {
        const groupExists = await db.collection("groups").findOne({
            name: group.name,
            "@api.provider": scraper.ProviderArtifact
        });
        if (groupExists) (groups[index] = groupExists) && console.log("found group: ", group.name);
        else await db.collection("groups").insertOne(group) && console.log("inserted group: ", group.name);
    }
    return groups;
}
export const Cat = async (scraper, {group, upstreamParams}: { group: IGroup, upstreamParams: IUpstream }) => {
    const db = await MongoDB;
    const indexes = ["id", "@api.provider", "group", "name"];
    const categoriesFetched: Array<ICatScraper> = await scraper.initialised.GetCats(upstreamParams["@attach"]);
    const categories: ICategory[] = categoriesFetched.map(cat => {
        const id = v4();
        return ({
            "name": cat.name,
            "id": id,
            group: group.id,
            "slug": convertToSlug(cat.name),
            "@inferred": cat["@inferred"],
            "@api": {
                "provider": scraper.ProviderArtifact,
                "@upstream": cat["@upstream"]
            },
            "appearances": {
                "single_appearance": cat.appearances ? !Array.isArray(cat.appearances) : true, // !!!cat.appearances.length
                "all": Array.isArray(cat.appearances) ? cat.appearances.map(appearance => ({
                    name: appearance.name,
                    id: v4(),
                    group: group.id,
                    cat: id,
                    slug: convertToSlug(appearance.name),
                    "@inferred": appearance["@inferred"] || {},
                    "@api": {
                        "provider": scraper.ProviderArtifact,
                        "@upstream": appearance["@upstream"]
                    }
                })) : null
            }
        })
    });
    const remoteIndexes = await db.collection("categories").indexes();
    if (!remoteIndexes.find(index => indexes.includes(index.name))) await db.collection("categories").createIndex(indexes.reduce((a, v) => ({
        ...a,
        [v]: 1
    }), {}), {unique: true});
    for (const [index, cat] of categories.entries()) {
        const catExists = await db.collection("categories").findOne({
            name: cat.name,
            group: group.id,
            "@api.provider": scraper.ProviderArtifact
        });
        if (catExists) (categories[index] = catExists) && console.log("found cat: ", cat.name);
        else await db.collection("categories").insertOne(cat) && console.log("inserted cat: ", cat.name);
    }
    return categories;
}
export const Topic = async (scraper, {
    appearance,
    cat,
    upstreamParams
}: { appearance: IAppearance, cat: ICategory, upstreamParams: IUpstream }) => {
    const db = await MongoDB;
    const indexes = ["id", "@api.provider", "name"];
    if (!upstreamParams["@attach"]) {
        console.log(cat.name, appearance?.name, upstreamParams);
        throw new Error("@upstream.attach is not attached, " + JSON.stringify(upstreamParams));
    }
    const topicsFetched: Array<ITopicScraper> = await scraper.initialised.GetTopics(upstreamParams["@attach"]);
    const topics: ITopic[] = topicsFetched.map(topic => ({
        "name": topic.name,
        "description": topic?.description ?? "",
        "id": v4(),
        "@inferred": {
            "code": topic["@inferred"].code,
            "timestamp": Date.now(),
        },
        "@api": {
            "provider": scraper.ProviderArtifact,
            "@upstream": topic["@upstream"]
        },
        "cat": cat.id,
        "group": cat.group,
        appearance: appearance?.id,
        "slug": convertToSlug(topic.name + topic["@inferred"].code ?? "")
    }));
    const remoteIndexes = await db.collection("topics").indexes();
    if (!remoteIndexes.find(index => indexes.includes(index.name))) await db.collection("topics").createIndex(indexes.reduce((a, v) => ({
        ...a,
        [v]: 1
    }), {}), {unique: true});
    for (const [index, topic] of topics.entries()) {
        const topicExists = await db.collection("topics").findOne({
            name: topic.name,
            "@api.provider": scraper.ProviderArtifact
        });
        if (topicExists) (topics[index] = topic) && console.log("found topic: ", topic.name);
        else await db.collection("topics").insertOne(topic) && console.log("inserted topic: ", topic.name);
    }
    return topics;
}
export const Year = async (scraper, {
    upstreamParams
}: { appearance: IAppearance, topic: ITopic, upstreamParams: IUpstream }) => {
    const yearsFetched: Array<IYearScraper> = (await scraper.GetYears(upstreamParams["@attach"])).reverse();
    return yearsFetched;
    // const groupsFetched: Array<IGroupScraper> = await scraper.initialised.GetYears(upstreamParams["@upstream.attach"]);
    const years: IYear[] = yearsFetched.map(year => ({
        'name': year.name,
        '@inferred': {
            'integer': year["@inferred"].integer,
            ...year["@inferred"]
        },
        "@upstream": year["@upstream"]
    }));
    return years;
}
export const Content = async (scraper, {year, topic, group, cat, appearance}) => {
    const db = await MongoDB;
    const files: Array<IContentScraper> = await scraper.GetContent(year["@upstream"]["@attach"]);
    const indexedInThisYear: Array<IContent> = await db.collection("documents").find({
        year: year.id,
        group: group,
        cat: cat,
        appearance: appearance,
        topic: topic,
    }).toArray();
    console.log("files found: ", files.length);
    for (const file of files) {
        let exists = indexedInThisYear.find(i => i.file.location === file.file.location);
        /*
        * (await db.collection("documents").findOne({
        group: group,
        cat: cat,
        appearance: appearance ? appearance.id : null,
        topic: topic,
    }));*/
        if (exists) {
            console.log("skipping File", exists.file.name);
            continue; //TODO document may exist but its pages may not
        }

        const {pages, total, thumbnail} = await MLKitOCR.RecognizePDF({pdf: file.file.location, getImages: false});
        const documentType = await (await db.collection('category-document-type')).findOne({
            cat: cat,
            appearance: appearance,
            alias: {$in: [file["@meta"]["inferred"]["resource"]["document-type"]?.toUpperCase()]}
        }) ?? (await insertReturn(await db.collection('category-document-type'), <IDocumentType>{
            cat: cat,
            id: v4(),
            appearance: appearance,
            alias: [file["@meta"]["inferred"]["resource"]["document-type"]?.toUpperCase()]
        }));
        const documentSession = await (await db.collection('category-sessions')).findOne({
            cat: cat,
            appearance: appearance,
            alias: {$in: [file["@meta"]["inferred"]["resource"]["session"]?.toUpperCase()]}
        }) ?? (await insertReturn(await db.collection('category-sessions'), <ICategorySession>{
            cat: cat,
            id: v4(),
            appearance: appearance,
            alias: [file["@meta"]["inferred"]["resource"]["session"]?.toUpperCase()]
        }));
        const document = await insertReturn(await db.collection('documents'), <IContent>{
            id: v4(),
            tags: file["@meta"]["tags"] || [],
            group: group,
            cat: cat,
            appearance: appearance,
            topic: topic,
            year: year.id,
            "@inferred": {},
            resource: {
                "document-type": documentType.id,
                paper: file["@meta"]["inferred"]["paper_number"],
                year: file["@meta"]['inferred']["year"],
                variant: file["@meta"]["inferred"]["variant_number"],
                session: documentSession.id,
            },
            "@meta": {
                "page-count": total,
                timestamp: Date.now(),
                _year_name_tmp: year.name, // So the same mistake dont happen twice :)
            },
            file: {
                location: file["file"].location,
                name: file["file"].name,
            }
        });
        const insert_ids = await db.collection('document-pages').insertMany(pages.map(({index, text}) => <IPage>({
            text: text,
            id: v4(),
            topic: topic,
            cat: cat,
            group: group,
            appearance: appearance,
            year: year.id,
            recognition: {
                indices: []
            },
            "@meta": {
                // TODO Omitted to save space
            },
            image: {
                hosted: thumbnail.toString(),
            },
            pdf: document.id,
            index: index
        })));

        console.log("inserted ", pages.length, " pages, ids: ", insert_ids);
    }

}