import * as React from "react";
import { closeDialog } from "./action";
import { l } from "../localization";
import { Basic } from "./basic";

export function Loading() {
  return <Basic title={l`Loading...`} onClose={closeDialog} />;
}
