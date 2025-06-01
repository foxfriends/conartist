import * as React from "react";
import { Card } from "../card-view/card";
import { BasicHeader } from "../card-view/basic-header";
import { Button } from "../../common/button";
import { Tooltip } from "../../common/tooltip";
import { Icon } from "../../common/icon";
import { Link } from "../../common/link";
import { l } from "../../localization";
import * as update from "../../update/settings";
import S from "./settings.css";

export function DangerZone({ email, name, verified }) {
  return (
    <Card>
      <BasicHeader>
        {l`Danger Zone`}
        <Button
          className={S.headerButton}
          priority="danger"
          title="Delete Account"
          action={() => update.deleteAccount()}
        >{l`Delete Account`}</Button>
      </BasicHeader>
      <p className={S.description}>{l`<Danger warning>`}</p>
    </Card>
  );
}
