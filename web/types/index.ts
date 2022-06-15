// @ts-ignore
import {v4} from "@types/uuid";
import {IProviderArtifact, IUpstream} from "../indexing/scraper/utils/types";

export interface IGroup {
    "id": v4,
    "slug": string,
    "@api": {
        "provider": IProviderArtifact,
        "@upstream": IUpstream
    },
    "name": string
}

export interface ICategory {
    "name": string,
    "id": v4 | string,
    group: v4 | string,
    "slug": string,
    "@api": {
        "provider": IProviderArtifact,
        "@upstream": IUpstream
    },
    "appearances": {
        "single_appearance": boolean,
        "all": Array<IAppearance> | null
    }
}

export interface ITopic {
    "name": string,
    "description"?: string | undefined | null,
    "id": v4 | string,
    "@inferred": {
        "code"?: string,
        "timestamp": number,
    },
    "@api": {
        "provider": IProviderArtifact,
        "@upstream": IUpstream
    },
    "cat": v4 | string,
    "group": v4 | string,
    "appearance"?: v4 | string
    "slug": string
}

export interface IAppearance {
    name: string,
    id: v4 | string,
    group: v4 | string,
    cat: v4 | string,
    slug: string,
    "@inferred": object,
    "@api": {
        "provider": IProviderArtifact,
        "@upstream": IUpstream
    }
}

export interface ICategorySession {
    cat: v4 | string,
    id: v4 | string,
    appearance?: v4 | string,
    alias: string[]
}

export interface IDocumentType {
    cat: v4 | string,
    id: v4 | string,
    appearance?: v4 | string,
    alias: string[]
}

export interface IYear {
    name: string,
    id: v4 | string,
    topic: v4 | string,
    cat: v4 | string,
    group: v4 | string,
    appearance?: v4 | string,
    "@inferred": {
        integer: number,
        [x: string | number | symbol]: unknown;
    },
    "@upstream": IUpstream
}

export interface IPage {
    text: string,
    recognition: {
        indices: Array<[number, number]>,
    },
    id: v4 | string,
    topic: v4 | string,
    cat: v4 | string,
    group: v4 | string,
    appearance?: v4 | string,
    "@meta": {
        "ocr"?: string,
        "timestamp"?: number
    },
    "image"?: {
        hosted?: string,
        base85?: string
    },
    "pdf": v4 | string,
    "index": number
}

export interface IContent {
    id: v4 | string,
    tags: Array<string>,
    group: v4 | string,
    cat: v4 | string,
    appearance?: v4 | string,
    topic: v4 | string,
    year: v4 | string,
    resource: {
        "document-type": v4 | string, // Examiner Report, Marking Scheme, Question Paper
        "paper_number"?: number | string, // Paper Number
        "variant"?: number | string, // Variant Number
        "session": v4 | string,
    },
    "@inferred": object,
    "@meta": {
        "page-count": number,
        "timestamp": number,
        [x: string]: any
    },
    file: {
        "location": string,
        "name": string,
    }
}
