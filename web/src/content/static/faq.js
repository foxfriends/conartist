/*       */
import * as React from "react";
import FAQ from "./FAQ.md";
import S from "./static.css";

export function Faq({ className, style }) {
  return (
    <section className={className} style={style}>
      <div className={S.copy} dangerouslySetInnerHTML={{ __html: FAQ }} />
    </section>
  );
}

export default Faq;
