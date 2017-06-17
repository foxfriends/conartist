import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AsyncValidatorFn, ValidationErrors } from '@angular/forms';

import { Wait, wait } from '../../util';

import APIService from '../api/api.service';
import template from './sign-in.component.html';
import styles from './sign-in.component.scss';

@Component({
  selector: 'con-sign-in',
  template: template,
  styles: [ styles ],
})
export default class SignInComponent {
  isSignUpMode = false;
  processing = false;
  error: string | null = null;
  notification: string | null = null;

  signInForm: FormGroup;
  signUpForm: FormGroup;

  constructor(@Inject(APIService) private api: APIService) {
    this.signInForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });

    this.signUpForm = new FormGroup({
      email: new FormControl('', Validators.required, this.mustBeNewEmail()),
      password: new FormControl('', Validators.required),
      confirmEmail: new FormControl('', [this.requiredForSignUp(), this.mustEqual('email')]),
      confirmPassword: new FormControl('', [this.requiredForSignUp(), this.mustEqual('password')]),
      termsAccepted: new FormControl(false, this.mustBeChecked()),
    });

    // one way form sync
    this.signInForm.get('email')!.valueChanges.forEach((email: string) => {
      this.signUpForm.patchValue({ email })
    });
    this.signInForm.get('password')!.valueChanges.forEach((password: string) => {
      this.signUpForm.patchValue({ password })
    });
  }

  toggleSignUp() {
    this.isSignUpMode = !this.isSignUpMode;
    this.error = null;
  }

  requiredForSignUp(): ValidatorFn {
    return (c: FormControl) => {
      if(this.isSignUpMode) {
        return Validators.required(c);
      }
      return null;
    };
  }

  mustBeNewEmail(): AsyncValidatorFn {
    let batch: Wait<ValidationErrors | null>;
    return (c: FormControl) => {
      if(batch) {
        batch.reset();
        return batch;
      }
      return batch = wait<ValidationErrors | null>(500, async resolve => {
        if(await this.api.isUniqueEmail(c.value)) {
          resolve(null)
        } else {
          resolve({ valid: false });
        }
      });
    };
  }

  mustEqual(field: string): ValidatorFn {
    return (c: FormControl) => {
      if(this.signUpForm && c.value !== this.signUpForm.value[field]) {
        return { valid: false };
      }
      return null;
    };
  }

  mustBeChecked(): ValidatorFn {
    return (c: FormControl) => {
      if(this.isSignUpMode && !c.value) {
        return { valid: false };
      }
      return null;
    }
  }

  async processSignUp() {
    this.processing = true;
    this.error = null;
    try {
      await this.api.signUp(this.signUpForm.value.email, this.signUpForm.value.password);
      this.isSignUpMode = false;
      this.notification = 'Account created! You can sign in now';
    } catch(error) {
      this.error = error.message;
    } finally {
      this.processing = false;
    }
  }

  async processSignIn() {
    this.processing = true;
    this.error = null;
    try {
      const token = await this.api.signIn(this.signInForm.value.email, this.signInForm.value.password);
      localStorage.setItem('authtoken', token);
    } catch(error) {
      this.error = error.message;
    } finally {
      this.processing = false;
    }
  }
}
