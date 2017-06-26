import { Pipe, PipeTransform } from '@angular/core';
import { Color } from '../../../../conartist';

@Pipe({name: 'color'})
export default class ColorPipe implements PipeTransform {
  transform([r, g, b, a]: Color, format: 'rgb' | 'hex' = 'hex'): string {
    if(format === 'hex') {
      if(a === undefined || a === 1) {
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      } else {
        return `rgba(${this.transform([r,g,b])},${a})`;
      }
    } else {
      if(a === undefined || a === 1) {
        return `rgb(${r},${g},${b})`;
      } else {
        return `rgba(${r},${g},${b},${a})`;
      }
    }
  }
}
