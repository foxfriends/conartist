import * as React from "react";
import { by, Asc } from "../../util/sort";
import { l, lx } from "../../localization";
import { BasicCard } from "../card-view/basic-card";
import { Card } from "../card-view/card";
import { AutoTable as Table } from "../../common/table/auto";
import { Row } from "../../common/table/row";

import S from "./index.css";

export function Discounts({ discounts, products, productTypes }) {
  const dataSource = discounts.sort(by(["name", Asc]));

  if (dataSource.length === 0) {
    return (
      <Card className={S.emptyState}>
        <div className={S.placeholder}>{lx`<Empty discounts list message>`((x) => x)}</div>
      </Card>
    );
  }

  return (
    <BasicCard title={l`Discounts`}>
      <Table dataSource={discounts}>
        {(discount, _) => (
          <Row
            key={discount.discountId}
            title={discount.name}
            detail={
              discount.flatAmount ? discount.flatAmount.toString() : `${discount.percentageAmount}%`
            }
          />
        )}
      </Table>
    </BasicCard>
  );
}
