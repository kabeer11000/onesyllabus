// import {images} from "next/dist/build/webpack/config/blocks/images";

const base = {
    full: "http://127.0.0.1:5000"
}
const OCR = {
    "#base": {
        full: "http://127.0.0.1:5000"
    },
    version: {
        name: "kn.mlkit.ocr.tesseract",
        release: "alpha-1.0.3"
    },
    RecognizePDF: async ({pdf, getImages} = {getImages: false}) => {
        if (!pdf) throw Error("PDF Not Found");
        console.log("@mlkit: ", "Requested");
        const response = await (await fetch(base.full + "/ocr?pdf=" + Buffer.from(pdf).toString('base64') + "&images=" + getImages)).json();
        console.log("@mlkit: ", "response received")
        return ({
            total: response.pagecount,
            thumbnail: response.thumbnail,
            pages: response.texts.map((text, index) => ({
                index,
                text: text,
                ...(response.images ? {image: images[index]} : {})
            }))
        })
    }
};
export default OCR;