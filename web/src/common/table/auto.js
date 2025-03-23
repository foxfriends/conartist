/*       */
import * as React from "react";
import { Table } from "./index";

export function AutoTable({ dataSource, children }) {
  const [emptyState, transformer, footer] =
    children instanceof Array ? [...children] : [, children];

  const data = [...dataSource];
  return (
    <>
      {data.length === 0 ? emptyState || null : null}
      <Table>{data.map(transformer)}</Table>
      {footer || null}
    </>
  );
}
