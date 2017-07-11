import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import template from './con-info.component.html';
import styles from './con-info.component.scss';
import { FullConvention } from '../../../../conartist';

@Component({
  selector: 'con-con-info',
  template: template,
  styles: [ styles ],
})
export default class ConInfoComponent implements OnInit {
  convention: Observable<FullConvention>;

  constructor(
    @Inject(ActivatedRoute) private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.convention = this.route.data.switchMap(_ => _.convention);
  }
}
