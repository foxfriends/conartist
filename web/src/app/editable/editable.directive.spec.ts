import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { expect } from 'chai';

import EditableDirective from './editable.directive';

@Component({
  selector: 'test-component',
  template: `<h1 conEditable [(conTent)]='content'></h1>`,
})
class TestComponent {
  content = 'default-content';
}

type Context = {
  fixture: ComponentFixture<TestComponent>;
  component: TestComponent;
};

describe('Editable Directive', function(this: Mocha.ISuiteCallbackContext & Context) {
  beforeEach('Configure the module', () => TestBed.configureTestingModule({
    declarations: [ EditableDirective, TestComponent ],
  }));
  beforeEach('Create the component', () => {
    this.fixture = TestBed.createComponent(TestComponent);
    this.component = this.fixture.componentInstance;
    this.fixture.detectChanges();
  });

  it('should fill the element with the content', () => {
    expect(this.fixture.debugElement.query(By.directive(EditableDirective)).nativeElement.textContent).to.equal('default-content');
  });

  it('should react to external content changes', () => {
    this.component.content = 'updated-content';
    this.fixture.detectChanges();
    expect(this.fixture.debugElement.query(By.directive(EditableDirective)).nativeElement.textContent).to.equal('updated-content');
  });

  it('should update the outer content when edited', () => {
    const el = this.fixture.debugElement.query(By.directive(EditableDirective));
    el.nativeElement.textContent = 'updated-content';
    el.triggerEventHandler('blur', null);
    this.fixture.detectChanges();
    expect(this.component.content).to.equal('updated-content');
  });

  it.skip('should submit on enter press');
});
