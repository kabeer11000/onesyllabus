import {FormData} from "formdata-node";
import { Blob } from "buffer";

export default class KabeerCloudInstance {
    constructor() {}
    UploadFile = async (file, id, ext) =>{
        const formdata = new FormData()
        formdata.append("image", new Blob([file]), id + "." + ext)
        await fetch("https://docs.kabeercloud.tk/c/", {
            mode: "post",
            body: formdata,
            headers: {
                "x-client-name": "KabeersPastPapersOCR"
            }
        })
    }
}