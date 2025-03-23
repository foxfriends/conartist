/*       */
import * as React from "react";

import S from "./index.css";

export function Pager({ page, pages }) {
  const dots = [];
  for (let i = 0; i < pages; ++i) {
    dots.push(
      <div
        className={`${S.dot} ${i === page ? S.current : ""}`}
        key={`pager_dot_${i}`}
      />,
    );
  }
  return <div className={S.pager}>{dots}</div>;
}
