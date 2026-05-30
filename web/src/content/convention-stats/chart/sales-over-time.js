import React, { useRef, useState } from "react";
import { Scatter } from "react-chartjs-2";
import { startOfDay, addDays, format } from "date-fns";

import Map from "../../../util/default-map";
import { ChartCard } from "./card";
import { NotEnoughData } from "./not-enough-data";
import { SecondaryCard } from "../../card-view/secondary-card";
import { Select } from "../../../common/select";
import { l, localize } from "../../../localization";
import { Money } from "../../../model/money";
import { model } from "../../../model";
import S from "./chart.css";

const colors = [
  "#8bc2ae",
  "#9c63c6",
  "#dbc0a4",
  "#8293d4",
  "#e4aaa0",
  "#d2a1dd",
  "#9cd0b4",
];

function splitByDays(items) {
  if (!items.length) {
    return [];
  }

  const days = [];
  let day = [];
  let currentDay = startOfDay(items[0].time).valueOf();

  for (const item of items) {
    if (startOfDay(item.time).valueOf() === currentDay) {
      day.push(item);
    } else {
      currentDay = startOfDay(item.time).valueOf();
      days.push(day);
      day = [item];
    }
  }

  days.push(day);
  return days;
}

function dailyTotals(data) {
  if (!data.length) {
    return [];
  }
  const startPrice = (data[0] || {}).price || Money.zero;
  const startQuantity = (data[0] || {}).quantity || 0;
  return data.map(({ time, price, quantity }) => ({
    time,
    price: price.add(startPrice.negate()),
    quantity: quantity - startQuantity,
  }));
}

function deltas(data) {
  return data.map(({ time, price }, i, arr) => ({
    time,
    price: price.add(((arr[i - 1] || {}).price || Money.zero).negate()),
    quantity: 1,
  }));
}

function averages(grouping = 1) {
  const minutes = Math.max(Math.abs(grouping), 1) * 1000 * 60;
  return (data) => {
    const buckets = [];
    let bucket = { time: 0, count: 0, total: Money.zero };
    for (const item of data) {
      if (!bucket.time) {
        bucket.time = item.time.getTime() + minutes / 2;
      }

      const fitsInBucket =
        Math.abs(item.time.getTime() - bucket.time) <= minutes / 2;

      if (fitsInBucket) {
        bucket.count += 1;
        bucket.total = bucket.total.add(item.price);
      } else {
        buckets.push(bucket);
        bucket = {
          time: item.time.getTime() + minutes / 2,
          count: 1,
          total: item.price,
        };
      }
    }

    buckets.push(bucket);

    if (buckets.length) {
      const first = buckets[0].time - minutes;
      const last = buckets[buckets.length - 1].time + minutes;
      const averaged = buckets.map(({ time, count, total }) => ({
        time: new Date(time),
        price: total.multiply(1 / count),
        quantity: count,
      }));
      return [
        { time: new Date(first), price: Money.zero, quantity: 0 },
        ...averaged,
        { time: new Date(last), price: Money.zero, quantity: 0 },
      ];
    } else {
      return [];
    }
  };
}

export function SalesOverTimeChart({ records, showSettings }) {
  const ref = useRef();
  const [mode, setMode] = useState("Average");
  const [metric, setMetric] = useState("Customers");
  const [grouping, setGrouping] = useState(30);

  const dates = Array.from(
    new Set(records.map(({ time }) => startOfDay(time).getTime())),
  )
    .sort()
    .map((time) => new Date(time));
  const days = dates.map((date) => format(date, l`EEE`));

  const acc = [];
  for (const { time, price, quantity } of records) {
    acc.push({
      time,
      price: price.add(acc[acc.length - 1]?.price ?? Money.zero),
      quantity: 1 + (acc[acc.length - 1]?.quantity ?? 0),
    });
  }
  const totalOverTime = splitByDays(acc);

  let daysData;
  switch (mode) {
    case "Total":
      daysData = totalOverTime.map(dailyTotals);
      break;
    case "Average":
      daysData = totalOverTime
        .map(dailyTotals)
        .map(deltas)
        .map(averages(grouping));
      break;
    default:
      break;
  }

  const data = {
    datasets: daysData.map((data, i) => ({
      fill: false,
      label: days[i],
      borderColor: colors[i % 7],
      backgroundColor: colors[i % 7],
      showLine: true,
      data: data.map(({ time, price, quantity }) => ({
        x: time.getTime(),
        y: metric === "Money" ? price.amount : quantity,
      })),
    })),
  };

  const options = {
    plugins: {
      tooltip: {
        callbacks: {
          title: ([ctx]) => format(new Date(ctx.raw.x), l`h:mma`),
          label: (ctx) =>
            metric === "Money"
              ? new Money(model.getValue().settings.currency, ctx.raw.y)
              : ctx.raw.y,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          callback: (label) => format(new Date(label), l`h:mma`),
        },
        title: {
          display: true,
          text: l`Time`,
        },
      },
      y: {
        ticks: {
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
      title={l`Sales Over Time`}
      showSettings={showSettings}
      innerRef={(card) => (ref.current = card)}
    >
      <div className={S.container}>
        {records.length > 1 && (
          <Scatter data={data} width={600} height={600} options={options} />
        )}
        {records.length <= 1 && <NotEnoughData />}
      </div>
      <SecondaryCard
        anchor={ref}
        title={l`Options`}
        onClose={() => showSettings(null)}
      >
        <div className={S.options}>
          <Select
            title={l`Mode`}
            options={["Average", "Total"]}
            defaultValue={mode}
            onChange={(mode) => setMode(mode)}
          >
            {localize}
          </Select>
          <Select
            title={l`Metric`}
            options={["Customers", "Money"]}
            defaultValue={metric}
            onChange={(metric) => setMetric(metric)}
          >
            {localize}
          </Select>
          <Select
            title={l`Grouping`}
            options={[5, 10, 15, 30, 60, 120]}
            defaultValue={grouping}
            onChange={(grouping) => setGrouping(grouping)}
          >
            {(minutes) => l`${minutes} minutes`}
          </Select>
        </div>
      </SecondaryCard>
    </ChartCard>
  );
}
