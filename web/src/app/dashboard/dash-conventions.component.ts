import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import template from './dash-conventions.component.html';
import styles from './dash-conventions.component.scss';
import { StorageService } from '../data/storage.service';
import { ChooseConventionService } from '../modals/choose-convention.service';
import { ErrorService } from '../modals/error.service';

@Component({
  selector: 'con-dash-conventions',
  template: template,
  styles: [ styles ],
})
export class DashConventionsComponent {
  private _conventions: BehaviorSubject<ca.Conventions>;
  private keys: BehaviorSubject<number>;

  constructor(
    @Inject(StorageService) private storage: StorageService,
    @Inject(ChooseConventionService) private chooseConvention: ChooseConventionService,
    @Inject(ErrorService) private error: ErrorService,
    @Inject(Router) private router: Router,
  ) {
    this._conventions = this.storage.conventions;
    this.keys = this.storage.keys;
  }

  get conventions(): (ca.MetaConvention | ca.FullConvention)[] {
    return this._conventions.getValue().filter((_): _ is ca.MetaConvention | ca.FullConvention => _.type !== 'invalid');
  }

  viewCon(code: string): void {
    this.router.navigate(['/conventions', code]);
  }

  openBuyKeys() {
    // TODO: allow purchasing of keys
    console.log('buying a key!');
  }

  openAddConventions() {
    this.chooseConvention.open()
      .filter((_): _ is ca.MetaConvention => !!_)
      .subscribe((con: ca.MetaConvention) => {
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
