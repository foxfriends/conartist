"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const forms_1 = require("@angular/forms");
const util_1 = require("../../util");
const api_service_1 = require("../api/api.service");
const sign_in_component_html_1 = require("./sign-in.component.html");
const sign_in_component_scss_1 = require("./sign-in.component.scss");
let SignInComponent = class SignInComponent {
    constructor(api) {
        this.api = api;
        this.isSignUpMode = false;
        this.processing = false;
        this.error = null;
        this.notification = null;
        this.onSignIn = new core_1.EventEmitter();
        this.signInForm = new forms_1.FormGroup({
            email: new forms_1.FormControl('', forms_1.Validators.required),
            password: new forms_1.FormControl('', forms_1.Validators.required),
        });
        this.signUpForm = new forms_1.FormGroup({
            email: new forms_1.FormControl('', forms_1.Validators.required, this.mustBeNewEmail()),
            password: new forms_1.FormControl('', forms_1.Validators.required),
            confirmEmail: new forms_1.FormControl('', [this.requiredForSignUp(), this.mustEqual('email')]),
            confirmPassword: new forms_1.FormControl('', [this.requiredForSignUp(), this.mustEqual('password')]),
            termsAccepted: new forms_1.FormControl(false, this.mustBeChecked()),
        });
        this.signInForm.get('email').valueChanges.forEach((email) => {
            this.signUpForm.patchValue({ email });
        });
        this.signInForm.get('password').valueChanges.forEach((password) => {
            this.signUpForm.patchValue({ password });
        });
    }
    toggleSignUp() {
        this.isSignUpMode = !this.isSignUpMode;
        this.error = null;
    }
    requiredForSignUp() {
        return (c) => {
            if (this.isSignUpMode) {
                return forms_1.Validators.required(c);
            }
            return null;
        };
    }
    mustBeNewEmail() {
        let batch;
        return (c) => {
            if (batch) {
                batch.reset();
                return batch;
            }
            return batch = util_1.wait(500, (resolve) => __awaiter(this, void 0, void 0, function* () {
                if (yield this.api.isUniqueEmail(c.value)) {
                    resolve(null);
                }
                else {
                    resolve({ valid: false });
                }
            }));
        };
    }
    mustEqual(field) {
        return (c) => {
            if (this.signUpForm && c.value !== this.signUpForm.value[field]) {
                return { valid: false };
            }
            return null;
        };
    }
    mustBeChecked() {
        return (c) => {
            if (this.isSignUpMode && !c.value) {
                return { valid: false };
            }
            return null;
        };
    }
    processSignUp() {
        return __awaiter(this, void 0, void 0, function* () {
            this.processing = true;
            this.error = null;
            try {
                yield this.api.signUp(this.signUpForm.value.email, this.signUpForm.value.password);
                this.isSignUpMode = false;
                this.notification = 'Account created! You can sign in now';
            }
            catch (error) {
                this.error = error.message;
            }
            finally {
                this.processing = false;
            }
        });
    }
    processSignIn() {
        return __awaiter(this, void 0, void 0, function* () {
            this.processing = true;
            this.error = null;
            try {
                const token = yield this.api.signIn(this.signInForm.value.email, this.signInForm.value.password);
                localStorage.setItem('authtoken', token);
                this.onSignIn.emit();
            }
            catch (error) {
                this.error = error.message;
            }
            finally {
                this.processing = false;
            }
        });
    }
};
__decorate([
    core_1.Output()
], SignInComponent.prototype, "onSignIn", void 0);
SignInComponent = __decorate([
    core_1.Component({
        selector: 'con-sign-in',
        template: sign_in_component_html_1.default,
        styles: [sign_in_component_scss_1.default],
    }),
    __param(0, core_1.Inject(api_service_1.default))
], SignInComponent);
exports.default = SignInComponent;
