import { ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { RouterOutlet } from '@angular/router';
import { DisabledFormFieldJustAlterAppearanceDirective } from './disabled-form-field-just-alter-appearance.directive';
import {MatSlideToggleChange, MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatDividerModule} from '@angular/material/divider';
import { DisabledFormFieldFinalDirective } from './disabled-form-field-final.directive';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
            RouterOutlet,
            MatFormFieldModule,
            MatInputModule,
            MatSlideToggleModule,
            MatSelectModule,
            DisabledFormFieldJustAlterAppearanceDirective,
            DisabledFormFieldFinalDirective,
            MatDatepickerModule,
            MatNativeDateModule,
            MatDividerModule,
            ReactiveFormsModule,
            MatExpansionModule,
            MatButtonModule
          ],
  providers: [
  {
    provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
    useValue: {
      appearance: 'outline',
      subscriptSizing: 'dynamic',
      floatLabel: 'always'
      }
  }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  fb = inject(FormBuilder);
  formGroup = this.fb.group({
    input: [null],
    select: [null],
    datepicker: [null],
    textarea: [null]
  })
  title = 'DisabledFormField';
  options = [
    { label: 'N/A', value: null },
    { label: 'Option 1', value: 'Option 1' },
    { label: 'Option 2', value: 'Option 2' },
    { label: 'Option 3', value: 'Option 3' },
    { label: 'Option 4', value: 'Option 4' },
  ]

  accordion = viewChild.required(MatAccordion);

  enabledOrDisabled(event: MatSlideToggleChange): void {
    event.checked ? this.formGroup.disable() : this.formGroup.enable();
    this.updateFormControls();
  }

  requiredOrOptional(event: MatSlideToggleChange): void {
    if(event.checked) {
      this.formGroup.get('input')?.addValidators(Validators.required)
      this.formGroup.get('select')?.addValidators(Validators.required)
      this.formGroup.get('datepicker')?.addValidators(Validators.required)
      this.formGroup.get('textarea')?.addValidators(Validators.required)
    }
    else {
      this.formGroup.get('input')?.removeValidators(Validators.required)
      this.formGroup.get('select')?.removeValidators(Validators.required)
      this.formGroup.get('datepicker')?.removeValidators(Validators.required)
      this.formGroup.get('textarea')?.removeValidators(Validators.required)
    }
    this.updateFormControls();
  }

  updateFormControls(): void {
    this.formGroup.get('input')?.updateValueAndValidity();
    this.formGroup.get('select')?.updateValueAndValidity();
    this.formGroup.get('datepicker')?.updateValueAndValidity();
    this.formGroup.get('textarea')?.updateValueAndValidity();
  }
}
