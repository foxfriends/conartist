/*       */
import * as React from "react";
import { Icon } from "../icon";

import S from "./index.css";

export function IconButton({
  priority,
  title,
  action,
  enabled,
  className,
  style,
  quiet,
}) {
  return (
    <button
      disabled={enabled === false}
      onClick={action}
      className={`${S.button} ${S[priority || "primary"]} ${quiet ? S.quiet : ""} ${className || ""}`}
      style={style || {}}
    >
      <Icon name={title || ""} />
    </button>
  );
}
