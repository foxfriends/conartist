/*       */
import * as React from "react";

import S from "./index.css";

export function Icon({ name, className }) {
  return (
    <span className={`${S.container} ${className || ""}`}>
      <span className="material-icons">{name}</span>
    </span>
  );
}
