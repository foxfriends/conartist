import { Component, Inject } from '@angular/core';

import template from './choose-convention.component.html';
import styles from './choose-convention.component.scss';
import APIService from '../api/api.service';
import { MetaConvention } from '../../../../conartist';

@Component({
  selector: 'con-choose-convention',
  template: template,
  styles: [ styles ],
})
export default class ChooseConventionComponent {
  private _conventions: MetaConvention[] = [];
  private _page = 0;
  constructor(@Inject(APIService) private api: APIService) {
    this.update();
  }

  get page() {
    return this._page;
  }
  set page(page) {
    this._page = page;
    this.update();
  }

  private update() {
    this.api.getConventions(this.page).subscribe(_ => this._conventions = _);
  }

  get conventions(): MetaConvention[] {
    return this._conventions;
  }
}
