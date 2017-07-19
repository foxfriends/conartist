import { Directive, Input } from '@angular/core';
import { Side } from './help.constants';

@Directive({
  selector: 'con-help-text',
})
export class HelpTextDirective {
  @Input() text: string;
  @Input() anchor?: string;
  @Input() position: Side = 'right';
  @Input() x?: number;
  @Input() y?: number;
  @Input('class') className?: string;
}
