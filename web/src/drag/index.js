/*       */
import { Subject, combineLatest, fromEvent } from "rxjs";
import { share, map, distinctUntilChanged } from "rxjs/operators";

const target = new Subject();

const currentPosition = fromEvent(window, "mousemove").pipe(
  map((event) => [event.clientX, event.clientY]),
);
fromEvent(window, "mouseup").subscribe(dragEnd);

export const dragEvents = combineLatest(
  currentPosition,
  target.pipe(distinctUntilChanged()),
).pipe(
  map(([position, target]) => ({ position, target })),
  share(),
);

export function dragStart(identifier) {
  target.next(identifier);
}

function dragEnd() {
  target.next(null);
}
