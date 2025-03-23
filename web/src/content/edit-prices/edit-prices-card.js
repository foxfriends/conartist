/*       */
import * as React from "react";
import { l } from "../../localization";
import { Card } from "../card-view/card";
import { BasicHeader } from "../card-view/basic-header";
import { Input } from "../../common/input";
import { AutoList as List } from "../../common/list/auto";
import { Item } from "../../common/list/item";
import { IconButton } from "../../common/icon-button";
import { Select } from "../../common/select";
import { scrollIdentifier } from "../../update/navigate";
import { INVALID, VALID } from "../../model/validation";
import { by, Asc, Desc } from "../../util/sort";
import { Money } from "../../model/money";
import {
  DuplicateQuantity,
  NonNumberQuantity,
  NonIntegerQuantity,
  NegativeQuantity,
  NonNumberPrice,
  NegativePrice,
} from "./schema";

import S from "./index.css";
const { Fragment } = React;

function quantityValidation(validation) {
  if (validation.state !== INVALID) {
    return validation;
  }
  switch (validation.error) {
    case DuplicateQuantity:
      return { state: INVALID, error: l`This quantity is set twice!` };
    case NonNumberQuantity:
      return { state: INVALID, error: l`This isn't a number!` };
    case NonIntegerQuantity:
      return { state: INVALID, error: l`This has to be a whole number!` };
    case NegativeQuantity:
      return { state: INVALID, error: l`You can't sell none!` };
    default:
      return { state: VALID };
  }
}

function priceValidation(validation) {
  if (validation.state !== INVALID) {
    return validation;
  }
  switch (validation.error) {
    case NonNumberPrice:
      return { state: INVALID, error: l`This isn't a number!` };
    case NegativePrice:
      return { state: INVALID, error: l`You can charge more than that!` };
    default:
      return { state: VALID };
  }
}

export function EditPricesCard({
  productType,
  products,
  prices,
  bottomAction,
  onPriceChange,
  onProductChange,
  onQuantityChange,
  onPriceRemove,
}) {
  const productIds = [null, ...products.map(({ id }) => id)];
  const dataSource = prices.map((price) =>
    price.productId === null
      ? [price, null]
      : [price, products.find((product) => product.id === price.productId)],
  );
  return (
    <Card
      id={scrollIdentifier("product-type", productType.id)}
      collapsible={true}
      bottomAction={bottomAction}
    >
      <BasicHeader>{productType.name}</BasicHeader>
      <Fragment>
        <List dataSource={dataSource}>
          <div className={S.placeholder}>{l`How much do these cost?`}</div>
          {([price, product], _) => (
            <Item key={`price_${price.id}`}>
              <Select
                options={productIds}
                defaultValue={price.productId}
                onChange={(productId) => onProductChange(price.id, productId)}
                className={S.productName}
              >
                {(productId) => {
                  const product = products.find(({ id }) => id === productId);
                  return product ? (
                    product.name
                  ) : (
                    <span className={S.any}>{l`Any`}</span>
                  );
                }}
              </Select>
              <Input
                defaultValue={`${price.quantity === 0 ? "" : price.quantity}`}
                placeholder={l`How many`}
                onChange={(quantity) => onQuantityChange(price.id, quantity)}
                className={S.priceQuantity}
                validation={quantityValidation(price.quantityValidation)}
              />
              <Input
                defaultValue={`${!price.price || price.price.equals(Money.zero) ? "" : price.price.toString()}`}
                placeholder={l`Price`}
                onChange={(priceStr) => onPriceChange(price.id, priceStr)}
                className={S.pricePrice}
                validation={priceValidation(price.priceValidation)}
              />
              <IconButton
                title="remove_circle_outline"
                action={() => onPriceRemove(price.id)}
                className={S.removeButton}
              />
            </Item>
          )}
        </List>
      </Fragment>
    </Card>
  );
}
