import * as React from "react";
import { Grid } from "../grid";

export function Table({ children }) {
  return <Grid columns="auto 1fr auto">{children}</Grid>;
}
