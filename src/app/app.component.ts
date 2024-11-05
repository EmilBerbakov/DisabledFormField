import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule } from '@angular/material/form-field';
import { RouterOutlet } from '@angular/router';
import { DisabledFormFieldJustAlterAppearanceDirective } from './disabled-form-field-just-alter-appearance.directive';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
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
            MatDatepickerModule,
            MatNativeDateModule
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
  title = 'DisabledFormField';
  options = [
    { label: 'Option 1', value: 'Option 1' },
    { label: 'Option 2', value: 'Option 2' },
    { label: 'Option 3', value: 'Option 3' },
    { label: 'Option 4', value: 'Option 4' },
  ]
}
