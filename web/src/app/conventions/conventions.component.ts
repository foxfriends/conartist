import { Component, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import template from './conventions.component.html';
import styles from './conventions.component.scss';
import StorageService from '../data/storage.service';
import ChooseConventionService from '../modals/choose-convention.service';
import ErrorService from '../modals/error.service';
import { MetaConvention, FullConvention, Conventions } from '../../../../conartist';

@Component({
  selector: 'con-conventions',
  template: template,
  styles: [ styles ],
})
export default class ConventionsComponent {
  private _conventions: BehaviorSubject<Conventions>;
  private _openConvention: MetaConvention | FullConvention | null = null;
  currentTab = 0;

  constructor(
    @Inject(StorageService) private storage: StorageService,
    @Inject(ChooseConventionService) private chooseConvention: ChooseConventionService,
    @Inject(ErrorService) private error: ErrorService,
  ) {
    this._conventions = storage.conventions;
  }

  get openConvention(): MetaConvention | FullConvention | null {
    return this._openConvention;
  }

  set openConvention(con: MetaConvention | FullConvention | null) {
    this._openConvention = con;
    if(con && con.type !== 'full') {
      this.storage.fillConvention(con.code);
      this.storage
        .convention(con.code)
        .filter((_): _ is FullConvention => _.type === 'full')
        .take(1)
        .subscribe(_ => this._openConvention = _);
    }
  }

  get conventions() {
    return this._conventions.getValue();
  }

  closeConvention() {
    this.openConvention = null;
  }

  openAddConventions() {
    this.chooseConvention.open().filter((_): _ is MetaConvention => !!_).subscribe(_ => {
      try {
        this.storage.addConvention(_);
      } catch(error) {
        console.error(error);
        this.error.open(error);
        return;
      }
      this.storage.commit(true);
    });
  }
}
