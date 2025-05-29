import * as React from "react";
import { Row as DefaultRow } from "../../common/table/row";
import { l } from "../../localization";
import { Link } from "../../common/link";
import S from "./settings.css";

export function Row({ title, value, onEdit }) {
  const editButton = (
    <Link onClick={onEdit} className={S.caps}>{l`Change`}</Link>
  );
  const formattedValue = <div className={S.value}>{value || ""}</div>;
  const formattedTitle = <div className={S.caps}>{title}</div>;

  return (
    <DefaultRow
      truncate
      title={formattedTitle}
      value={formattedValue}
      detail={onEdit ? editButton : null}
    />
  );
}
