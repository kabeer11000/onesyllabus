import {Routes, Types} from "./types";
import FetchWrapper from "../utils/fetchWrapper";
import {ICat, IContent, IGroup, IProviderArtifact, ITopic, IYear} from "../utils/types";

export default class Gceguide {
    constructor(...args) {
    }

    base = {
        "protocol": "https://",
        "host": "www.ilmkidunya.com/API",
        full: "https://docs.kabeercloud.tk/projects/papers/api"
    }
    idString: IProviderArtifact = "__kn.papers.crawlers.gceguide";
    ProviderArtifact: IProviderArtifact = this.idString

    async GetGroups(): Promise<Array<IGroup>> {
        // TODO Static method cause we wrap all of gceguides cats in one group
        return [{
            'name': "Cambridge International",
            '@inferred': {},
            "@upstream": {
                "provider": this.idString,
                "@attach": {
                    "route": Types.getCats,
                    "@query": {}, // Don't Pass Any Param to GetCats
                }
            }
        }];
    }

    async GetCats(): Promise<Array<ICat>> {
        const res = await FetchWrapper(`${this.base.full}/${Routes["__kn.crawlers.gceguide.getCats"]}`).then(response => response.json()); // TODO no slug required
        const response = [];
        for (const item of res) response.push({
            'name': item["name"],
            'description': item["description"],
            '@inferred': {
                "live": item['UrlLive']
            },
            "@upstream": {
                "provider": this.idString,
                "@attach": {
                    "route": Types.getCats,
                    "@query": {
                        slug: item['slug']
                    },
                }
            },
            "appearances": null
        });
        return response;
    }

    async GetContent(upstreamParams): Promise<Array<IContent>> {
        const res = await FetchWrapper(`${this.base.full}/${Routes["__kn.crawlers.gceguide.getContent"]}?slug=${upstreamParams["@query"].slug}`).then(response => response.json());
        return res.map(item => <IContent>({
            "@meta": {
                "inferred": {
                    "tags": item["@file"].tags,
                    "resource": {
                        "document-type": item["@meta"]["inferred"].type,
                        "variant": item["@meta"]["inferred"]["variant_number"],
                        "session": item["@meta"]["inferred"]["session"],
                    }
                }
            },
            "file": {
                "location": item["@file"]["location"],
                "name": item["@file"]["name"],
            }
        }));
    }

    async GetYears(upstreamParams): Promise<Array<IYear>> {
        const res = await FetchWrapper(`${this.base.full}/${Routes["__kn.crawlers.gceguide.getYears"]}?slug=${upstreamParams["@query"].slug}`).then(response => response.json()).then(response => response.filter(year => year.type === "YEAR"));
        return res.map(item => <IYear>({
            'name': item["name"],
            '@inferred': {
                integer: item["integer"]
            },
            "@upstream": {
                "provider": this.idString,
                "@attach": {
                    "route": Types.getContent,
                    "@query": {
                        slug: item['slug']
                    },
                },
            },
        }));
    }

    async GetTopics(upstreamParams): Promise<Array<ITopic>> {
        const res = await FetchWrapper(`${this.base.full}/${Routes["__kn.crawlers.gceguide.getTopics"]}?slug=${upstreamParams["@query"].slug}`).then(response => response.json());
        return res.map(item => <ITopic>({
            'name': item["@meta"]["name"] || item["name"],
            '@inferred': {
                "code": item["@meta"]["code"],
                "name_full": item["@meta"]["name_full"],
            },
            "@upstream": {
                "provider": this.idString,
                "@attach": {
                    "route": Types.getYears,
                    "@query": {
                        slug: item['slug']
                    },
                }
            }
        }));

    }
}