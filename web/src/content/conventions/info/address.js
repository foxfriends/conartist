/*       */
import * as React from "react";
import { l } from "../../../localization";
import { Row } from "../../../common/table/row";
import { Font } from "../../../common/font";
import { newlinesToReact } from "../../../util/newlines-to-react";

export function AddressInfo({ infos }) {
  try {
    const addressInfo = infos.find(({ title }) => title === "Address");
    if (addressInfo && addressInfo.info && addressInfo.action) {
      const { info, action } = addressInfo;
      const address = newlinesToReact(JSON.parse(info));
      const coordsURL = action;
      return (
        <Row title={<Font smallCaps>{l`Address`}</Font>} value={address} />
      );
    }
  } catch (_) {}
  return null;
}
