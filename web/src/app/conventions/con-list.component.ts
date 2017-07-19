import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/take';

import { StorageService } from '../data/storage.service';
import template from './con-list.component.html';
import styles from './con-list.component.scss';

@Component({
  selector: 'con-list',
  template: template,
  styles: [ styles ],
})
export class ConListComponent {
  @Output() conClick = new EventEmitter<ca.Convention>();

  private _conventions: BehaviorSubject<ca.Conventions>;

  constructor(
    @Inject(StorageService) storage: StorageService,
    @Inject(Router) private router: Router,
  ) {
    this._conventions = storage.conventions;
  }

  get conventions(): (ca.MetaConvention | ca.FullConvention)[] {
    return this._conventions.getValue().filter((_): _ is ca.MetaConvention | ca.FullConvention => _.type !== 'invalid');
  }

  get currentConventions(): (ca.MetaConvention | ca.FullConvention)[] {
    return this.conventions.filter(({ start, end }) => start <= new Date() && new Date() <= end);
  }
  get upcomingConventions(): (ca.MetaConvention | ca.FullConvention)[] {
    return this.conventions.filter(({ start }) => start > new Date());
  }
  get previousConventions(): (ca.MetaConvention | ca.FullConvention)[] {
    return this.conventions.filter(({ end }) => end < new Date());
  }

  openConvention(convention: ca.Convention) {
    this.router.navigate(['/conventions', convention.code]);
  }
}
