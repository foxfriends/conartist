/*       */
import * as React from "react";

import { l } from "../../../localization";
import S from "./chart.css";

export function ChartsLoading() {
  return <div className={S.notEnoughData}>{l`Loading...`}</div>;
}
