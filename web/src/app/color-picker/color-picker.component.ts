import { Component, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

import colors from 'material-colors';

import { Wrappable, rotate } from '../../util';
import template from './color-picker.component.html';
import styles from './color-picker.component.scss';

@Component({
  selector: 'con-color-picker',
  template: template,
  styles: [ styles ],
  encapsulation: ViewEncapsulation.None,
})
export class ColorPickerComponent {
  @Output() selectedChange = new EventEmitter<ca.Color>();
  @Input() selected: ca.Color;
  private _index = 1;
  private _colors = Wrappable([
    'red', 'pink', 'purple', 'deepPurple', 'indigo', 'blue', 'lightBlue', 'cyan',
    'teal', 'green', 'lightGreen', 'lime', 'yellow', 'amber', 'orange', 'deepOrange',
    'brown', 'grey', 'blueGrey',
  ].map(
    <K extends keyof typeof colors>(_: K) => [ colors[_]['100'], colors[_]['200'], colors[_]['300'] ]
  ));
  get colors() {
    return Array.prototype.concat(...rotate([
      this._colors[this._index - 1],
      this._colors[this._index],
      this._colors[this._index + 1],
    ]));
  }

  next(event?: MouseEvent) {
    if(event) {
      event.stopPropagation();
    }
    this._index = (this._index + 1) % this._colors.length;
  }

  prev(event?: MouseEvent) {
    if(event) {
      event.stopPropagation();
    }
    this._index = (this._index - 1 + this._colors.length) % this._colors.length;
  }

  select(color: string) {
    this.selected = this.parse(color);
    this.selectedChange.emit(this.selected);
  }

  parse(color: string): ca.Color {
    return parseInt(color.slice(1), 16) || 0;
  }
}
