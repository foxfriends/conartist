/*       */
import * as React from "react";

import S from "./index.css";

export function Link({ href, onClick, className, style, children, target }) {
  return href ? (
    <a
      href={href}
      className={`${S.link} ${className || ""}`}
      target={target}
      rel="noopener"
      style={style}
    >
      {children}
    </a>
  ) : (
    <a
      onClick={onClick}
      className={`${S.link} ${className || ""}`}
      style={style}
    >
      {children}
    </a>
  );
}
