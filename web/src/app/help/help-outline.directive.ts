import { Directive, Input } from '@angular/core';
import { Shape } from './help.constants';

@Directive({
  selector: 'con-help-outline',
})
export class HelpOutlineDirective {
  @Input() selector: string | string[];
  @Input() shape: Shape = 'round-rectangle';
}
