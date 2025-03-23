/*       */
import { of } from "rxjs";
import { catchError } from "rxjs/operators";

import { PostRequest } from "./index";

export class ResendVerificationEmail extends PostRequest {
  constructor() {
    super("/account/resend-verification");
  }

  send(params = "") {
    return super.send().pipe(catchError(of));
  }
}
