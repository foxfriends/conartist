/*       */

import { of } from "rxjs";
import { tap, switchMap } from "rxjs/operators";

import { PostRequest } from "./index";
import { Storage } from "../storage";

import { UserQuery } from "./user-query";

export class SignUpRequest extends PostRequest {
  constructor() {
    super("/account/new");
  }

  send(params) {
    return super.send(params).pipe(
      tap((response) => {
        if (response.state === "retrieved") {
          Storage.store(Storage.Auth, response.value);
        } else if (response.state === "failed") {
          Storage.remove(Storage.Auth);
          throw response;
        }
      }),
      switchMap((response) =>
        response.state === "retrieved" ? new UserQuery().send() : of(response),
      ),
    );
  }
}
