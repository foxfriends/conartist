import { Component, Inject, Input, ContentChildren, QueryList, HostListener, ChangeDetectorRef } from '@angular/core';

import { Side } from './help.constants';
import { HelpArrowDirective } from './help-arrow.directive';
import { HelpTextDirective } from './help-text.directive';
import { HelpOutlineDirective } from './help-outline.directive';
import { HelpService } from './help.service';
import template from './help.component.html';
import styles from './help.component.scss';

type Text = {
  text: string;
  className: string;
  x: number;
  y: number;
};

type Arrow = {
  d: string;
}

type Ellipse = {
  type: 'ellipse';
  x: number;
  y: number;
  rx: number;
  ry: number;
};

type Rectangle = {
  type: 'rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
};

type RoundRectangle = {
  type: 'round-rectangle';
  x: number;
  y: number;
  width: number;
  height: number;
}

type Outline = Ellipse | Rectangle | RoundRectangle;

type Point = { x: number; y: number; };

function getCoordinate(element: Element, side: Side): Point {
  const rect = element.getBoundingClientRect();
  switch(side) {
    case 'left':
      return { x: rect.left, y: rect.top + rect.height / 2 };
    case 'right':
      return { x: rect.right, y: rect.top + rect.height / 2 };
    case 'top':
      return { x: rect.left + rect.width / 2, y: rect.top };
    case 'bottom':
      return { x: rect.left + rect.width / 2, y: rect.bottom };
    case 'top-left':
      return { x: rect.left, y: rect.top };
    case 'top-right':
      return { x: rect.right, y: rect.top };
    case 'bottom-left':
      return { x: rect.left, y: rect.bottom };
    case 'bottom-right':
      return { x: rect.right, y: rect.bottom };
    case 'center':
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }
}

@Component({
  selector: 'con-help',
  template: template,
  styles: [ styles ],
})
export class HelpComponent {
  @ContentChildren(HelpArrowDirective) private _arrows: QueryList<HelpArrowDirective>;
  @ContentChildren(HelpTextDirective) private _texts: QueryList<HelpTextDirective>;
  @ContentChildren(HelpOutlineDirective) private _outlines: QueryList<HelpOutlineDirective>;

  @Input() helpFor: HTMLElement;

  constructor(
    @Inject(HelpService) private help: HelpService,
    @Inject(ChangeDetectorRef) private changeDetector: ChangeDetectorRef,
  ) {}

  @HostListener('window:resize')
  onResize() {
    this.changeDetector.detectChanges();
  }

  get visible() { return this.help.visible; }
  set visible(visible: boolean) {
    if(visible) {
      this.help.show();
    } else {
      this.help.hide();
    }
  }

  get texts(): Text[] {
    return this._texts.map(text => {
      let [x, y] = [0, 0];
      if(text.anchor) {
        const element = this.helpFor.querySelector(text.anchor);
        if(!element) { return null; }
        const coord = getCoordinate(element, text.position);
        x = coord.x;
        y = coord.y;
      } else if(text.x !== undefined && text.y !== undefined) {
        x = text.x;
        y = text.y;
      } else {
        return null;
      }
      return { text: text.text, x, y, className: `${text.className || ''} help__text--${text.position}` };
    }).filter((_): _ is Text => !!_);
  }

  get outlines(): Outline[] {
    return this._outlines.map(outline => {
      const children = this.helpFor.querySelectorAll(typeof outline.selector === 'string' ? outline.selector : outline.selector.join(','));
      if(!children.length) { return; }
      const bounds = ([].map.call(children, (_: Element) => _.getBoundingClientRect()) as ClientRect[])
        .reduce((_, { top, right, bottom, left }) => {
          return {
            top: Math.min(top, _.top),
            right: Math.max(right, _.right),
            bottom: Math.max(bottom, _.bottom),
            left: Math.min(left, _.left),
          };
        }, { top: Infinity, right: -Infinity, bottom: -Infinity, left: Infinity });
      switch(outline.shape) {
        case 'ellipse':
          return {
            type: outline.shape,
            x: (bounds.left + bounds.right) / 2,
            y: (bounds.top + bounds.bottom) / 2,
            rx: (bounds.left - bounds.right) / 2,
            ry: (bounds.bottom - bounds.top) / 2,
          };
        case 'rectangle':
        case 'round-rectangle':
          return {
            type: outline.shape,
            x: Math.floor(bounds.left),
            y: Math.floor(bounds.top),
            width: Math.ceil(bounds.right - bounds.left),
            height: Math.ceil(bounds.bottom - bounds.top),
          };
      }
    }).filter((_): _ is Outline => !!_);
  }

  get arrows(): Arrow[] {
    return this._arrows.map(arrow => {
      const [start, end] = [
        this.helpFor.querySelector(arrow.start),
        this.helpFor.querySelector(arrow.end),
      ];
      if(!start || !end) { return null; }

      const { x: x1, y: y1 } = getCoordinate(start, arrow.startSide);
      const { x: x2, y: y2 } = getCoordinate(end, arrow.endSide);

      const [dx, dy] = [x1 - x2, y1 - y2]

      const [mx, my] = [
        (x1 + x2) / 2 - dx / 5,
        (y1 + y2) / 2 - dy / 5,
      ];

      return { d: `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}` };
    }).filter((_): _ is Arrow => !!_);
  }
}
