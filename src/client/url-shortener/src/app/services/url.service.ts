import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ShortenedUrl } from '../models/shortened-url';
import { Constants } from '../config/constants';

export interface ShortenedUrlPostRequestBody {
    url: string;
}

@Injectable({
    providedIn: 'root'
})
export class UrlService {

    constructor(private http: HttpClient) { }

    createShortenedUrl(requestBody: ShortenedUrlPostRequestBody) {
        // TO DO: configure this URL based on environment
        const requestUrl = `${Constants.APP_DOMAIN}/shortened-url`;
        return this.http.post<ShortenedUrl>(requestUrl, requestBody);
    }
}
