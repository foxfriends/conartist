import * as React from "react";
import { format as formatDate } from "date-fns";

import Map from "../../util/default-map";
import { List } from "../../common/list";
import { Link } from "../../common/link";
import { Icon } from "../../common/icon";
import { Font } from "../../common/font";
import { Item } from "../../common/list/item";
import { model } from "../../model";
import { l } from "../../localization";
import { SecondaryCard } from "../card-view/secondary-card";
import * as dialog from "../../update/dialog";

import S from "./info.css";

function format(date) {
  return formatDate(date, l`h:mma`);
}

export function RecordInfo({ convention, record, anchor, onClose }) {
  const { products, productTypes } = convention || model.getValue();
  const { discounts } = convention || model.getValue();

  const productInfo = [
    ...record.products
      .map((id) => products.find((product) => product.id === id))
      .reduce(
        (acc, product) => acc.set(product.typeId, [...acc.get(product.typeId), product]),
        new Map([], []),
      ),
  ].map(([typeId, products]) => [productTypes.find((type) => type.id === typeId), products]);

  const discountInfo = record.discounts.map((id) =>
    discounts.find((discount) => discount.discountId === id),
  );

  const editRecord = () => {
    dialog.showNewSaleDialog(record);
    onClose();
  };
  const title = (
    <>
      <Link onClick={editRecord}>
        <Icon className={S.editIcon} name="edit" />
      </Link>{" "}
      {l`Sale`}
    </>
  );

  return (
    <SecondaryCard title={title} anchor={anchor} onClose={onClose}>
      <List>
        <Item className={S.info}>
          <Font smallCaps semibold>{l`Price`}</Font>
          {record.price.toString()}
        </Item>
        <Item className={S.info}>
          <Font smallCaps semibold>{l`Time`}</Font>
          {format(record.time)}
        </Item>
      </List>
      <div className={S.info}>
        <Font smallCaps semibold>{l`Products`}</Font>
        <div className={S.rule} />
      </div>
      <div className={S.note}>
        {productInfo.map(([type, products]) => (
          <div className={S.type} key={`type_${type.id}`}>
            <div>{type.name}</div>
            <div className={S.products}>
              {products.map(({ name }, i) => (
                <span className={S.product} key={`product_${i}`}>
                  {name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      {!!discountInfo.length && (
        <>
          <div className={S.info}>
            <Font smallCaps semibold>{l`Discounts`}</Font>
            <div className={S.rule} />
          </div>
          <div className={S.note}>
            {discountInfo.map((discount, i) => (
              <div className={S.discount} key={i}>
                <div>{discount.name}</div>
                <div>
                  {discount.flatAmount
                    ? discount.flatAmount.toString()
                    : `${discount.percentageAmount}%`}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <div className={S.info}>
        <Font smallCaps semibold>{l`Note`}</Font>
        <div className={S.rule} />
      </div>
      <div className={S.note}>
        {record.info || <span className={S.placeholder}>{l`Nothing to say...`}</span>}
      </div>
    </SecondaryCard>
  );
}
