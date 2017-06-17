"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const forms_1 = require("@angular/forms");
const sign_in_component_1 = require("./sign-in.component");
const material_module_1 = require("../material.module");
let SignInModule = class SignInModule {
};
SignInModule = __decorate([
    core_1.NgModule({
        imports: [material_module_1.default, common_1.CommonModule, forms_1.ReactiveFormsModule],
        declarations: [sign_in_component_1.default],
        exports: [sign_in_component_1.default],
    })
], SignInModule);
exports.default = SignInModule;
