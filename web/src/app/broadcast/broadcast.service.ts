import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import ConEvent from './event';

@Injectable()
export default class BroadcastService extends Observable<ConEvent<any>> {
  private _subscriber: Subscriber<ConEvent<any>>;

  constructor() {
    super(sub => this._subscriber = sub);
  }

  emit<T>(event: ConEvent<T>): void {
    this._subscriber.next(event);
  }
}
