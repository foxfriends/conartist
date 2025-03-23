/*       */
import * as React from "react";
import { Card } from "./card";
const { Fragment } = React;

import S from "./index.css";

export function CardView({ children }) {
  // NOTE: card views are ID'ed so that secondary card can locate it
  return (
    <div className={S.container} id="card-view">
      {children}
    </div>
  );
}
