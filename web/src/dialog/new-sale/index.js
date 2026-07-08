import * as React from "react";
import { Basic } from "../basic";
import { Input } from "../../common/input";
import { Link } from "../../common/link";
import { Textarea } from "../../common/textarea";
import { Tooltip } from "../../common/tooltip";
import { Icon } from "../../common/icon";
import { AutoList as List } from "../../common/list/auto";
import { Item } from "../../common/list/item";
import { l } from "../../localization";
import { closeDialog as closeDialogButton } from "../action";
import { closeDialog } from "../../update/dialog";
import { loadConvention, loadUser } from "../../update/helpers";
import { loadSales } from "../../update/sales";
import { SaveRecord } from "../../api/save-record";
import { Money } from "../../model/money";
import { INVALID, VALID } from "../../model/validation";
import DefaultMap from "../../util/default-map";
import { by, Asc } from "../../util/sort";
import * as toast from "../../toast";
import S from "./index.css";
import { IconButton } from "../../common/icon-button";

export class NewSale extends React.Component {
  constructor(props) {
    super(props);

    const { products, discounts, record } = this.props;

    let moneyValidation = { state: VALID };
    if (record) {
      try {
        Money.parse(record.price.toString());
      } catch (error) {
        moneyValidation = { state: INVALID, error: l`The price is invalid` };
      }
    }

    this.state = {
      products: record
        ? record.products
            .map((id) => products.find((product) => product.id === id))
            .filter((x) => x)
        : [],
      amount: record ? record.price.toString() : Money.zero.toString(),
      discounts: record
        ? record.discounts
            .map((id) => discounts.find((discounts) => discounts.discountId === id))
            .filter((x) => x)
        : [],
      note: record ? record.info : "",
      processing: false,
      productType: null,
      // NOTE: if there are discounts, it likely not a manual price, as they are generally not allowed
      // to have discounts if there's a price override
      manualPrice: record ? record.discounts?.length === 0 : false,
      showDiscounts: false,
      priceKey: 0,
      moneyValidation,
      edited: false,
    };
  }

  setAmount(amount) {
    let moneyValidation = { state: VALID };
    if (!amount) {
      amount = this.calculatePrice().toString();
      // HACK: have to check validity here in the case of a different currency set in the price than
      // in the user's settings
      // TODO: instead of storing the price as a string, it should be stored as Money to avoid this
      // problem
      try {
        Money.parse(amount);
      } catch (error) {
        moneyValidation = { state: INVALID, error: l`The price is invalid` };
      }
      this.setState({
        amount,
        moneyValidation,
        manualPrice: false,
        priceKey: this.state.manualPrice ? this.state.priceKey + 1 : this.state.priceKey,
        edited: true,
      });
    } else {
      try {
        Money.parse(amount);
      } catch (error) {
        moneyValidation = { state: INVALID, error: l`The price is invalid` };
      }
      this.setState({
        amount,
        moneyValidation,
        discounts: [],
        manualPrice: true,
        edited: true,
      });
    }
  }

  removeProduct({ id }) {
    const { products } = this.state;
    this.setState(
      {
        products: products.filter((product) => product.id !== id),
        edited: true,
      },
      () => {
        if (!this.state.manualPrice) {
          this.setState({ amount: this.calculatePrice().toString() });
        }
      },
    );
  }

  addProduct(product) {
    const { products } = this.state;
    this.setState(
      {
        products: [...products, product],
        edited: true,
      },
      () => {
        if (!this.state.manualPrice) {
          this.setAmount();
        }
      },
    );
  }

  addDiscount(discount) {
    const { discounts } = this.state;
    this.setState(
      {
        discounts: [...discounts, discount],
        edited: true,
      },
      () => this.setAmount(),
    );
  }

  removeDiscount({ discountId }) {
    const { discounts } = this.state;
    this.setState(
      {
        discounts: discounts.filter((discount) => discount.discountId !== discountId),
        edited: true,
      },
      () => this.setAmount(),
    );
  }

  calculatePrice() {
    const { prices, discounts } = this.props;
    const { products, discounts: discountsApplied } = this.state;
    if (prices.count === 0) return Money.zero; // can't calculate anything
    const matters = new Set(prices.map((price) => price.productId).filter((product) => !!product));
    const items = products.reduce((counts, product) => {
      if (matters.has(product.id)) {
        const key = `p${product.id}`;
        counts.set(key, counts.get(key) + 1);
      } else {
        const key = `t${product.typeId}`;
        counts.set(key, counts.get(key) + 1);
      }
      return counts;
    }, new DefaultMap([], 0));

    const newPrice = [...items.entries()].reduce((price, [key, count]) => {
      const relevantPrices = prices
        .filter(
          (price) =>
            (price.productId && key === `p${price.productId}`) ||
            (!price.productId && key === `t${price.typeId}`),
        )
        .sort(by(["quantity", Asc]));
      var newPrice = price;

      const discountFactor = discountsApplied
        .filter((discount) => discount.percentageAmount)
        .filter(
          (discount) =>
            // Discounts that apply to this current price key:
            discount.productTypeIds.map((t) => `t${t}`).includes(key) ||
            discount.productIds.map((t) => `p${t}`).includes(key),
        )
        .map((discount) => discount.percentageAmount)
        .reduce((factor, percentage) => factor - factor * (percentage / 100), 1);
      while (count) {
        const price = relevantPrices.reduce((best, price) => {
          if (price.quantity <= count && (!best || price.quantity > best.quantity)) {
            return price;
          }
          return best;
        }, null);
        if (!price) return newPrice;
        count -= price.quantity;
        newPrice = newPrice.add(price.price).multiply(discountFactor);
      }
      return newPrice;
    }, Money.zero);
    const flatDiscount = discountsApplied
      .filter((discount) => !!discount.flatAmount)
      .map((discount) => discount.flatAmount)
      .reduce((total, discount) => total.add(discount), Money.zero);
    const discountFactor = discountsApplied
      .filter((discount) => discount.percentageAmount)
      .filter(
        // Discounts that apply to whole sales
        (discount) => discount.productTypeIds.length === 0 && discount.productIds.length === 0,
      )
      .map((discount) => discount.percentageAmount)
      .reduce((factor, percentage) => factor - factor * (percentage / 100), 1);
    return newPrice.add(flatDiscount.negate()).multiply(discountFactor);
  }

  async saveChanges() {
    const { record, convention: { id: conId } = {} } = this.props;
    const { products, discounts, amount, note } = this.state;
    this.setState({ processing: true });
    const productIds = products.map((product) => product.id);
    const discountIds = discounts.map((discount) => discount.discountId);
    let action;
    if (record) {
      action = {
        action: "update",
        recordId: record.id,
        products: productIds,
        discounts: discountIds,
        amount: Money.parse(amount),
        info: note,
      };
    } else {
      action = {
        action: "create",
        conId,
        products: productIds,
        discounts: discountIds,
        amount: Money.parse(amount),
        info: note,
      };
    }
    const response = await new SaveRecord().send(action).toPromise();
    if (conId) {
      try {
        await loadConvention(conId);
      } catch (_) {
        /* ignore */
      }
    } else {
      try {
        await loadSales(true);
        await loadUser();
      } catch (_) {
        /* ignore */
      }
    }
    this.setState({ processing: false });
    if (response.state === "failed") {
      toast.show(
        <>
          {l`It seems something went wrong.`} <Icon name="warning" />
        </>,
      );
    } else {
      toast.show(
        <>
          {l`Sale saved`} <Icon name="check" />
        </>,
      );
      closeDialog();
    }
  }

  async deleteSale() {
    const { record, convention: { id: conId } = {} } = this.props;
    this.setState({ processing: true });
    const action = { action: "delete", recordId: record.id };
    const response = await new SaveRecord().send(action).toPromise();
    if (conId) {
      try {
        await loadConvention(conId);
      } catch (_) {
        /* ignore */
      }
    } else {
      try {
        await loadSales(true);
        await loadUser();
      } catch (_) {
        /* ignore */
      }
    }
    this.setState({ processing: false });
    if (response.state === "failed") {
      toast.show(
        <span>
          {l`It seems something went wrong.`} <Icon name="warning" />
        </span>,
      );
    } else {
      toast.show(
        <span>
          {l`Sale deleted`} <Icon name="check" />
        </span>,
      );
      closeDialog();
    }
  }

  render() {
    const { products, productTypes, discounts, convention, record: editing } = this.props;
    const {
      products: selected,
      productType,
      discounts: discountsApplied,
      showDiscounts,
      amount,
      note,
      moneyValidation,
      processing,
      edited,
    } = this.state;
    const save = {
      enabled: selected.length > 0 && moneyValidation.state === VALID && !processing,
      title: "Save",
      action: () => this.saveChanges(),
    };

    const deleteButton = {
      enabled: !processing && !edited,
      title: "Delete",
      priority: "danger",
      action: () => this.deleteSale(),
    };

    let title = editing ? l`Editing Sale` : l`New Sale`;

    let content;

    if (productType) {
      title = (
        <>
          <span className={S.title}>
            <Link className={S.backButton} onClick={() => this.setState({ productType: null })}>
              <Icon name="keyboard_arrow_left" /> {l`Back`}
            </Link>
            {productType.name}
          </span>
        </>
      );
      content = (
        <List
          className={S.full}
          dataSource={products.filter(
            (product) => product.typeId === productType.id && !product.discontinued,
          )}
        >
          {(product) => {
            const selectedCount = selected.filter(({ id }) => product.id === id).length;
            const totalSold =
              selectedCount +
              (convention?.records
                .filter(({ id }) => !editing || id !== editing.id)
                .flatMap((record) => record.products)
                .filter((id) => id === product.id).length ?? 0);
            return (
              <Item className={S.row} onClick={() => this.addProduct(product)} key={product.id}>
                <span className={S.name}>{product.name}</span>
                {!!selectedCount && (
                  <Tooltip title={l`Remove`} className={S.tooltipContainer}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        this.removeProduct(product);
                      }}
                      className={`${S.selectedCount} ${S.removable}`}
                    >
                      {selectedCount}
                    </button>
                  </Tooltip>
                )}
                <span className={S.detail}>{Math.max(0, product.quantity - totalSold)}</span>
              </Item>
            );
          }}
        </List>
      );
    } else if (showDiscounts) {
      title = (
        <>
          <span className={S.title}>
            <Link className={S.backButton} onClick={() => this.setState({ showDiscounts: false })}>
              <Icon name="keyboard_arrow_left" /> {l`Back`}
            </Link>
            {l`Apply Discounts`}
          </span>
        </>
      );
      content = (
        <List
          className={S.full}
          dataSource={discounts.filter(
            (discount) =>
              !discount.deleted ||
              discountsApplied.some((applied) => applied.discountId === discount.discountId),
          )}
        >
          {(discount) => {
            const selectedCount = discountsApplied.filter(
              ({ discountId }) => discount.discountId === discountId,
            ).length;
            return (
              <Item
                className={S.row}
                onClick={() => this.addDiscount(discount)}
                key={discount.discountId}
              >
                <span className={S.name}>{discount.name}</span>
                {!!selectedCount && (
                  <Tooltip title={l`Remove`} className={S.tooltipContainer}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        this.removeDiscount(discount);
                      }}
                      className={`${S.selectedCount} ${S.removable}`}
                    >
                      {selectedCount}
                    </button>
                  </Tooltip>
                )}
                <span className={S.detail}>
                  {discount.flatAmount
                    ? discount.flatAmount.toString()
                    : `${discount.percentageAmount}%`}
                </span>
              </Item>
            );
          }}
        </List>
      );
    } else {
      content = (
        <>
          <List
            className={S.full}
            dataSource={productTypes.filter(({ discontinued }) => !discontinued)}
          >
            {(productType) => {
              const selectedCount = selected.filter(
                (product) => product.typeId === productType.id,
              ).length;
              return (
                <Item
                  className={S.row}
                  onClick={() => this.setState({ productType })}
                  key={productType.id}
                >
                  <span className={S.name}>{productType.name}</span>
                  {!!selectedCount && <span className={S.selectedCount}>{selectedCount}</span>}
                  <Icon className={S.detail} name="keyboard_arrow_right" />
                </Item>
              );
            }}
          </List>
          <div className={S.form}>
            <div className={S.priceContainer}>
              <Input
                key={this.state.priceKey}
                className={S.formItem}
                defaultValue={amount}
                value={amount}
                placeholder={l`Price`}
                title={l`Price`}
                onChange={(amount) => this.setAmount(amount)}
                validation={moneyValidation}
                action={
                  this.state.manualPrice
                    ? { icon: "cancel", onClick: () => this.setAmount() }
                    : undefined
                }
              />
              {!!discounts?.length && (
                <IconButton
                  enabled={!this.state.manualPrice}
                  title="discount"
                  action={() => this.setState({ showDiscounts: true })}
                />
              )}
              {discountsApplied.length > 0 && l`${discountsApplied.length} applied`}
            </div>
            <Textarea
              className={S.full}
              defaultValue={note}
              placeholder={l`Note`}
              onChange={(note) => this.setState({ note, edited: true })}
            />
          </div>
        </>
      );
    }

    return (
      <Basic
        title={title}
        onClose={closeDialogButton}
        onBack={editing && !productType && !showDiscounts ? deleteButton : null}
        onContinue={productType || showDiscounts ? null : save}
      >
        <div className={S.body}>{content}</div>
      </Basic>
    );
  }
}

export default NewSale;
