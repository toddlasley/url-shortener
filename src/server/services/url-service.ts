import { UrlPostRequestBody } from "../common/request-bodies/url-post-request-body";
import { AppError } from "../common/app-error";
const shortId = require('shortid');

export class UrlService {
    private urlMap: Map<string, string> = null;
    
    constructor() {
        this.urlMap = new Map();
    }

    getUrl(slug: string) {
        if ( !slug ) {
            throw new AppError(500, 'Slug must be defined for URL lookup.');
        }

        return this.urlMap.has(slug)
            ? this.urlMap.get(slug)
            : null;
    }

    saveShortenedUrl(requestBody: UrlPostRequestBody) {
        if ( !requestBody || !requestBody.url ) {
            throw new AppError(500, 'No URL to be shortened.');
        }

        const slug = shortId.generate();
        this.urlMap.set(slug, requestBody.url);

        return slug;
    }
}