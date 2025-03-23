/*       */
import * as React from "react";
import S from "./index.css";

export function Footer({ content, className }) {
  return (
    <div className={`${S.footer} ${className}`}>
      <div className={S.inner}>{content}</div>
    </div>
  );
}
