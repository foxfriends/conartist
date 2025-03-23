/*       */
import { Subject } from "rxjs";

import { share } from "rxjs/operators";

const subject = new Subject();

export const focused = subject.pipe(share());

export function focus() {
  subject.next(true);
}
