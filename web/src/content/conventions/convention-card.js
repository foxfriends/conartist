/*       */
import * as React from "react";

import { Table } from "../../common/table";
import { Icon } from "../../common/icon";
import { Tooltip } from "../../common/tooltip";
import { Font } from "../../common/font";
import { Link } from "../../common/link";
import { IconButton } from "../../common/icon-button";
import { Card } from "../card-view/card";
import { BasicHeader } from "../card-view/basic-header";
import { HoursInfo } from "./info/hours";
import { DatesInfo } from "./info/dates";
import { WebsiteInfo } from "./info/website";
import { AddressInfo } from "./info/address";
import { model } from "../../model";
import { l } from "../../localization";
import * as update from "../../update/conventions";
import * as navigate from "../../update/navigate";

import S from "./card.css";
const { Fragment } = React;

export function ConventionCard({
  convention,
  includeHours,
  showDetails,
  starrable,
}) {
  const selected = model
    .getValue()
    .conventions.some(({ id }) => id === convention.id);

  const toggleStarred = selected
    ? () => {
        update.unstarConvention(convention);
      }
    : () => {
        update.starConvention(convention);
      };

  return (
    <Card>
      <BasicHeader>
        {starrable ? (
          <div className={S.starContainer}>
            <Tooltip title={selected ? l`Going` : l`Not going`}>
              <IconButton
                title={selected ? "bookmark" : "bookmark_border"}
                action={toggleStarred}
                priority="secondary"
                className={`${S.star} ${selected ? S.starSelected : ""}`}
              />
            </Tooltip>
          </div>
        ) : null}
        {convention.name}
        {showDetails ? (
          <Link
            className={S.detailsButton}
            priority="tertiary"
            onClick={() => navigate.conventionDetails(convention)}
          >
            <Font smallCaps>{l`Details`}</Font>
            <Icon name="keyboard_arrow_right" />
          </Link>
        ) : null}
      </BasicHeader>
      <Table>
        <DatesInfo start={convention.start} end={convention.end} />
        {includeHours ? <HoursInfo infos={convention.extraInfo} /> : null}
        <AddressInfo infos={convention.extraInfo} />
        <WebsiteInfo infos={convention.extraInfo} />
      </Table>
    </Card>
  );
}
