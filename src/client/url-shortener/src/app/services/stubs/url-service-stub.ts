import { of } from 'rxjs';
import { ShortenedUrl } from 'src/app/models/shortened-url';

export class UrlServiceStub {
    public mockShortenedUrl: ShortenedUrl;

    constructor(mockShortenedUrl: ShortenedUrl) {
        this.mockShortenedUrl = mockShortenedUrl;
    }

    createShortenedUrl() {
        return of(this.mockShortenedUrl);
    }
}
