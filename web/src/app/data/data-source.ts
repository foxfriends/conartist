import { DataSource } from '@angular/cdk';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/map';

export type Filter<T> = ((item: T) => boolean) | null;
export type Sort<T> = ((a: T, b: T) => number) | null;
export class ConDataSource<T> extends DataSource<T> {
  private _filter = new BehaviorSubject<Filter<T>>(null);
  private _sort = new BehaviorSubject<Sort<T>>(null);

  get filter() { return this._filter.getValue(); }
  set filter(value) { this._filter.next(value)}
  get sort() { return this._sort.getValue(); }
  set sort(value) { this._sort.next(value)}

  constructor(private source: Observable<T[]>, initialFilter: Filter<T> = null, initialSort: Sort<T> = null) {
    super();
    this.filter = initialFilter;
    this.sort = initialSort;
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
