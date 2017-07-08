import { Directive, ElementRef, Inject, HostBinding } from '@angular/core';

@Directive({ selector: '[conAbsoluteViewbox]' })
export default class AbsoluteViewboxDirective {
  constructor(@Inject(ElementRef) private element: ElementRef) {}

  @HostBinding('attr.viewBox')
  get viewbox(): string {
    const { top, left, width, height } = this.element.nativeElement.getBoundingClientRect();
    return `${left} ${top} ${width} ${height}`;
  }
}
