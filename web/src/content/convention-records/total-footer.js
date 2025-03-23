/*       */
import * as React from "react";
import { l } from "../../localization";

import S from "./total-footer.css";

export function TotalFooter({ total, sales, expense }) {
  return (
    <div className={S.footer}>
      <div className={S.item}>
        <span className={S.title}>{l`Sales`}</span>
        <span className={S.amount}>{sales.toString()}</span>
      </div>
      <div className={S.item}>
        <span className={S.title}>{l`Expenses`}</span>
        <span className={S.amount}>{expense.toString()}</span>
      </div>
      <div className={S.item}>
        <span className={S.title}>{l`Total`}</span>
        <span className={S.amount}>{total.toString()}</span>
      </div>
    </div>
  );
}
