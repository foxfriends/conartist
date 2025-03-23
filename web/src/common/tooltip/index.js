/*       */
import * as React from "react";

import S from "./index.css";

export function Tooltip({ title, children, className, clickable = true }) {
  return (
    <div
      className={`${S.container} ${clickable ? S.clickable : ""} ${className || ""}`}
    >
      <div className={S.target} tabIndex={0}>
        {children}
      </div>
      <div className={S.tooltip}>{title}</div>
    </div>
  );
}
