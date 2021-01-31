import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';
import {Attribute, Directive, forwardRef} from '@angular/core';

@Directive({
  selector: '[appCheckRetypedPassword]',
  providers: [
    {
      provide: NG_VALIDATORS, useExisting: forwardRef(() => IsRetypedPasswordEqualDirective),
      multi: true
    }
  ]
})
export class IsRetypedPasswordEqualDirective implements Validator {
  constructor(@Attribute('appCheckRetypedPassword') private  passwordField: string) {
  }

  validate(control: AbstractControl): ValidationErrors | null {

    if (control.value !== control.root.get(this.passwordField)?.value) {
      return {
        isRetypedPasswordEqual: false
      };
    }

    return null;
  }
}
