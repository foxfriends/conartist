import { Component, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';

import template from './conventions.component.html';
import styles from './conventions.component.scss';
import StorageService from '../data/storage.service';
import ChooseConventionService from '../modals/choose-convention.service';
import ErrorService from '../modals/error.service';
import { MetaConvention, Convention, Conventions } from '../../../../conartist';

@Component({
  selector: 'con-conventions',
  template: template,
  styles: [ styles ],
})
export default class ConventionsComponent {
  private _conventions: BehaviorSubject<Conventions>;
  private _openConvention: Observable<Convention> | null;
  currentTab = 0;

  constructor(
    @Inject(StorageService) private storage: StorageService,
    @Inject(ChooseConventionService) private chooseConvention: ChooseConventionService,
    @Inject(ErrorService) private error: ErrorService,
  ) {
    this._conventions = this.storage.conventions;
  }

  get openConvention(): Observable<Convention> | null {
    return this._openConvention;
  }

  setOpenConvention(con: Convention | null) {
    if(!con) {
      this._openConvention = null;
      return;
    }
    this.storage.fillConvention(con.code);
    this._openConvention = this.storage.convention(con.code);
  }

  get conventions() {
    return this._conventions.getValue();
  }

  closeConvention() {
    this._openConvention = null;
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
