/*       */
import * as React from "react";
import { l } from "../../../localization";
import { Row } from "../../../common/table/row";
import { Font } from "../../../common/font";
import { Link } from "../../../common/link";

export function WebsiteInfo({ infos }) {
  try {
    const websiteInfo = infos.find(({ title }) => title === "Website");
    if (websiteInfo && websiteInfo.action && websiteInfo.actionText) {
      const { action: websiteURL, actionText: website } = websiteInfo;
      return (
        <Row
          title={<Font smallCaps>{l`Website`}</Font>}
          value={
            <Link href={websiteURL} target="_blank">
              {website}
            </Link>
          }
        />
      );
    }
  } catch (_) {}
  return null;
}
