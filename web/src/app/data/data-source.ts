import { DataSource } from '@angular/cdk';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/map';

export type Filter<T> = ((item: T) => boolean) | null;
export type Sort<T> = ((a: T, b: T) => number) | null;
export type Page = { index: number; size: number; };
export class ConDataSource<T> extends DataSource<T> {
  private _filter = new BehaviorSubject<Filter<T>>(null);
  private _sort = new BehaviorSubject<Sort<T>>(null);
  private _page = new BehaviorSubject<Page>({ index: 0, size: 0 });

  get filter() { return this._filter.getValue(); }
  set filter(value) { this._filter.next(value)}
  get sort() { return this._sort.getValue(); }
  set sort(value) { this._sort.next(value)}
  get page() { return this._page.getValue(); }
  set page(value) { this._page.next(value); }

  constructor(private source: Observable<T[]>, initialFilter: Filter<T> = null, initialSort: Sort<T> = null, initialPage?: Page) {
    super();
    this.filter = initialFilter;
    this.sort = initialSort;
    initialPage && (this.page = initialPage);
  }

  connect(): Observable<T[]> {
    return Observable
      .combineLatest(
        this.source, this._filter, this._sort, this._page,
        (data, filter, sort, page) => data
          .filter(filter || (() => true))
          .sort(sort || (() => 0))
          .splice(page.index * page.size || 0, ...(page.size ? [page.size] : []))
      );
  }

  disconnect() {}
}
