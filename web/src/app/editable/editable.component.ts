import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import template from './editable.component.html';
import styles from './editable.component.scss';

@Component({
  selector: 'con-editable',
  template: template,
  styles: [ styles ]
})
export default class EditableComponent implements OnChanges {
  @Input() content: string;
  @Output() contentChange = new EventEmitter<string>();
  @Input() validator?: (v: string) => boolean;

  value: string = this.content;

  onBlur() {
    const value = this.value;
    if(!this.validate(value)) {
      this.value = this.content;
      return;
    }
    this.contentChange.emit(this.value);
  }

  validate(v: string) {
    if(v === '') { return false; }
    if(this.validator && !this.validator(v)) { return false; }
    return true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.content) {
      this.value = changes.content.currentValue;
    }
  }
}
