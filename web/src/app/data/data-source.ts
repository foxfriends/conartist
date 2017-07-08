import { DataSource } from '@angular/cdk';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/map';

export default class ConDataSource<T> extends DataSource<T> {
  private _filter = new BehaviorSubject<((item: T) => boolean) | null>(null);
  private _sort = new BehaviorSubject<((a: T, b: T) => number) | null>(null);

  get filter() { return this._filter.getValue(); }
  set filter(value) { this._filter.next(value)}
  get sort() { return this._sort.getValue(); }
  set sort(value) { this._sort.next(value)}

  constructor(private source: BehaviorSubject<T[]>) {
    super();
  }

  connect(): Observable<T[]> {
    return Observable
      .combineLatest(
        this.source, this._filter, this._sort,
        (data, filter, sort) => data.filter(filter || (() => true)).sort(sort || (() => 0))
      );
  }

  disconnect() {}
}
