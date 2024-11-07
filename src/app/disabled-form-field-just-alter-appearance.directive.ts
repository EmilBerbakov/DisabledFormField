import { AfterViewInit, booleanAttribute, ChangeDetectorRef, contentChild, DestroyRef, Directive, effect, inject, input, signal, untracked, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormField, MatFormFieldAppearance, MatFormFieldControl } from '@angular/material/form-field';
import { map, startWith } from 'rxjs/operators';

@Directive({
  selector: '[disabledAppearance]',
  standalone: true,
})
export class DisabledFormFieldJustAlterAppearanceDirective implements AfterViewInit {
  //In the real implementation, this input wouldn't exist and would just be something that happens in the effect
  autoFloat = input(false, { transform: booleanAttribute });
  //In the real implementation, if this went through, this would have a default value
  disabledHintText = input('');
  private matFormField = inject(MatFormField, { self: true });
  cdr = inject(ChangeDetectorRef);
  destroyRef = inject(DestroyRef);
  formFieldInput = contentChild(MatFormFieldControl);
  appearance: WritableSignal<MatFormFieldAppearance> = signal('fill');
  originalHintText = this.matFormField.hintLabel;

  constructor() {
    effect(() => {
      if (this.matFormField) {
        const appearance = this.appearance();
        const autoFloat = untracked(this.autoFloat);
        const disabledHintText = untracked(this.disabledHintText);
        this.matFormField.appearance = appearance;
        this.matFormField.hideRequiredMarker = appearance === 'fill'
        // In the real implementation, this would not be hidden behind an if flag
        if (autoFloat) {
          this.matFormField.floatLabel = appearance === 'fill' ? 'auto': 'always'
        }
                // In the real implementation, this would not be hidden behind an if flag
        if (disabledHintText) {
          this.matFormField.hintLabel = appearance === 'fill' ? disabledHintText : this.originalHintText;
        }
        this.cdr.detectChanges();
      }
    })
  }

  ngAfterViewInit(): void {
    this.formFieldInput()!.stateChanges.pipe(startWith('This value does not matter as long as it is not null!'), map(() => this.formFieldInput()!.disabled ? 'fill' : 'outline'), takeUntilDestroyed(this.destroyRef))
    .subscribe(appearance => {
      this.appearance.set(appearance);
      this.cdr.detectChanges();
    })
  }
}
