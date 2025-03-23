/*       */
import * as React from "react";
import { Card } from "../../card-view/card";
import { BasicHeader } from "../../card-view/basic-header";
import { IconButton } from "../../../common/icon-button";
import S from "./card.css";

export function ChartCard({ children, title, showSettings, innerRef }) {
  const [content, settings] = children;
  return (
    <Card innerRef={innerRef}>
      <>
        <BasicHeader>{title}</BasicHeader>
        <IconButton
          className={S.rightAction}
          title="settings"
          action={() => showSettings(settings)}
          priority="primary"
        />
      </>
      <>{content}</>
    </Card>
  );
}
