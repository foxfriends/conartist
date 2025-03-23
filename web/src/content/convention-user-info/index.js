/*       */
import * as React from "react";

import { CardView } from "../card-view";
import { ConventionUserInfoCard } from "./convention-user-info-card";
import { NewConventionUserInfoCard } from "./new-convention-user-info-card";

export function ConventionUserInfo({ convention }) {
  return (
    <CardView>
      <ConventionUserInfoCard title={convention.name} convention={convention} />
      <NewConventionUserInfoCard convention={convention} />
    </CardView>
  );
}
