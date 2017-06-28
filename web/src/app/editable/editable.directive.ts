import { Directive, Inject, Input, ElementRef, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import './editable.directive.scss';

@Directive({
  selector: '[conEditable]',
  host: {
    '(blur)': 'onBlur()',
    '(keydown.enter)': 'onEnterPress($event)',
    'contenteditable': 'true',
  },
})
export default class EditableDirective implements OnChanges {
  @Input('conTent') content: string;
  @Output('conTentChange') contentChange = new EventEmitter<string>();

  constructor(@Inject(ElementRef) private element: ElementRef) {}

  onEnterPress(event: KeyboardEvent) {
    event.preventDefault();
    this.element.nativeElement.blur();
  }

  onBlur() {
    const value = this.element.nativeElement.textContent;
    this.contentChange.emit(value);
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.content) {
      this.element.nativeElement.textContent = changes.content.currentValue;
    }
  }
}
