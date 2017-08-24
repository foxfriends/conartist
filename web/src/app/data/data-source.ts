import { DataSource } from '@angular/cdk';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

export type Filter<T> = ((item: T) => boolean);
export type Sort<T> = ((a: T, b: T) => number);
export type Page = { index: number; size: number; };
export class ConDataSource<T> extends DataSource<T> {
  private _filter = new BehaviorSubject<Filter<T> | undefined>(this.initialFilter);
  private _sort = new BehaviorSubject<Sort<T> | undefined>(this.initialSort);
  private _page = new BehaviorSubject<Page>({ index: 0, size: 0 });

  get filter() { return this._filter.getValue(); }
  set filter(value) { this._filter.next(value)}
  get sort() { return this._sort.getValue(); }
  set sort(value) { this._sort.next(value)}
  get page() { return this._page.getValue(); }
  set page(value) { this._page.next(value); }

  constructor(
    private source: Observable<T[]>,
    private initialFilter: Filter<T> = () => true,
    private initialSort: Sort<T> = () => 0,
    initialPage?: Page,
  ) {
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
          .filter(filter || this.initialFilter)
          .sort(sort || this.initialSort)
          .splice(page.index * page.size || 0, ...(page.size ? [page.size] : []))
      )
      .do(console.log);
  }

  disconnect() {}
}
