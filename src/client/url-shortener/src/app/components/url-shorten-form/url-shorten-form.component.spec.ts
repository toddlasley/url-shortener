import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlShortenFormComponent } from './url-shorten-form.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule, By } from '@angular/platform-browser';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { UrlService } from 'src/app/services/url.service';
import { UrlServiceStub } from 'src/app/services/stubs/url-service-stub';
import { Constants } from 'src/app/config/constants';

const MOCK_SHORTENED_URL_0 = {
    url: 'https://www.google.com/',
    slug: 'abcdefg'
};

const MOCK_SHORTENED_URL_1 = {
    url: 'https://www.yahoo.com/',
    slug: 'abc12fg'
};

describe('UrlShortenFormComponent', () => {
    let component: UrlShortenFormComponent;
    let fixture: ComponentFixture<UrlShortenFormComponent>;
    let page: TestPage;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UrlShortenFormComponent],
            imports: [
                BrowserModule,
                BrowserAnimationsModule,
                AppRoutingModule,
                FormsModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                MatInputModule,
                MatButtonModule,
                MatDialogModule,
                HttpClientModule
            ],
            providers: [
                { provide: FormBuilder, useClass: FormBuilder },
                { provide: UrlService, useValue: new UrlServiceStub(MOCK_SHORTENED_URL_0) }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UrlShortenFormComponent);
        component = fixture.componentInstance;
        page = new TestPage(fixture);
        fixture.detectChanges();
    });

    it('should create and disable/enable the shorten button appropriately based on input', () => {
        expect(component).toBeTruthy();
        expect(page.urlInput).toBeTruthy();
        expect(page.button).toBeTruthy();
        expect(page.button.nativeElement.disabled).toBeTrue();

        // providing a valid URL
        page.urlInput.nativeElement.value = MOCK_SHORTENED_URL_0.url;
        page.urlInput.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(page.button.nativeElement.disabled).toBeFalse();

        // providing an invalid URL
        page.urlInput.nativeElement.value = 'stuff';
        page.urlInput.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(page.button.nativeElement.disabled).toBeTrue();

        // back to a valid URL
        page.urlInput.nativeElement.value = MOCK_SHORTENED_URL_0.url;
        page.urlInput.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(page.button.nativeElement.disabled).toBeFalse();

        page.button.nativeElement.click();
        fixture.detectChanges();

        // new shortened URL should be displaying on page
        expect(component.shortenedUrls.length).toBe(1);
        let shortenedUrl0 = page.getUrlByIndex(0);
        expect(shortenedUrl0.nativeElement.textContent).toContain(MOCK_SHORTENED_URL_0.url);
        expect(shortenedUrl0.nativeElement.textContent).toContain(`${Constants.APP_DOMAIN}/${MOCK_SHORTENED_URL_0.slug}`);
        

        // trying another URL
        const urlService: UrlServiceStub = TestBed.get(UrlService);
        urlService.mockShortenedUrl = MOCK_SHORTENED_URL_1;

        page.urlInput.nativeElement.value = MOCK_SHORTENED_URL_1.url;
        page.urlInput.nativeElement.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        expect(page.button.nativeElement.disabled).toBeFalse();

        page.button.nativeElement.click();
        fixture.detectChanges();

        // new shortened URL should be at the top of the page
        expect(component.shortenedUrls.length).toBe(2);
        shortenedUrl0 = page.getUrlByIndex(0);
        expect(shortenedUrl0.nativeElement.textContent).toContain(MOCK_SHORTENED_URL_1.url);
        expect(shortenedUrl0.nativeElement.textContent).toContain(`${Constants.APP_DOMAIN}/${MOCK_SHORTENED_URL_1.slug}`);
        
        // original shortened URL should still be there
        const shortenedUrl1 = page.getUrlByIndex(1);
        expect(shortenedUrl1.nativeElement.textContent).toContain(MOCK_SHORTENED_URL_0.url);
        expect(shortenedUrl1.nativeElement.textContent).toContain(`${Constants.APP_DOMAIN}/${MOCK_SHORTENED_URL_0.slug}`);
    });
});

class TestPage {
    constructor(private fixture: ComponentFixture<UrlShortenFormComponent>) {}
    get urlInput() {
        return this.queryByCss('#usf-url-input');
    }

    get button() {
        return this.queryByCss('#usf-form-button');
    }

    getUrlByIndex(index: number) {
        return this.queryByCss(`#usf-shortened-url-row-${index}`);
    }

    queryByCss(selector: string) {
        return this.fixture.debugElement.query(By.css(selector));
    }
}
