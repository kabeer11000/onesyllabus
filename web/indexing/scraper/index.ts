import {IGroup} from "./utils/types";

export interface IScraper {
    GetGroups: Promise<Array<IGroup>>,
    GetCats: Promise<Array<IGroup>>,
    GetAppearances: Promise<Array<IGroup>>,
    GetTopics: Promise<Array<IGroup>>,
    GetYears: Promise<Array<IGroup>>,
    GetContent: Promise<Array<IGroup>>,
}
export abstract class Scraper {
    protected constructor() {}
    async GetGroups ():Promise<any> {}
    async GetCats ():Promise<any> {}
    async GetAppearances ():Promise<any> {}
    async GetTopics ():Promise<any> {}
    async GetYears ():Promise<any> {}
    async GetContent ():Promise<any> {}
}