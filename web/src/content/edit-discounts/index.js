import * as React from "react";
import * as ReactX from "../../react-ext";
import { forkJoin, merge, of } from "rxjs";
import {
  tap,
  filter,
  map,
  mapTo,
  switchMap,
  takeUntil,
  share,
  partition,
  defaultIfEmpty,
} from "rxjs/operators";

import DefaultMap from "../../util/default-map";
import Set from "../../util/set";
import { by, Asc } from "../../util/sort";
import { Cover } from "../../common/cover";
import { EditDiscountsCard } from "./edit-discounts-card";
import { events, SaveDiscounts } from "../../event";
import { SaveDiscount } from "../../api/save-discount";
import { batchResponses } from "../../api/util";
import { status as toolbarStatus } from "../../toolbar";
import * as toolbarAction from "../../toolbar/action";
import * as navigate from "../../update/navigate";
import * as update from "../../update/edit-discounts";
import {
  discountId,
  editableDiscount,
  hasher,
  DuplicateName,
  NonNumberAmount,
  NonPositiveAmount,
} from "./schema";
import { VALID, INVALID, EMPTY } from "../../model/validation";
import { Money } from "../../model/money";

const { Fragment } = React;

const defaultToolbar = {
  primary: toolbarAction.SaveDiscounts,
  secondary: toolbarAction.DiscardDiscounts,
};

function enableSave() {
  toolbarStatus.next(defaultToolbar);
}

function disableSave() {
  toolbarStatus.next({
    ...defaultToolbar,
    primary: { ...defaultToolbar.primary, enabled: false },
  });
}

function diff(before, after) {
  const initial = new Map();
  before.forEach((discount) => initial.set(hasher(discount), discount));

  const final = new Map();
  after.forEach((discount) => final.set(hasher(discount), discount));

  const deleted = new Set(initial.keys()).difference(final.keys());
  const changed = new Set(
    Array.from(final)
      .filter(([key, value]) => {
        const base = initial.get(key);
        if (!base) return true;
        if (base.productIds.length !== value.productIds.length) return true;
        if (!base.productIds.every((id) => value.productIds.contains(id)))
          return true;
        if (base.productTypeIds.length !== value.productTypeIds.length)
          return true;
        if (
          !base.productTypeIds.every((id) => value.productTypeIds.contains(id))
        )
          return true;
        if (base.flatAmount === null && value.flatAmount === null) {
          return base.percentageAmount === value.percentageAmount;
        }
        if (base.flatAmount === null || value.flatAmount === null) return true;
        return !base.flatAmount.equals(value.flatAmount);
      })
      .map(([key, _]) => key),
  );
  const kept = new Set(initial.keys()).intersection(final.keys());
  const unchanged = kept.difference(changed);
  const keeps = [...unchanged].map((key) => initial.get(key));
  const deletes = [...deleted]
    .map((key) => initial.get(key))
    .map((discount) => ({ operation: "delete", discount }));
  const adds = [...changed]
    .map((key) => final.get(key))
    .map((discount) => ({ operation: "add", discount }));
  return [keeps, [].concat(deletes, adds)];
}

export class EditDiscounts extends ReactX.Component {
  static getDerivedStateFromProps({ discounts }, state) {
    if (!state || !state.hadDiscounts) {
      return {
        discounts: discounts.map(editableDiscount),
        hadDiscounts: discounts.length != 0,
      };
    } else {
      return null;
    }
  }

  constructor(props) {
    super(props);

    toolbarStatus.next(defaultToolbar);

    this.state = {
      discounts: this.props.discounts.map(editableDiscount),
      editingEnabled: true,
      hadDiscounts: this.props.discounts.length != 0,
    };

    const saveButtonPressed = events.pipe(
      takeUntil(this.unmounted),
      filter((event) => event === SaveDiscounts),
      share(),
    );

    const [savedDiscounts, savingDiscounts] = saveButtonPressed.pipe(
      map(() => diff(this.props.discounts, this.state.discounts)),
      switchMap(([discounts, changes]) =>
        forkJoin(
          of(discounts),
          forkJoin(
            ...changes.map((discount) => new SaveDiscount().send(discount)),
          ).pipe(defaultIfEmpty([])),
        ),
      ),
      map(([discounts, changes]) => [discounts, batchResponses(changes)]),
      share(),
      partition(([_, { state }]) => state === "retrieved"),
    );

    savedDiscounts
      .pipe(
        map(([discounts, { value: changed }]) =>
          [].concat(
            discounts,
            changed.filter((discount) => discount),
          ),
        ),
        tap((discounts) => update.setDiscounts(discounts)),
      )
      .subscribe(() => navigate.discounts());

    const saveFailed = savingDiscounts.pipe(
      map(([_, response]) => response),
      filter(({ state }) => state === "failed"),
    );

    const enabled = merge(
      saveButtonPressed.pipe(mapTo(false)),
      saveFailed.pipe(mapTo(true)),
    ).pipe(share());

    enabled.subscribe((editingEnabled) => this.setState({ editingEnabled }));

    enabled
      .pipe(
        map((enabled) => ({
          ...defaultToolbar,
          primary: { ...defaultToolbar.primary, enabled },
        })),
      )
      .subscribe((status) => toolbarStatus.next(status));
  }

  handleAmountTypeChange(id, type) {
    const discounts = this.state.discounts.map((discount) =>
      discount.discountId === id
        ? {
            ...discount,
            percentageAmount:
              type === "Percentage" ? (discount.percentageAmount ?? 0) : null,
            flatAmount:
              type === "Flat" ? (discount.flatAmount ?? Money.zero) : null,
          }
        : discount,
    );

    this.setState({ discounts: this.validate(discounts) });
  }

  handleAmountChange(id, amount) {
    const discount = this.state.discounts.find(
      (discount) => discount.discountId === id,
    );
    console.log(this.state.discounts, id, discount);
    if (discount.percentageAmount !== null) {
      this.handlePercentageAmountChange(id, amount);
    } else {
      this.handleFlatAmountChange(id, amount);
    }
  }

  handlePercentageAmountChange(id, percentageAmount) {
    const discounts = this.state.discounts.map((discount) =>
      discount.discountId === id
        ? { ...discount, percentageAmount: Number(percentageAmount) }
        : discount,
    );

    this.setState({ discounts: this.validate(discounts) });
  }

  handleFlatAmountChange(id, newAmount) {
    let money = null;
    if (newAmount) {
      try {
        money = Money.parse(newAmount);
      } catch (_) {}
    }

    const discounts = this.state.discounts.map((discount) =>
      discount.discountId === id
        ? { ...discount, flatAmount: money }
        : discount,
    );

    this.setState({ discounts: this.validate(discounts) });
  }

  handleNameChange(id, name) {
    const discounts = this.state.discounts.map((discount) =>
      discount.discountId === id ? { ...discount, name } : discount,
    );

    this.setState({ discounts: this.validate(discounts) });
  }

  handleRemoveDiscount(id) {
    const discounts = this.state.discounts.filter(
      (discount) => discount.discountId !== id,
    );
    this.setState({ discounts: this.validate(discounts) });
  }

  createDiscount() {
    const newDiscount = {
      original: null,
      discountId: discountId(),
      nameValidation: { state: EMPTY },
      amountValidation: { state: EMPTY },
      productTypeIds: [],
      productIds: [],
      name: "",
      flatAmount: Money.zero,
      percentageAmount: null,
    };
    const discounts = [...this.state.discounts, newDiscount];
    this.setState({ discounts, hadDiscounts: true });
    disableSave();
  }

  validate(discounts) {
    const existingDiscounts = new DefaultMap([], 0);
    discounts
      .map(hasher)
      .forEach((hash) =>
        existingDiscounts.set(hash, existingDiscounts.get(hash) + 1),
      );

    enableSave();
    return discounts.map((discount) => {
      let nameValidation = { state: VALID };
      let amountValidation = { state: VALID };
      let percentageAmountValidation = { state: VALID };
      if (discount.flatAmount === null && discount.percentageAmount === null) {
        amountValidation = { state: INVALID, error: MissingAmount };
      } else if (discount.percentageAmount !== null) {
        if (isNaN(discount.percentageAmount)) {
          amountValidation = { state: INVALID, error: NonNumberAmount };
        } else if (discount.percentageAmount <= 0) {
          amountValidation = { state: INVALID, error: NonPositiveAmount };
        }
      } else if (discount.flatAmount !== null) {
        if (!discount.flatAmount) {
          amountValidation = { state: INVALID, error: NonNumberAmount };
        } else if (discount.flatAmount.amount <= 0) {
          amountValidation = { state: INVALID, error: NonPositiveAmount };
        }
      }
      if (existingDiscounts.get(hasher(discount)) > 1) {
        nameValidation = { state: INVALID, error: DuplicateName };
      }
      if (
        amountValidation.state === INVALID ||
        nameValidation.state === INVALID
      ) {
        disableSave();
      }
      return { ...discount, nameValidation, amountValidation };
    });
  }

  render() {
    const { discounts, editingEnabled } = this.state;
    const { products, productTypes } = this.props;

    return (
      <Fragment>
        <EditDiscountsCard
          products={products}
          productTypes={productTypes}
          discounts={discounts}
          bottomAction={{
            title: "add",
            action: () => this.createDiscount(),
          }}
          onAmountTypeChange={(discountId, type) =>
            this.handleAmountTypeChange(discountId, type)
          }
          onAmountChange={(discountId, amount) =>
            this.handleAmountChange(discountId, amount)
          }
          onNameChange={(discountId, name) =>
            this.handleNameChange(discountId, name)
          }
          onRemoveDiscount={(discountId) =>
            this.handleRemoveDiscount(discountId)
          }
        />
        {editingEnabled ? null : <Cover />}
      </Fragment>
    );
  }
}
