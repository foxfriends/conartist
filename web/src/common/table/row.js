import * as React from "react";
import S from "./row.css";
const { Fragment } = React;

export class Row extends React.PureComponent {
  valueRef;
  titleRef;

  constructor(props) {
    super(props);
    this.state = {
      height: 0,
    };
    this.valueRef = React.createRef();
    this.titleRef = React.createRef();
  }

  componentDidMount() {
    const zero = { clientHeight: 0 };
    if (this.valueRef.current || this.titleRef.current) {
      // $FlowIgnore
      const height = Math.max(
        (this.titleRef.current || zero).clientHeight,
        (this.valueRef.current || zero).clientHeight,
      );
      this.setState({ height });
    }
  }

  componentDidUpdate() {
    const zero = { clientHeight: 0 };
    if (this.valueRef.current || this.titleRef.current) {
      // $FlowIgnore
      const height = Math.max(
        (this.titleRef.current || zero).clientHeight,
        (this.valueRef.current || zero).clientHeight,
      );
      this.setState({ height });
    }
  }

  render() {
    const { title, value, detail, truncate = false } = this.props;
    const { height } = this.state;
    const rows = Math.ceil(height / 50);
    const titleStyle = {
      gridColumnStart: 1,
      gridColumnEnd: `span ${1 + (!value ? 1 : 0)}`,
      gridRowEnd: `span ${rows}`,
    };
    const valueStyle = {
      gridColumnStart: title ? 2 : 1,
      gridColumnEnd: `span ${1 + (!detail ? 1 : 0) + (!title ? 1 : 0)}`,
      gridRowEnd: `span ${rows}`,
    };
    const detailStyle = {
      gridColumnStart: title || value ? 3 : 1,
      gridColumnEnd: 4 - (title ? 0 : 0) + (value ? 1 : 0),
      gridRowEnd: `span ${rows}`,
    };
    return (
      <Fragment>
        {title ? (
          <div
            className={`${S.title} ${truncate ? S.truncate : ""}`}
            style={titleStyle}
          >
            <div ref={this.titleRef}>{title}</div>
          </div>
        ) : null}
        {value ? (
          <div
            className={`${S.value} ${truncate ? S.truncate : ""}`}
            style={valueStyle}
          >
            <div ref={this.valueRef}>{value}</div>
          </div>
        ) : null}
        {detail ? (
          <div
            className={`${S.detail} ${truncate ? S.truncate : ""}`}
            style={detailStyle}
          >
            {detail}
          </div>
        ) : null}
      </Fragment>
    );
  }
}
