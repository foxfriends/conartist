import * as React from "react";
import { l, lx } from "../../localization";
import { SecondaryCardFade as Fade } from "../../common/animation/fade/secondary-card";
import { AutoCardView as CardView } from "../card-view/auto";
import { Card } from "../card-view/card";
import { RecordsCard } from "../convention-records/records-card";
import { justDay } from "../../util/date";
import { model } from "../../model";
import { isFull, isEmpty } from "../../model/connection";
import * as update from "../../update/sales";
import S from "../convention-records/records-card.css";

export class Sales extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      loading: true,
      focus: null,
    };
  }

  async componentDidMount() {
    try {
      await update.loadSales(true);
    } finally {
      this.setState({ loaded: true, loading: false });
    }
  }

  async loadRecords() {
    try {
      this.setState({ loading: true });
      await update.loadSales();
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const { focus, loading, loaded } = this.state;
    const { records } = model.getValue();

    const dates = [];
    for (const { time } of records.nodes) {
      const day = justDay(time).getTime();
      if (!dates.includes(day)) {
        dates.push(day);
      }
    }

    return (
      <CardView
        dataSource={dates.sort((a, b) => b - a).map((time) => new Date(time))}
        loadMore={
          !loading && !isFull(records) && !isEmpty(records)
            ? () => this.loadRecords()
            : null
        }
      >
        <Card className={S.emptyState}>
          <div className={S.placeholder}>
            {loaded ? lx`<Empty no-con records list message>`() : l`Loading...`}
          </div>
        </Card>
        {(date, i) => (
          <RecordsCard
            records={records.nodes}
            date={date}
            key={`records_${date.getTime()}`}
            onFocus={(focus) => this.setState({ focus })}
          />
        )}
        <>
          {loaded && loading ? (
            <Card className={S.loadMore}>{l`Loading...`}</Card>
          ) : null}
          <Fade>{focus || null}</Fade>
        </>
      </CardView>
    );
  }
}
