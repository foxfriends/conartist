import { DataSource } from '@angular/cdk';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export default class ConDataSource<T> extends DataSource<T> {
  constructor(private source: BehaviorSubject<T>) {
    super();
  }

  connect(): Observable<T> {
    return this.source;
  }
}
