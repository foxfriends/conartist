import { Directive, Input } from '@angular/core';
import { Side } from './help.constants';
@Directive({
  selector: 'con-help-arrow',
})
export default class HelpArrowDirective {
  @Input() start: string;
  @Input() end: string;
  @Input() startSide: Side = 'center';
  @Input() endSide: Side = 'center';
}
