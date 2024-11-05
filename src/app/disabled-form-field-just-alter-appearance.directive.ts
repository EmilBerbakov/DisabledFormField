import { AfterViewInit, booleanAttribute, ChangeDetectorRef, contentChild, DestroyRef, Directive, effect, inject, input, signal, untracked, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormField, MatFormFieldAppearance, MatFormFieldControl } from '@angular/material/form-field';
import { map, startWith } from 'rxjs/operators';

@Directive({
  selector: '[disabledAppearance]',
  standalone: true,
})
export class DisabledFormFieldJustAlterAppearanceDirective implements AfterViewInit {

  //disabledAppearance = input(false, { transform: booleanAttribute });
  autoFloat = input(false, { transform: booleanAttribute })
  placeHolderText = input('');
  private matFormField = inject(MatFormField, { self: true });
  cdr = inject(ChangeDetectorRef);
  destroyRef = inject(DestroyRef);
  formFieldInput = contentChild(MatFormFieldControl);
  appearance: WritableSignal<MatFormFieldAppearance> = signal('fill');
  originalPlaceholder = '';

  constructor() {
    effect(() => {
      if (this.matFormField) {
        this.matFormField.appearance = this.appearance();
        this.matFormField.hideRequiredMarker = this.appearance() === 'fill'
        const autoFloat = untracked(this.autoFloat);
        const placeHolderText = untracked(this.placeHolderText);
        if (autoFloat) {
          this.matFormField.floatLabel = this.appearance() === 'fill' ? 'auto': 'always'
        }
        //Not Quite Working yet
        if (placeHolderText) {
          this.appearance() === 'fill' ?
          this.formFieldInput()?.placeholder?.replace(this.formFieldInput()?.placeholder ?? '', placeHolderText):
          this.formFieldInput()?.placeholder?.replace(this.formFieldInput()?.placeholder ?? '', this.originalPlaceholder)
        }
        this.cdr.detectChanges();
      }
    })
  }

  ngAfterViewInit(): void {

    this.formFieldInput()!.stateChanges.pipe(startWith('This value does not matter as long as it is not null!'), map(() => this.formFieldInput()!.disabled ? 'fill' : 'outline'), takeUntilDestroyed(this.destroyRef))
    .subscribe(appearance => {
      this.appearance.set(appearance);
      this.originalPlaceholder = this.formFieldInput()?.placeholder ?? ''
      this.cdr.detectChanges();
      console.log(this.originalPlaceholder)
    })
  }
}
