import React, { useRef, useState } from "react";
import { Bar } from "react-chartjs-2";

import Map from "../../../util/default-map";
import { calculatePrice } from "../../../util/calculate-price";
import { ChartCard } from "./card";
import { NotEnoughData } from "./not-enough-data";
import { SecondaryCard } from "../../card-view/secondary-card";
import { Select } from "../../../common/select";
import { l, localize } from "../../../localization";
import { Money } from "../../../model/money";
import { model } from "../../../model";

import S from "./chart.css";

export function SalesByTypeChart({
  products,
  productTypes,
  records,
  prices,
  showSettings,
}) {
  const [metric, setMetric] = useState("Quantity");
  const ref = useRef();

  const count = new Map([], 0);
  switch (metric) {
    case "Quantity": {
      const typeIds = []
        .concat(...records.map(({ products }) => products))
        .map((productId) => products.find(({ id }) => id === productId))
        .filter((x) => x)
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
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: ({ yLabel }) =>
            metric === "Money"
              ? new Money(model.getValue().settings.currency, yLabel)
              : yLabel,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          min: 0,
          callback: (label) =>
            metric === "Money"
              ? new Money(model.getValue().settings.currency, label)
              : label,
        },
        title: {
          display: true,
          text: localize(metric),
        },
      },
    },
  };

  return (
    <ChartCard
      title={l`Sales By Type`}
      showSettings={showSettings}
      innerRef={(card) => (ref.current = card)}
    >
      <>
        <Bar data={data} width={600} height={600} options={options} />
        {records.length === 0 || productTypes.length === 0 ? (
          <NotEnoughData />
        ) : null}
      </>
      <SecondaryCard
        anchor={ref}
        title={l`Options`}
        onClose={() => showSettings(null)}
      >
        <div className={S.options}>
          <Select
            title={l`Metric`}
            options={["Quantity", "Money", "Customers"]}
            defaultValue={metric}
            onChange={setMetric}
          >
            {localize}
          </Select>
        </div>
      </SecondaryCard>
    </ChartCard>
  );
}
