import {
  Directive,
  ElementRef,
  Inject,
  InjectionToken,
  Optional,
  Renderer2,
  forwardRef
} from "@angular/core";
import { ɵgetDOM as getDOM } from "@angular/platform-browser";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";

export const POLYMER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => PolymerValueAccessor),
  multi: true
};

@Directive({
  selector: "[polymerControl]",
  host: {
    "(change)": "$any(this)._handleInput($event.target.value)",
    "(blur)": "onTouched()"
  },
  providers: [POLYMER_VALUE_ACCESSOR]
})
export class PolymerValueAccessor implements ControlValueAccessor {
  onChange = (_: any) => {};
  onTouched = () => {};

  constructor(private _renderer: Renderer2, private _elementRef: ElementRef) {}

  writeValue(value: any): void {
    const normalizedValue = value == null ? "" : value;
    this._renderer.setProperty(
      this._elementRef.nativeElement,
      "value",
      normalizedValue
    );
  }

  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._renderer.setProperty(
      this._elementRef.nativeElement,
      "disabled",
      isDisabled
    );
  }

  _handleInput(value: any): void {
    this.onChange(value);
  }
}
