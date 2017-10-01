'use strict';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import '../custom-rxjs/operator/vsync'
import { emissions } from '../elm';

const PADDING = 16;
const MAX_WIDTH = 150;

const alignTabIndicator = selectedTab =>
  [...document.querySelectorAll('.tabs')].forEach(tab => {
    const el = tab.querySelectorAll('.tabs__title')[selectedTab];
    const [indicator, left, width] = [
      tab.querySelector('.tabs__indicator'),
      // TODO: this is all a hack and probably will be buggy but I want to move on
      Math.max(PADDING, el ? el.offsetLeft  : PADDING),
      Math.min(MAX_WIDTH, el ? el.offsetWidth : MAX_WIDTH),
    ];
    // TODO: is there a more reliable way to calculate this measurement than hardcoded PADDING
    indicator.style.transform = `translateX(${left + width / 2 - PADDING}px) scaleX(${width})`;
  });

emissions.filter(_ => _.indexOf('inventoryTab') === 0).map(_ => +_.split(':')[1]).vsync(1).subscribe(alignTabIndicator);
