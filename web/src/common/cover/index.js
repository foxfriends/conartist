/*       */
import * as React from "react";
import S from "./index.css";

export function Cover({ fixed, onClick, className }) {
  return (
    <div
      className={`${S.cover} ${className || ""} ${fixed ? S.fixed : ""}`}
      onClick={onClick}
    />
  );
}
