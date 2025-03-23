/*       */
import * as React from "react";
import { Card } from "../card-view/card";
import { BasicHeader } from "../card-view/basic-header";
import { Table } from "../../common/table";
import { Row } from "../../common/table/row";
import { Link } from "../../common/link";
import { KofiButton } from "../../common/kofi";
import { l, lx } from "../../localization";
import { SUPPORT_EMAIL, DONATE_URL, REPOSITORY_URL } from "../../constants";
import * as navigate from "../../update/navigate";
import S from "./settings.css";

export function Contribute() {
  return (
    <Card>
      <BasicHeader>
        {l`Contribute`}
        <KofiButton className={S.headerButton} />
      </BasicHeader>
      <Table>
        <Row
          title={l`Report a bug/Request a feature`}
          detail={
            <Link
              onClick={navigate.suggestions}
              className={S.caps}
            >{l`View`}</Link>
          }
        />
        <Row
          title={l`Donate`}
          detail={
            <Link href={DONATE_URL} target="_blank" className={S.caps}>
              ko-fi.com
            </Link>
          }
        />
        <Row
          title={l`Contribute`}
          detail={
            <Link href={REPOSITORY_URL} target="_blank" className={S.caps}>
              github.com
            </Link>
          }
        />
      </Table>
    </Card>
  );
}
