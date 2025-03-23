/*       */
import * as React from "react";
import { Static } from "./static";
import { Dashboard } from "./dashboard";
import { Products } from "./products";
import { EditProducts } from "./edit-products";
import { EditPrices } from "./edit-prices";
import { Prices } from "./prices";
import { Sales } from "./sales";
import { Conventions } from "./conventions";
import { SearchConventions } from "./search-conventions";
import { ConventionDetails } from "./convention-details";
import { ConventionRecords } from "./convention-records";
import { ConventionStats } from "./convention-stats";
import { ConventionUserInfo } from "./convention-user-info";
import { Settings } from "./settings";

const ResetPassword = React.lazy(
  () => import(/* webpackChunkName: 'verifications' */ "./reset-password"),
);
const Verify = React.lazy(
  () => import(/* webpackChunkName: 'verifications' */ "./verify"),
);
const Suggestions = React.lazy(
  () => import(/* webpackChunkName: 'suggestions' */ "./suggestions"),
);

import S from "./index.css";

const Admin = React.lazy(
  () => import(/* webpackChunkName: 'admin' */ "./admin"),
);
const { Suspense } = React;

// TODO: these are just used for placeholder
import { l } from "../localization";
import { CardView } from "./card-view";
import { Card } from "./card-view/card";

export function Content(props) {
  const placeholder = (
    <CardView>
      <Card className={S.emptyState}>
        <div className={S.placeholder}>{l`Loading...`}</div>
      </Card>
    </CardView>
  );

  let content;
  switch (props.name) {
    case "placeholder":
      content = placeholder;
      break;
    case "static":
      content = <Static {...props} />;
      break;
    case "dashboard":
      content = <Dashboard {...props} />;
      break;
    case "products":
      content = <Products {...props} />;
      break;
    case "edit-products":
      content = <EditProducts {...props} />;
      break;
    case "prices":
      content = <Prices {...props} />;
      break;
    case "edit-prices":
      content = <EditPrices {...props} />;
      break;
    case "sales":
      content = <Sales {...props} />;
      break;
    case "conventions":
      content = <Conventions {...props} />;
      break;
    case "search-conventions":
      content = <SearchConventions {...props} />;
      break;
    case "convention-details":
      content = <ConventionDetails {...props} />;
      break;
    case "convention-user-info":
      content = <ConventionUserInfo {...props} />;
      break;
    case "convention-records":
      content = <ConventionRecords {...props} />;
      break;
    case "convention-stats":
      content = <ConventionStats {...props} />;
      break;
    case "settings":
      content = <Settings {...props} />;
      break;
    case "suggestions":
      content = (
        <Suspense fallback={placeholder}>
          <Suggestions {...props} />
        </Suspense>
      );
      break;
    case "reset-password":
      content = (
        <Suspense fallback={placeholder}>
          <ResetPassword {...props} />
        </Suspense>
      );
      break;
    case "verify":
      content = (
        <Suspense fallback={placeholder}>
          <Verify {...props} />
        </Suspense>
      );
      break;
    case "admin":
      content = (
        <Suspense fallback={placeholder}>
          <Admin {...props} />
        </Suspense>
      );
      break;
  }
  return <main className={S.container}>{content}</main>;
}
