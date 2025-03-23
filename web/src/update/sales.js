/*       */
import { model } from "../model";

import { empty, extend, prepend, replaceById } from "../model/connection";
import { RecordsConnection } from "../api/records-connection.js";

export async function loadSales(fresh = false) {
  if (fresh) {
    model.next({
      ...model.getValue(),
      records: empty(),
    });
  }
  const previous = fresh ? empty() : model.getValue().records;
  const { state, value, error } = await new RecordsConnection()
    .send({ before: previous.endCursor })
    .toPromise();
  switch (state) {
    case "retrieved":
      model.next({
        ...model.getValue(),
        records: extend(previous, value),
      });
      break;
    case "failed":
      console.error(error);
      break;
  }
}

export async function newRecord() {}
