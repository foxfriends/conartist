/*       */
import * as React from "react";

import { l } from "../../../localization";
import S from "./chart.css";

export function NotEnoughData() {
  return (
    <div className={S.notEnoughData}>
      {l`There isn't enough data to display this chart!`}
    </div>
  );
}
