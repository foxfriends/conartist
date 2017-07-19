import { Component, Inject } from '@angular/core';

import template from './choose-convention.component.html';
import styles from './choose-convention.component.scss';
import { APIService } from '../api/api.service';

@Component({
  selector: 'con-choose-convention',
  template: template,
  styles: [ styles ],
})
export class ChooseConventionComponent {
  private _conventions: ca.MetaConvention[] = [];
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

  get conventions(): ca.MetaConvention[] {
    return this._conventions;
  }
}
