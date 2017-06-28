import { Directive, Inject, Input, ElementRef, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import './editable.directive.scss';

@Directive({
  selector: '[conEditable]',
  host: {
    '(blur)': 'onBlur()',
    '(keydown.enter)': 'onEnterPress($event)',
    'contenteditable': 'true',
    'spellcheck': 'false',
  },
})
export default class EditableDirective implements OnChanges {
  @Input('conTent') content: string;
  @Output('conTentChange') contentChange = new EventEmitter<string>();
  @Input() validator?: (v: string) => boolean;

  constructor(@Inject(ElementRef) private element: ElementRef) {}

  onEnterPress(event: KeyboardEvent) {
    event.preventDefault();
    this.element.nativeElement.blur();
  }

  onBlur() {
    const value = this.element.nativeElement.textContent.trim();
    if(!this.validate(value)) {
      this.element.nativeElement.textContent = this.content;
      return;
    }
    this.contentChange.emit(value);
  }

  validate(v: string) {
    if(v === '') { return false; }
    if(this.validator && !this.validator(v)) { return false; }
    return true;
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.content) {
      this.element.nativeElement.textContent = changes.content.currentValue;
    }
  }
}
