"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const chai_1 = require("chai");
const sign_in_component_1 = require("./sign-in.component");
describe('Sign In Component', function () {
    beforeEach('Configure the module', () => testing_1.TestBed.configureTestingModule({ declarations: [sign_in_component_1.default] }));
    beforeEach('Create the component', () => {
        this.fixture = testing_1.TestBed.createComponent(sign_in_component_1.default);
        this.component = this.fixture.componentInstance;
        this.fixture.detectChanges();
    });
    it('should be created', () => {
        chai_1.expect(this.component).not.to.be.undefined;
    });
});
