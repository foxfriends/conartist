import React, { Suspense, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import Map from "../../../util/default-map";
import { ChartCard } from "./card";
import { NotEnoughData } from "./not-enough-data";
import { SecondaryCard } from "../../card-view/secondary-card";
import { Select } from "../../../common/select";
import { Checkbox } from "../../../common/checkbox";
import { l } from "../../../localization";

import S from "./chart.css";

export function InventoryChart({
  productTypes,
  products,
  records,
  showSettings,
}) {
  const ref = useRef();
  const [type, setType] = useState(null);
  const [onlySold, setOnlySold] = useState(true);

  const sold = records
    .flatMap(({ products }) => products)
    .reduce(
      (acc, productId) => acc.set(productId, acc.get(productId) + 1),
      new Map([], 0),
    );

  let selectedProducts = products;
  if (type !== null) {
    selectedProducts = selectedProducts.filter(({ typeId }) => typeId === type);
  }
  if (onlySold) {
    selectedProducts = selectedProducts.filter(
      ({ id }) => (sold.get(id) || 0) > 0,
    );
  }

  const types = Array.from(
    new Set(products.map(({ typeId }) => typeId)),
  ).filter((id) => !productTypes.find((pt) => pt.id === id).discontinued);

  const data = {
    labels: selectedProducts.map(({ name }) => name),
    datasets: [
      {
        label: l`Sold`,
        xAxisId: "sold",
        backgroundColor: "#b52b2b",
        data: selectedProducts.map(({ id }) => sold.get(id)),
      },
      {
        label: l`Remaining`,
        xAxisId: "remaining",
        backgroundColor: "#3E803E",
        data: selectedProducts.map(({ id, quantity }) =>
          Math.max(0, quantity - sold.get(id)),
        ),
      },
    ],
  };

  const options = {
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
  };

  return (
    <ChartCard
      title={l`Inventory`}
      showSettings={showSettings}
      innerRef={(card) => (ref.current = card)}
    >
      <>
        <Bar data={data} width={600} height={600} options={options} />
        {selectedProducts.length === 0 ? <NotEnoughData /> : null}
      </>
      <SecondaryCard
        anchor={ref}
        title={l`Options`}
        onClose={() => showSettings(null)}
      >
        <div className={S.options}>
          <Select
            title={l`Filter types`}
            options={[null, ...types]}
            defaultValue={type}
            onChange={(type) => setType(type)}
          >
            {(typeId) => {
              const productType = productTypes.find(({ id }) => id === typeId);
              return productType ? (
                productType.name
              ) : (
                <span className={S.any}>{l`Any`}</span>
              );
            }}
          </Select>

          <div className="">
            <Checkbox
              defaultValue={onlySold}
              value={onlySold}
              onChange={(onlySold) => setOnlySold(onlySold)}
            >
              {l`Show sold products only`}
            </Checkbox>
          </div>
        </div>
      </SecondaryCard>
    </ChartCard>
  );
}
