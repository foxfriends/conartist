/*       */
import * as React from "react";
import DefaultMap from "../../util/default-map";
import { by, Asc } from "../../util/sort";
import { l, lx } from "../../localization";
import { AutoCardView as CardView } from "../card-view/auto";
import { BasicCard } from "../card-view/basic-card";
import { Card } from "../card-view/card";
import { AutoTable as Table } from "../../common/table/auto";
import { Row } from "../../common/table/row";
import { scrollIdentifier } from "../../update/navigate";

import S from "./index.css";
const { Fragment } = React;

export function Products({ products, productTypes }) {
  const sortedProducts = products
    .filter(({ discontinued }) => !discontinued)
    .sort(by(["sort", Asc], ["id", Asc]))
    .reduce(
      (sortedProducts, product) =>
        sortedProducts.set(product.typeId, [
          ...sortedProducts.get(product.typeId),
          product,
        ]),
      new DefaultMap([], []),
    );

  const dataSource = productTypes
    .filter(({ discontinued }) => !discontinued)
    .sort(by(["sort", Asc], ["id", Asc]))
    .map((productType) => [productType, sortedProducts.get(productType.id)]);

  return (
    <CardView dataSource={dataSource}>
      <Card className={S.emptyState}>
        <div className={S.placeholder}>
          {lx`<Empty products list message>`((x) => x)}
        </div>
      </Card>
      {([productType, products], _) => (
        <BasicCard
          id={scrollIdentifier("product-type", productType.id)}
          title={productType.name}
          collapsible={true}
          key={`product_type_${productType.id}`}
        >
          <Table dataSource={products}>
            <Fragment>
              <div className={S.placeholder}>
                {l`You aren't selling any of these`}
                {/* TODO: get some images for this */}
              </div>
            </Fragment>
            {(product, _) => (
              <Row
                title={product.name}
                value={<span className={S.sku}>{product.sku}</span>}
                detail={`${product.quantity}`}
                key={`product_${product.id}`}
              />
            )}
          </Table>
        </BasicCard>
      )}
    </CardView>
  );
}
