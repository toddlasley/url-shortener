import { expect } from 'chai';
import { UrlService } from '../url-service';
import { UrlPostRequestBody } from '../../common/request-bodies/url-post-request-body';

const MOCK_URL_POST_REQUEST_BODY_0: UrlPostRequestBody = {
    url: 'https://www.google.com'
};

const MOCK_URL_POST_REQUEST_BODY_1: UrlPostRequestBody = {
    url: 'https://www.yahoo.com'
};

const MOCK_URL_POST_REQUEST_BODY_2: UrlPostRequestBody = {
    url: 'https://www.bing.com'
};

describe('UrlService', () => {
    let urlService: UrlService;

    beforeEach(() => {
        urlService = new UrlService();
    });

    describe('#getUrl()', () => {
        it('should throw an error if a slug is not provided', () => {
            const expectedError = 'Slug must be defined for URL lookup.';
            expect(() => { urlService.getUrl(null); }).to.throw(expectedError);
            expect(() => { urlService.getUrl(undefined); }).to.throw(expectedError);
            expect(() => { urlService.getUrl(''); }).to.throw(expectedError);
        });

        it('should return null if a url cannot be found for the given slug', () => {
            expect(urlService.getUrl('slug1')).to.be.null;
            expect(urlService.getUrl('slug2')).to.be.null;
            expect(urlService.getUrl('slug3')).to.be.null;
        });

        it('should return the correct URL for a given slug', () => {
            const slug0 = urlService.saveShortenedUrl(MOCK_URL_POST_REQUEST_BODY_0);
            const slug1 = urlService.saveShortenedUrl(MOCK_URL_POST_REQUEST_BODY_1);
            const slug2 = urlService.saveShortenedUrl(MOCK_URL_POST_REQUEST_BODY_2);

            expect(urlService.getUrl(slug0)).to.equal(MOCK_URL_POST_REQUEST_BODY_0.url);
            expect(urlService.getUrl(slug1)).to.equal(MOCK_URL_POST_REQUEST_BODY_1.url);
            expect(urlService.getUrl(slug2)).to.equal(MOCK_URL_POST_REQUEST_BODY_2.url);
        });
    });

    describe('#saveShortenedUrl()', () => {
        it('should throw an error if a URL is not provided', () => {
            const expectedError = 'No URL to be shortened.';
            expect(() => { urlService.saveShortenedUrl(null); }).to.throw(expectedError);
            expect(() => { urlService.saveShortenedUrl(undefined); }).to.throw(expectedError);
            expect(() => { urlService.saveShortenedUrl({ url: '' }); }).to.throw(expectedError);
        });

        it('should return a slug when provided with a valid URL', () => {
            const slug0 = urlService.saveShortenedUrl(MOCK_URL_POST_REQUEST_BODY_0);
            const slug1 = urlService.saveShortenedUrl(MOCK_URL_POST_REQUEST_BODY_1);
            const slug2 = urlService.saveShortenedUrl(MOCK_URL_POST_REQUEST_BODY_2);

            expect(slug0).to.not.be.undefined;
            expect(slug0).to.not.be.null;
            expect(slug1).to.not.be.undefined;
            expect(slug1).to.not.be.null;
            expect(slug2).to.not.be.undefined;
            expect(slug2).to.not.be.null;
        });
    });
});