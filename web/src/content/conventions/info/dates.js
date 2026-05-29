import * as React from "react";
import { format as formatDate } from "date-fns";
import { l } from "../../../localization";
import { Row } from "../../../common/table/row";
import { Font } from "../../../common/font";
import { toUTC } from "../../../util/date";

function format(date) {
  return formatDate(date, l`MMM. d, yyyy`);
}

export function DatesInfo({ start, end }) {
  return (
    <Row
      title={<Font smallCaps>{l`Dates`}</Font>}
      value={l`${format(toUTC(start))} - ${format(toUTC(end))}`}
    />
  );
}
