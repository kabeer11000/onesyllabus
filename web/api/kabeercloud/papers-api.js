const base = "https://docs.kabeercloud.tk/projects/papers/api";
export const PapersAPI = {
    base,
    getCategories: `${base}/get-categories.php`,
    getTopics: slug => `${base}/get-topics.php?slug=${slug}`,
    getYears: slug => `${base}/get-years.php?slug=${slug}`,
    getContents: slug => `${base}/get-content.php?slug=${slug}`,
}