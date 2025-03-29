import * as React from "react";
import { l } from "../../localization";
import { SecondaryCardFade as Fade } from "../../common/animation/fade/secondary-card";
import { AutoCardView as CardView } from "../card-view/auto";
import { Card } from "../card-view/card";
import { RecordsCard } from "./records-card";
import { justDay } from "../../util/date";

import S from "./records-card.css";

export class ConventionRecords extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: null,
    };
  }

  render() {
    const { convention } = this.props;
    const { focus } = this.state;

    const dates = [];
    const end = new Date(Math.min(convention.end, justDay(new Date())));
    for (
      const date = new Date(justDay(convention.start));
      date <= end;
      date.setDate(date.getDate() + 1)
    ) {
      dates.push(new Date(date).getTime());
    }
    // $FlowIgnore: does not understand defaulting missing args
    for (const item of [].concat(
      convention.records || [],
      convention.expenses || [],
    )) {
      const day = justDay(item.time).getTime();
      if (!dates.includes(day)) {
        dates.push(day);
      }
    }
    return (
      <CardView dataSource={dates.sort().map((time) => new Date(time))}>
        <Card className={S.emptyState}>
          <div className={S.placeholder}>{l`<Empty records list message>`}</div>
        </Card>
        {(date, i) => (
          <RecordsCard
            date={date}
            convention={convention}
            key={`records_${date.getTime()}`}
            onFocus={(focus) => this.setState({ focus })}
          />
        )}
        <Fade>
          {/* $FlowIgnore */}
          {focus || null}
        </Fade>
      </CardView>
    );
  }
}
