import * as React from "react";
import { localize } from "../../localization";
import S from "./index.css";

export function Button({
  children,
  title,
  action,
  priority,
  enabled,
  className,
  style,
}) {
  return (
    <button
      disabled={enabled === false}
      onClick={action}
      className={`${S.button} ${S[priority || "primary"]} ${className || ""}`}
      style={style || {}}
    >
      {children || localize(title || "")}
    </button>
  );
}
