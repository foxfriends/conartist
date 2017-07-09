import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/take';

import StorageService from '../data/storage.service';
import template from './con-list.component.html';
import styles from './con-list.component.scss';
import { Convention, Conventions, MetaConvention, FullConvention } from '../../../../conartist';

@Component({
  selector: 'con-con-list',
  template: template,
  styles: [ styles ],
})
export default class ConListComponent {
  @Output() conClick = new EventEmitter<Convention>();

  private _conventions: BehaviorSubject<Conventions>;

  constructor(
    @Inject(StorageService) storage: StorageService,
    @Inject(ActivatedRoute) private route: ActivatedRoute,
    @Inject(Router) private router: Router,
  ) {
    this._conventions = storage.conventions;
  }

  get conventions() {
    return this._conventions.getValue().filter((_): _ is MetaConvention | FullConvention => _.type !== 'invalid');
  }

  get currentConventions(): (MetaConvention | FullConvention)[] {
    return this.conventions.filter(({ start, end }) => start <= new Date() && new Date() <= end);
  }
  get upcomingConventions(): (MetaConvention | FullConvention)[] {
    return this.conventions.filter(({ start }) => start > new Date());
  }
  get previousConventions(): (MetaConvention | FullConvention)[] {
    return this.conventions.filter(({ end }) => end < new Date());
  }

  selectConvention(convention: Convention) {
    this.router.navigate([convention.code], { relativeTo: this.route });
  }
}
