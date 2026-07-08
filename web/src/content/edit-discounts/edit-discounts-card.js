import * as React from "react";
import { l } from "../../localization";
import { Card } from "../card-view/card";
import { BasicHeader } from "../card-view/basic-header";
import { Input } from "../../common/input";
import { AutoList as List } from "../../common/list/auto";
import { Item } from "../../common/list/item";
import { IconButton } from "../../common/icon-button";
import { Select } from "../../common/select";
import { INVALID, VALID } from "../../model/validation";
import { Money } from "../../model/money";
import { DuplicateName, NonNumberAmount, NonPositiveAmount } from "./schema";

import S from "./index.css";
const { Fragment } = React;

function nameValidation(validation) {
  if (validation.state !== INVALID) {
    return validation;
  }
  switch (validation.error) {
    case DuplicateName:
      return { state: INVALID, error: l`This name is used twice!` };
    default:
      return { state: VALID };
  }
}

function amountValidation(validation) {
  if (validation.state !== INVALID) {
    return validation;
  }
  switch (validation.error) {
    case NonNumberAmount:
      return { state: INVALID, error: l`This isn't a number!` };
    case NonPositiveAmount:
      return { state: INVALID, error: l`The discount must be more than 0` };
    default:
      return { state: VALID };
  }
}

export function EditDiscountsCard({
  discounts,
  bottomAction,
  onAmountChange,
  onAmountTypeChange,
  onNameChange,
  onRemoveDiscount,
}) {
  return (
    <Card bottomAction={bottomAction}>
      <BasicHeader>{l`Discounts`}</BasicHeader>
      <Fragment>
        <List dataSource={discounts}>
          <div className={S.placeholder}>{l`<Empty discounts list message>`}</div>
          {(discount, _) => (
            <Item key={discount.discountId}>
              <Input
                defaultValue={discount.name}
                placeholder={l`Name`}
                onChange={(name) => onNameChange(discount.discountId, name)}
                className={S.name}
                validation={nameValidation(discount.nameValidation)}
              />
              <Select
                options={["Flat", "Percentage"]}
                defaultValue={discount.percentageAmount === null ? "Flat" : "Percentage"}
                onChange={(value) => onAmountTypeChange(discount.discountId, value)}
                className={S.amountType}
              >
                {(type) => <>{l([type])}</>}
              </Select>
              <Input
                defaultValue={
                  discount.percentageAmount?.toString() ??
                  (discount.flatAmount && !discount.flatAmount.equals(Money.zero)
                    ? discount.flatAmount.toString()
                    : "")
                }
                placeholder={l`Amount`}
                onChange={(amount) => onAmountChange(discount.discountId, amount)}
                className={S.amount}
                validation={amountValidation(discount.amountValidation)}
                key={discount.flatAmount === null}
              />
              <IconButton
                title="remove_circle_outline"
                action={() => onRemoveDiscount(discount.discountId)}
                className={S.removeButton}
              />
            </Item>
          )}
        </List>
      </Fragment>
    </Card>
  );
}
