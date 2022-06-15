import KabeerCloudInstance from "../api/kabeercloud/upload";
import {MongoClient as _MongoClient} from "mongodb";
//mongodb+srv://kabeer11000:<password>@cluster0.2wemi.mongodb.net/test
export const MongoDB = (new _MongoClient(process.env.MONGODB_CONNECTION_STRING || "mongodb://0.0.0.0:27017/")).connect().then(db => db.db("KabeersPastPapers"));
export const collections = MongoDB;
export const GetCollection = async () => {
    return await ((await MongoDB).collection('pdf-pages-indexed').find({})).toArray();
}
export const StorePDFS = async (collections) => {
    // const kabeerCloud = new KabeerCloudInstance();
    console.log("saving to db")
    const collection = await (await MongoDB).collection('pdf-pages-indexed');
    // await fetch("https://docs.kabeercloud.tk/tests/json-inputs/json.php", {
    //     mode: "post",
    //     body: JSON.stringify({
    //         file: collections[0]
    //     }),
    //     headers: {
    //         "x-client-name": "KabeersPastPapersOCR"
    //     }
    // });
    // console.log(collections.map(c => c.map(a => ({
    //     texts: a.texts.data.text,
    //     id: a.id
    // }))).flat());
    await collection.insertMany(collections.map(pdf => pdf.pages.map(page => ({
        texts: page.recogniser === "ocrad" ? page.texts : page.texts.data.text,
        page_id: page.id,
        pdf_id: pdf.pdf_id,
        index: page.index,
    }))).flat());

    console.log("saved to db")
    // for (const page in collections) {
    //     console.log("uploading image: ")
    //     await kabeerCloud.UploadFile(page.image, page.id, ".png");
    //     console.log("done ")
    // }
    return;
}