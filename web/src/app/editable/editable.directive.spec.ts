import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { expect } from 'chai';

import { EditableDirective } from './editable.directive';

@Component({
  selector: 'test-component',
  template: `<h1 conEditable [(content)]="content" [validator]="validator"></h1>`,
})
class TestComponent {
  validator: (str: string) => boolean = () => true;
  content = 'default-content';
}

type Context = {
  fixture: ComponentFixture<TestComponent>;
  input: DebugElement;
  component: TestComponent;
};

describe('Editable Directive', function(this: Mocha.ISuiteCallbackContext & Context) {
  beforeEach('Configure the module', () => TestBed.configureTestingModule({
    declarations: [ EditableDirective, TestComponent ],
  }));
  beforeEach('Create the component', () => {
    this.fixture = TestBed.createComponent(TestComponent);
    this.component = this.fixture.componentInstance;
    this.input = this.fixture.debugElement.query(By.directive(EditableDirective));
    this.fixture.detectChanges();
  });

  it('should fill the element with the content', () => {
    expect(this.input.nativeElement.textContent).to.equal('default-content');
  });

  it('should react to external content changes', () => {
    this.component.content = 'updated-content';
    this.fixture.detectChanges();
    expect(this.input.nativeElement.textContent).to.equal('updated-content');
  });

  it('should update the outer content when edited', () => {
    this.input.nativeElement.textContent = 'updated-content';
    this.input.triggerEventHandler('blur', null);
    expect(this.component.content).to.equal('updated-content');
  });

  it('should revert changes if the final value is invalid', () => {
    this.component.validator = str => str !== 'invalid';
    this.fixture.detectChanges();
    this.input.nativeElement.textContent = 'invalid';
    this.input.triggerEventHandler('blur', null);
    expect(this.component.content).to.equal('default-content');
  });
});
