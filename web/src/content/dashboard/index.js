import * as React from "react";
import { model } from "../../model";
import { CardView } from "../card-view";
import { TodayConventionCard } from "../conventions/today-convention-card";
import { ComingSoonConventionsCard } from "./coming-soon-conventions-card";

export function Dashboard(props) {
  const { conventions } = model.getValue();
  const conventionCards = conventions
    .filter(({ start, end }) => start <= new Date() && new Date() <= end)
    .map((convention) => (
      <TodayConventionCard
        convention={convention}
        key={`today_convention_${convention.id}`}
        showDetails
      />
    ));
  return (
    <CardView>
      {conventionCards}
      <ComingSoonConventionsCard
        conventions={conventions.filter(({ start }) => start > new Date())}
      />
    </CardView>
  );
}
