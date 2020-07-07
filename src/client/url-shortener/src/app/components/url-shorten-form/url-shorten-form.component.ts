import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UrlService, ShortenedUrlPostRequestBody } from 'src/app/services/url.service';
import { ShortenedUrl } from 'src/app/models/shortened-url';
import { MatDialog } from '@angular/material/dialog';
import { SimpleErrorDialogComponent } from '../dialogs/simple-error-dialog/simple-error-dialog.component';
import { FieldErrorStateMatcher } from 'src/app/common/error-state-matcher';
import { Constants } from 'src/app/config/constants';

@Component({
    selector: 'app-url-shorten-form',
    templateUrl: './url-shorten-form.component.html',
    styleUrls: ['./url-shorten-form.component.scss']
})
export class UrlShortenFormComponent implements OnInit {
    // RegEx stolen from the below link. Questionable results IMO but rolling with it
    // https://regexr.com/39p0t
    private readonly URL_REG_EX = /(https?:\/\/)?([\w\-])+\.{1}([a-zA-Z]{2,63})([\/\w-]*)*\/?\??([^#\n\r]*)?#?([^\n\r]*)/;
    public readonly APP_DOMAIN = Constants.APP_DOMAIN;
    
    public form: FormGroup;
    public errorStateMatcher = new FieldErrorStateMatcher();
    public shortenedUrls: ShortenedUrl[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private urlService: UrlService,
        private matDialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            url: new FormControl(null, [ Validators.required, Validators.pattern(this.URL_REG_EX) ])
        });
    }

    formControlHasError(controlName: string) {
        const control = this.form.get(controlName);
        return control && control.invalid && ( control.dirty || control.touched );
    }

    createShortenedUrl() {
        if ( this.form.valid ) {
            const requestBody: ShortenedUrlPostRequestBody = {
                url: this.form.value.url
            }

            this.urlService.createShortenedUrl(requestBody).subscribe((shortenedUrl) => {
                this.shortenedUrls.unshift(shortenedUrl);
                this.form.reset();
            }, (error) => {
                this.matDialog.open(SimpleErrorDialogComponent);
            });
        }
    }
}
