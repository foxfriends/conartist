'use strict';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

const refresh = new Subject();

function update() {
  refresh.next();
  window.requestAnimationFrame(update);
}
update();

function vsync(frameskip = 0) {
  return Observable.create(subscriber => {
    const collection = [[]];
    for(let i = 0; i < frameskip; ++i) {
      collection.push([]);
    }

    refresh.subscribe(() => {
      for(const value of collection[0]) {
        try {
          subscriber.next(value);
        } catch(err) {
          subscriber.error(err);
        }
      }
      collection.splice(0, 1);
      collection.push([]);
    });

    return this.subscribe(
      value => collection[frameskip].push(value),
      err => subscriber.error(err),
      () => subscriber.complete(),
    );
  });
}

Observable.prototype.vsync = vsync;
