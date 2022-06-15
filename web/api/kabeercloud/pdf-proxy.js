export const PdfProxy = {
    proxy: (base) => `https://docs.kabeercloud.tk/papers/proxy.php?url=${base}`,
    viewer: (file, page = 0, zoom = "auto,-206,842") => `https://docs.kabeercloud.tk/papers/pdf/web/viewer.html?file=${encodeURIComponent(file)}#page=${page ?? 0}&zoom=${zoom}`
}