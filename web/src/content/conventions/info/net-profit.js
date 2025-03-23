/*       */
import * as React from "react";

import { l } from "../../../localization";
import { Row } from "../../../common/table/row";
import { Font } from "../../../common/font";
import { Money } from "../../../model/money";

export function NetProfit({ sales, expenses }) {
  sales = sales || Money.zero;
  expenses = expenses || Money.zero;
  const net = sales.add(expenses.negate());
  return (
    <Row
      title={<Font smallCaps>{l`Net profit`}</Font>}
      detail={net.toString()}
    />
  );
}
