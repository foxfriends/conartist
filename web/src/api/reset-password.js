/*       */
import { of } from "rxjs";
import { catchError } from "rxjs/operators";

import { PostRequest } from "./index";

export class ResetPasswordRequest extends PostRequest {
  constructor() {
    super("/account/reset");
  }

  send(params) {
    return super.send(params).pipe(catchError(of));
  }
}
