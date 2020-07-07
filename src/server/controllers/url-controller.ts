import { UrlService } from "../services/url-service";
import { Response, Request } from "express";
import { AppError } from "../common/app-error";
import { UrlPostRequestBody } from "../common/request-bodies/url-post-request-body";


export class UrlController {
    constructor(private urlService: UrlService) {
    }

    getUrl(req: Request, res: Response) {
        const slug = req.params.slug;
        const url = this.urlService.getUrl(slug);

        if ( !url ) {
            throw new AppError(404, 'URL not found for slug.');
        } else {
            res.status(301);
            res.redirect(url);
            res.end();
        }
    }

    createShortenedUrl(req: Request, res: Response) {
        const requestBody: UrlPostRequestBody = req.body;

        const slug = this.urlService.saveShortenedUrl(requestBody);

        res.status(201);
        res.json({ slug: slug, url: requestBody.url });
        res.end();
    }
}