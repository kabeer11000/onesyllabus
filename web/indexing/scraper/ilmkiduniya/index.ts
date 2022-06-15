import FetchWrapper from "../utils/fetchWrapper";
import {Routes, Types} from "./types";
import {IAppearance, ICat, IContent, IGroup, IProviderArtifact, ITopic, IYear} from "../utils/types";
import Image2PDF from "../../../api/kabeercloud/image-2-pdf";

export default class Ilmkiduniya {
    constructor(...args) {
    }
    base = {
        "protocol": "https://",
        "host": "www.ilmkidunya.com/API",
        "_host": "mirror-api-ilmkidunya-1.kabeercloud.tk",
        full: `${"https://mirror-api-ilmkidunya-1.kabeercloud.tk"}/API/PastPaper/PastPaperFunction.asmx/`
    }
    idString: IProviderArtifact = "__kn.papers.crawlers.ilmkiduniya";
    ProviderArtifact: IProviderArtifact = this.idString

    async GetGroups(): Promise<Array<IGroup>> {
        const {d: res} = await FetchWrapper(`${this.base.full}${Routes[Types.getGroups]}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                InstituteID: '0',
                LoginID: 'IlmkidunyaPP',
                Password: 'PP&*{#!#}'
            })
        }).then(response => response.json());
        return res.map(item => <IGroup>({
            name: item["Name"],
            '@inferred': {
                'id': item['id'],
                "live": item['UrlLive']
            },
            "@upstream": {
                "provider": this.idString,
                "@upstream.attach": {
                    "route": Types.getCats,
                    "@body": {"QualificationID": item["ID"]}
                }
            }
        }));
    }

    async GetAppearances(upstreamParams): Promise<Array<IAppearance>> {
        const {d: res} = await FetchWrapper(`${this.base.full}${Routes[Types.getAppearances]}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...upstreamParams["@body"],
                LoginID: 'IlmkidunyaPP',
                Password: 'PP&*{#!#}'
            })
        }).then(response => response.json());//.then(res => res.filter(x => !!x));
        if (!res) return [];
        return res.map(item => <IAppearance>({
            'name': item["Name"],
            '@inferred': {
                'id': item['id'],
                "live": item['UrlLive']
            },
            "@upstream": {
                "provider": this.idString,
                "@upstream.attach": {
                    "route": Types.getTopics,
                    "@body": {
                        "QualificationID": upstreamParams["@body"]["QualificationID"],
                        "InstituteID": upstreamParams["@body"]["InstituteID"],
                        "ClassID": item["ID"]
                    }
                }
            }
        }));
    }

    async GetCats(upstreamParams): Promise<Array<ICat>> {
        const {d: res} = await FetchWrapper(`${this.base.full}${Routes[Types.getCats]}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...upstreamParams["@body"],
                LoginID: 'IlmkidunyaPP',
                Password: 'PP&*{#!#}'
            })
        }).then(response => response.json());

        const response: Array<ICat> = []
        for (const item of res) response.push({
            'name': item["Name"],
            'description': item["Detail"],
            '@inferred': {
                'id': item['id'],
                "live": item['UrlLive']
            },
            "@upstream": {
                provider: this.idString,
            },
            "appearances": (await this.GetAppearances({
                "route": Routes[Types.getAppearances],
                "@body": {"QualificationID": upstreamParams["@body"]["QualificationID"], "InstituteID": item["ID"]}
            })).filter(x => !!x)
        });
        return response;
    }

    async GetContent(upstreamParams): Promise<Array<IContent>> {
        const {d: res} = await FetchWrapper(`${this.base.full}${Routes[Types.getContent]}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...upstreamParams["@body"],
                LoginID: 'IlmkidunyaPP',
                Password: 'PP&*{#!#}'
            })
        }).then(response => response.json());
        const response:IContent[] = [];
        for (const item of res) {
            response.push({
                "@meta": {
                    "inferred": {
                        "tags": [...item["Name"].split(" ")],
                        "resource": {
                            "document-type": item["Name"].split(" ").slice(-2)[0].toUpperCase() || "QUESTION_PAPER",
                            "variant": "1",
                            "session": "ANNUAL",
                        }
                    }
                },
                "file": {
                    "location": (await Image2PDF(item["Name"] + " - Kabeer's Past Papers", item["ImageName"])).location, // Upload Image to PDF
                    "name": item["Name"],
                }
            })
        }
        return response;
    }

    async GetYears(upstreamParams): Promise<Array<IYear>> {
        const {d: res} = await FetchWrapper(`${this.base.full}${Routes[Types.getYears]}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...upstreamParams["@body"],
                LoginID: 'IlmkidunyaPP',
                Password: 'PP&*{#!#}'
            })
        }).then(response => response.json());
        return res.map(item => <IYear>({
            'name': item["Name"],
            '@inferred': {
                'id': item['id'],
                'integer': parseInt(item['Name']),
                "live": item['UrlLive']
            },
            "@upstream": {
                "provider": this.idString,
                "@upstream.attach": {
                    "route": Types.getContent,
                    "@body": {
                        "SubjectID": upstreamParams["@body"]["SubjectID"],
                        "QualificationID": upstreamParams["@body"]["QualificationID"],
                        "InstituteID": upstreamParams["@body"]["InstituteID"],
                        "ClassID": upstreamParams["@body"]["ClassID"],
                        Year: item["ID"] + ""
                    }
                }
            }
        }));
    }

    async GetTopics(upstreamParams): Promise<Array<ITopic>> {
        const {d: res} = await FetchWrapper(`${this.base.full}${Routes[Types.getTopics]}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...upstreamParams["@body"],
                LoginID: 'IlmkidunyaPP',
                Password: 'PP&*{#!#}'
            })
        }).then(response => response.json());
        return res.map(item => <ITopic>({
            'name': item["Name"],
            '@inferred': {
                'id': item['id'],
                'code': undefined,
                'name_full': item["Name"],
                "live": item['UrlLive']
            },
            "@upstream": {
                "provider": this.idString,
                "@upstream.attach": {
                    "route": Types.getYears,
                    "@body": {
                        SubjectID: item["ID"],
                        "QualificationID": upstreamParams["@body"]["QualificationID"],
                        "InstituteID": upstreamParams["@body"]["InstituteID"],
                        "ClassID": upstreamParams["@body"]["ClassID"]
                    }
                }
            }
        }));
    }
}