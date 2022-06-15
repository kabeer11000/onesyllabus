import {Recogniser, RecogniserOCRAD} from "../../recogniser";
import {StorePDF, StorePDFS} from "../../database";
import {ReadPDF} from "../../recogniser/pdf";

const uuid = require("uuid");

// const getPDFs = () => {
//     const API = false ? "https://kabeersnetwork.tk/research-blog-api" : "https://api.github.com/repos/kabeer11000/docs-hosted/contents/law.research.kabeersnetwork.tk/blog"
//     export const base = (path) => `${API}${path ? "" + path : ""}?ref=redirector-content`
//     export const getDirectoryContent = async (path) => {
//         const response = await fetch(base(path))
//         return response.json();
//     }
//     export const getFilesFromDirectory = async (path) => {
//         let files = new Set();
//         const folder = await getDirectoryContent(path);
//         for (const item of folder) {
//             if (item.type === "dir") files = new Set([...files, ...await getFilesFromDirectory(`${path ?? ""}/${item.name}`)]);
//             if (item.name === "markdown.md") files.add(item);
//         }
//         return files;
//     }
// }
export default async function handler(req, res) {
    const pdfs = ["https://papers.gceguide.com/A%20Levels/Physics%20(9702)/2020/9702_w20_qp_12.pdf"];
    const collection = []; //2d array
    for (const pdf of pdfs) {
        console.log("Reading PDF: ", 1);
        collection.push(await Recogniser(pdf));
    }
    await StorePDFS(collection.map(pdf => ({
            pdf_id: uuid.v4(),
            pages: pdf.map(a => ({
                    ...a, id: uuid.v4()
                })
            )
        }
    )));
    res.status(200).json("Done"); // .map(({data: {text}}) => text)
}
