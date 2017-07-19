import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { expect } from 'chai';

import { MaterialModule } from '../material.module';
import { EditableComponent } from './editable.component';

@Component({
  selector: 'test-component',
  template: `<con-editable [(content)]="content" [validator]="validator"></con-editable>`,
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

describe('Editable Component', function(this: Mocha.ISuiteCallbackContext & Context) {
  beforeEach('Configure the module', () => TestBed.configureTestingModule({
    imports: [ NoopAnimationsModule, FormsModule, MaterialModule ],
    declarations: [ EditableComponent, TestComponent ],
  }));
  beforeEach('Create the component', () => {
    this.fixture = TestBed.createComponent(TestComponent);
    this.component = this.fixture.componentInstance;
    this.input = this.fixture.debugElement.query(By.css('input'));
    this.fixture.detectChanges();
  });

  it('should fill the element with the content', () => {
    expect(this.input.nativeElement.value).to.equal('default-content');
  });

  it('should react to external content changes', async () => {
    this.component.content = 'updated-content';
    this.fixture.detectChanges();
    await this.fixture.whenStable();
    expect(this.input.nativeElement.value).to.equal('updated-content');
  });

  it('should update the outer content when edited', async () => {
    this.input.nativeElement.value = 'updated-content';
    this.input.nativeElement.dispatchEvent(new Event('input'));
    await this.fixture.whenStable();
    this.input.triggerEventHandler('blur', null);
    expect(this.component.content).to.equal('updated-content');
  });

  it('should revert changes if the final value is invalid', () => {
    this.component.validator = str => str !== 'invalid';
    this.fixture.detectChanges();
    this.input.nativeElement.value = 'invalid';
    this.input.triggerEventHandler('blur', null);
    expect(this.component.content).to.equal('default-content');
  });
});
