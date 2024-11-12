import { AfterContentInit, AfterViewInit, ChangeDetectorRef, contentChild, DestroyRef, Directive, effect, ElementRef, inject, input, signal, untracked, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormField, MatFormFieldAppearance, MatFormFieldControl } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { distinctUntilChanged, map, startWith } from 'rxjs';

@Directive({
  selector: '[disabledFormFieldFinal]',
  standalone: true,
})
export class DisabledFormFieldFinalDirective implements AfterContentInit {

  disabledPlaceholder = input('——');
  private matFormField = inject(MatFormField, { self: true });
  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  formFieldInput = contentChild(MatFormFieldControl);
  selectChild = contentChild(MatSelect);
  inputChild = contentChild(MatInput);

  originalPlaceholder = this.inputChild()?.placeholder ?? this.selectChild()?.placeholder ?? '';

  appearance: WritableSignal<MatFormFieldAppearance> = signal('fill');

  constructor() {
    effect(() => {
      if (this.matFormField) {
        const formInput = untracked(this.inputChild) as MatInput ?? untracked(this.selectChild) as MatSelect
        console.log(formInput.value)
        const appearance = this.appearance();
        this.matFormField.appearance = appearance;
        this.matFormField.hideRequiredMarker = appearance === 'fill';
        formInput.placeholder = appearance === 'fill' ? untracked(this.disabledPlaceholder) : this.originalPlaceholder;
        if (untracked(this.selectChild)) {
          untracked(this.selectChild)?.close()
        }
      }
      this.cdr.markForCheck()
    }
  )

  }

  ngAfterContentInit(): void {
    if (this.formFieldInput()) {
      this.originalPlaceholder = this.inputChild()?.placeholder ?? this.selectChild()?.placeholder ?? '';
      this.formFieldInput()?.stateChanges
      .pipe(
        startWith('secret'),
        map(() => this.formFieldInput()?.disabled ? 'fill' : 'outline'),
        takeUntilDestroyed(this.destroyRef),
        distinctUntilChanged()
      ).subscribe((appearance: MatFormFieldAppearance) => {
        this.appearance.set(appearance);
      })
    }
  }


}
