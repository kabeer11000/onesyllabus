import Ilmkiduniya from "./ilmkiduniya";
import Gceguide from "./gceguide";

class Scraper {
    constructor({scrapers}) {
        this.scrapers = scrapers;
        this.singleAppearanceScrapers = [Gceguide];
        this.providers = {
            "__kn.papers.crawlers.ilmkiduniya": Ilmkiduniya,
            "__kn.papers.crawlers.gceguide": Gceguide
        }
    }
    async GetGroups() {
        const groups = [];
        for (const scraper of this.scrapers) groups.push(await scraper.GetGroups());
        return groups
    }
    async GetCats({provider, upstreamParams}) {
        // UpstreamParams are @upstream > @upstream.attach
        return await this.providers[provider].GetCats(upstreamParams);
    }
    async GetAppearances({provider, upstreamParams}) {
        // UpstreamParams are @upstream > @upstream.attach
        // const cats = [];
        // for (const scraper of this.scrapers.filter(scraper => !this.singleAppearanceScrapers(scraper.constructor))) cats.push(await scraper.GetAppearances(upstreamParams));
        // return cats;
        return await this.providers[provider].GetAppearances(upstreamParams);
    }
    async GetTopics({provider, upstreamParams}) {
        // UpstreamParams are @upstream > @upstream.attach
        // const cats = [];
        // for (const scraper of this.scrapers) cats.push(await scraper.GetTopics(upstreamParams));
        // return cats;
        return await this.providers[provider].GetAppearances(upstreamParams);
    }
    async GetYears({provider, upstreamParams}) {
        // UpstreamParams are @upstream > @upstream.attach
        const cats = [];
        for (const scraper of this.scrapers) cats.push(await scraper.GetYears(upstreamParams));
        return cats;
    }
    async GetContents({provider, upstreamParams}) {
        // UpstreamParams are @upstream > @upstream.attach
        const cats = [];
        for (const scraper of this.scrapers) cats.push(await scraper.GetContents(upstreamParams));
        return cats;
    }
}