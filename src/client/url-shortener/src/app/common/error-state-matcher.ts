import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl } from '@angular/forms';

export class FieldErrorStateMatcher implements ErrorStateMatcher {
    isErrorState(formControl: FormControl) {
        return formControl && formControl.invalid && ( formControl.touched || formControl.dirty );
    }
}