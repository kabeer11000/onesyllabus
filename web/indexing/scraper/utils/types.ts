export interface IUpstreamAttachment {
    "route": string,
    "@body"?: object,
    "@query"?: object,
    "@headers"?: object
        [x: string | number | symbol]: unknown;
}
export interface IUpstream {
        "provider": string,
        "@attach"?: IUpstreamAttachment
}
export interface IGroup {
    'name': string,
    '@inferred': object,
    "@upstream": IUpstream
}
export interface IAppearance {
    'name': string,
    '@inferred': object,
    "@upstream": IUpstream
}
export interface ICat {
    'name': string,
    'description'?: string,
    '@inferred': object,
    "@upstream": IUpstream,
    "appearances": Array<IAppearance> | null
}
export interface IContent {
    "@meta": {
        "inferred": {
            "tags": Array<string>,
            "resource": {
                "document-type": string,
                "variant": string | null,
                "session": string,
            }
        }
    },
    "file": {
        "location": string
        "name": string,
    }
}
export interface ITopic {
    description?: string | undefined | null;
    'name': string,
    '@inferred': {
        "code": string | undefined,
        "name_full": string,
    },
    "@upstream": IUpstream
}
export interface IYear {
    'name': string,
    '@inferred': {
        'integer': number,
        [x: string | number | symbol]: unknown;
    },
    "@upstream": IUpstream
}
export type IProviderArtifact = string