export default async function Image2PDF (title, src) {
    const uncachedEndpoint = "http://docs-kabeersnetwork-kview-app-sta.rf.gd/tests/papers/utils";
    const cachedEndpoint = "https://docs.kabeercloud.tk/tests/papers/utils";
    const ThirdEndpoint = "https://kabeers-papers-pdf2image.000webhostapp.com";
    console.log("KabeerCloud@Image2PDF Utility::Created: ", `${ThirdEndpoint}/image-top-pdf.php?i=${src}&title=${title}`)
    return await (await fetch(`${ThirdEndpoint}/image-top-pdf.php?i=${src}&title=${title}`)).json()
}