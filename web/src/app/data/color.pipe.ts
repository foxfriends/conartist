import { Pipe, PipeTransform } from '@angular/core';
import { Color } from '../../../../conartist';

@Pipe({name: 'color'})
export default class ColorPipe implements PipeTransform {
  transform(color: Color, format: 'rgb' | 'hex' = 'hex'): string {
    const [r, g, b, a] = [
      (color >> 16) & 0xFF,
      (color >> 8) & 0xFF,
      color & 0xFF,
      Math.ceil((color > 0xFFFFFF ? (color >> 24) & 0xFF : 255) / 255 * 100) / 100
    ];
    if(format === 'hex') {
      if(a === 1) {
        return `#${(color & 0xFFFFFF).toString(16).padStart(6, '0')}`;
      } else {
        return `rgba(${this.transform((r << 16) + (g << 8) + b, 'hex')},${a})`;
      }
    } else {
      if(a === 1) {
        return `rgb(${r},${g},${b})`;
      } else {
        return `rgba(${r},${g},${b},${a})`;
      }
    }
  }
}
