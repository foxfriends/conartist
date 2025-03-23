/*       */
import * as React from "react";

import { CardView } from "../card-view";
import { ConventionCard } from "../conventions/convention-card";
import { ConventionRevenueCard } from "./convention-revenue-card";
import { ConventionStatsCard } from "./convention-stats-card";
import { ConventionUserInfoCard } from "../convention-user-info/convention-user-info-card";

import S from "./index.css";

export function ConventionDetails({ convention }) {
  return (
    <CardView>
      <ConventionCard
        includeHours
        starrable={convention.start > new Date()}
        convention={convention}
      />
      <ConventionRevenueCard convention={convention} />
      <ConventionStatsCard convention={convention} />
      <ConventionUserInfoCard
        hasSeeAllButton
        convention={convention}
        limit={5}
      />
    </CardView>
  );
}
