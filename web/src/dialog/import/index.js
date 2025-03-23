/*       */
import * as React from "react";
import { ImportProducts } from "./products";

export function Import(props) {
  switch (props.type) {
    case "products":
      return <ImportProducts {...props} />;
  }
  return null;
}

export default Import;
