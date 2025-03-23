/*       */
import { of } from "rxjs";
import { catchError } from "rxjs/operators";

import { PostRequest } from "./index";

export class VerifyAccountRequest extends PostRequest {
  constructor() {
    super("/account/verify");
  }

  send(code) {
    return super.send({ code }).pipe(catchError(of));
  }
}
