/*       */
import * as React from "react";
import { SecondaryCardFade as Fade } from "../../common/animation/fade/secondary-card";
import { CardView } from "../card-view";
import { InventoryChart } from "./chart/inventory";
import { SalesByTypeChart } from "./chart/sales-by-type";
import { SalesOverTimeChart } from "./chart/sales-over-time";

export class ConventionStats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: null,
    };
  }

  render() {
    const { convention } = this.props;
    const { settings } = this.state;

    // $FlowIgnore
    const {
      products = [],
      records = [],
      productTypes = [],
      prices = [],
    } = convention;

    const continuedProducts = products.filter(
      ({ discontinued }) => !discontinued,
    );
    const showSettings = (settings) => this.setState({ settings });

    return (
      <CardView>
        <InventoryChart
          productTypes={productTypes}
          products={continuedProducts}
          records={records}
          showSettings={showSettings}
        />
        <SalesByTypeChart
          productTypes={productTypes}
          products={continuedProducts}
          records={records}
          prices={prices}
          showSettings={showSettings}
        />
        <SalesOverTimeChart records={records} showSettings={showSettings} />
        <Fade>
          {/* $FlowIgnore */}
          {settings || null}
        </Fade>
      </CardView>
    );
  }
}
