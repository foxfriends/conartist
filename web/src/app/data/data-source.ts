import { DataSource } from '@angular/cdk';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

export default class ConDataSource<T> extends DataSource<T> {
  filter: ((item: T) => boolean) | null = null;
  sort: ((a: T, b: T) => number) | null = null;

  constructor(private source: BehaviorSubject<T[]>) {
    super();
  }

  connect(): Observable<T[]> {
    return this.source.map(_ => _.filter(this.filter || (() => true)).sort(this.sort || (() => 0)));
  }

  disconnect() {}
}
