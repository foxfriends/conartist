import { Component, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/filter';

import template from './conventions.component.html';
import styles from './conventions.component.scss';
import StorageService from '../data/storage.service';
import ChooseConventionService from '../modals/choose-convention.service';
import ErrorService from '../modals/error.service';
import { MetaConvention, Conventions } from '../../../../conartist';

@Component({
  selector: 'con-conventions',
  template: template,
  styles: [ styles ],
})
export default class ConventionsComponent {
  private _conventions: BehaviorSubject<Conventions>;

  constructor(
    @Inject(StorageService) private storage: StorageService,
    @Inject(ChooseConventionService) private chooseConvention: ChooseConventionService,
    @Inject(ErrorService) private error: ErrorService,
  ) {
    this._conventions = this.storage.conventions;
  }

  get conventions() {
    return this._conventions.getValue();
  }
  openAddConventions() {
    this.chooseConvention
      .open()
      .filter((_): _ is MetaConvention => !!_)
      .subscribe(con => {
        try {
          this.storage.addConvention(con);
        } catch(error) {
          console.error(error);
          this.error.open(error);
          return;
        }
        this.storage.commit(true);
      });
  }
}
