/*       */
import * as React from "react";

import Map from "../../../util/default-map";
import { calculatePrice } from "../../../util/calculate-price";
import { ChartCard } from "./card";
import { ChartsLoading } from "./charts-loading";
import { NotEnoughData } from "./not-enough-data";
import { SecondaryCard } from "../../card-view/secondary-card";
import { Select } from "../../../common/select";
import { l, localize } from "../../../localization";
import { Money } from "../../../model/money";
import { model } from "../../../model";

import S from "./chart.css";

const Bar = React.lazy(
  () => import(/* webpackChunkName: "chart" */ "./lazy/bar"),
);
const { Suspense } = React;

export class SalesByTypeChart extends React.Component {
  // $FlowIgnore
  ref;
  constructor(props) {
    super(props);
    // $FlowIgnore
    this.ref = { current: null };
    this.state = {
      metric: "Quantity",
    };
  }

  render() {
    const { products, productTypes, records, prices, showSettings } =
      this.props;
    const { metric } = this.state;

    const count = new Map([], 0);
    switch (metric) {
      case "Quantity": {
        const typeIds = []
          .concat(...records.map(({ products }) => products))
          .map((productId) => products.find(({ id }) => id === productId))
          .filter((x) => x)
          // $FlowIgnore
          .map(({ typeId }) => typeId);
        for (const typeId of typeIds) {
          count.set(typeId, count.get(typeId) + 1);
        }
        break;
      }
      case "Money": {
        const moneyPerType = records.reduce(
          (types, { id, products: sold, price }) => {
            const soldProducts = sold
              .map((product) => products.find(({ id }) => id === product))
              .filter((x) => x);
            // $FlowIgnore
            const totalPrice = calculatePrice(soldProducts, prices);
            const ratio = price.amount / (totalPrice.amount || 1);
            const productsByType = soldProducts.reduce(
              (types, product) =>
                types.set(product.typeId, [
                  ...types.get(product.typeId),
                  product,
                ]),
              new Map([], []),
            );
            const pricesByType = [...productsByType].map(
              ([typeId, soldProducts]) => {
                const priceForType = calculatePrice(soldProducts, prices);
                return [typeId, priceForType.multiply(ratio)];
              },
            );
            const uncountedMoney = [...pricesByType].reduce(
              (total, [, price]) => total.add(price.negate()),
              price,
            );
            const uncountedProducts = [...pricesByType].reduce(
              (total, [productType]) =>
                total + productsByType.get(productType).length,
              0,
            );
            for (const [typeId, price] of pricesByType) {
              if (price.amount === 0) {
                const numberOfProducts = productsByType.get(typeId).length;
                const moneyForProduct = uncountedMoney
                  .multiply(1 / uncountedProducts)
                  .multiply(numberOfProducts);
                types.set(typeId, types.get(typeId).add(moneyForProduct));
              } else {
                types.set(typeId, types.get(typeId).add(price));
              }
            }
            return types;
          },
          new Map([], Money.zero),
        );
        for (const [type, money] of moneyPerType) {
          count.set(type, money.amount);
        }
        break;
      }
      case "Customers": {
        const typeSets = records
          .map(({ products }) => products)
          .map((productIds) =>
            productIds.map((productId) =>
              products.find(({ id }) => id === productId),
            ),
          )
          // $FlowIgnore
          .map(
            (products) =>
              new Set(products.filter((x) => x).map(({ typeId }) => typeId)),
          );
        for (const typeSet of typeSets) {
          for (const typeId of typeSet) {
            count.set(typeId, count.get(typeId) + 1);
          }
        }
        break;
      }
    }

    const data = {
      labels: productTypes.map(({ name }) => name),
      datasets: [
        {
          backgroundColor: productTypes.map(
            ({ color }) =>
              `#${(color || 0xffffff).toString(16).padStart(6, "0")}`,
          ),
          data: productTypes.map(({ id }) => count.get(id)),
        },
      ],
    };

    const options = {
      legend: {
        display: false,
      },
      tooltips: {
        callbacks: {
          label: ({ yLabel }) => {
            if (metric === "Money") {
              return new Money(model.getValue().settings.currency, yLabel);
            } else {
              return yLabel;
            }
          },
        },
      },
      scales: {
        yAxes: [
          {
            ticks: {
              callback: (label) => {
                if (metric === "Money") {
                  return new Money(model.getValue().settings.currency, label);
                } else {
                  return label;
                }
              },
            },
            scaleLabel: {
              display: true,
              labelString: localize(metric),
            },
          },
        ],
      },
    };

    return (
      <ChartCard
        title={l`Sales By Type`}
        showSettings={showSettings}
        innerRef={(card) => (this.ref.current = card)}
      >
        <>
          <Suspense fallback={<ChartsLoading />}>
            <Bar data={data} width={600} height={600} options={options} />
          </Suspense>
          {records.length === 0 || productTypes.length === 0 ? (
            <NotEnoughData />
          ) : null}
        </>
        <SecondaryCard
          anchor={this.ref}
          title={l`Options`}
          onClose={() => showSettings(null)}
        >
          <div className={S.options}>
            <Select
              title={l`Metric`}
              options={["Quantity", "Money", "Customers"]}
              defaultValue={metric}
              onChange={(metric) => this.setState({ metric })}
            >
              {localize}
            </Select>
          </div>
        </SecondaryCard>
      </ChartCard>
    );
  }
}
