/*       */
import * as React from "react";
import S from "./index.css";

export class Expand extends React.Component {
  static getDerivedStateFromProps({ children }, state) {
    return {
      previousChildren: state.children,
      children: children ? React.cloneElement(children) : null,
    };
  }

  // $FlowIgnore
  measurementDiv;
  animationTimer;

  constructor(props) {
    super(props);
    this.animationTimer = null;
    this.state = {
      height: 0,
      previousChildren: null,
      children: props.children ? React.cloneElement(props.children) : null,
    };
    this.measurementDiv = React.createRef();
  }

  componentWillUnmount() {
    if (this.animationTimer !== null) {
      clearTimeout(this.animationTimer);
    }
  }

  componentDidMount() {
    if (this.measurementDiv.current) {
      // $FlowIgnore
      const height = this.measurementDiv.current.clientHeight;
      this.setState({ height });
    }
  }

  componentDidUpdate() {
    if (!this.measurementDiv.current) {
      return;
    }
    // $FlowIgnore
    const height = this.measurementDiv.current.clientHeight;
    if (height !== this.state.height) {
      if (this.animationTimer) {
        clearTimeout(this.animationTimer);
        this.animationTimer = null;
      }
      if (height === 0 || this.state.height === 0) {
        this.animationTimer = setTimeout(() => {
          this.animationTimer = null;
          this.setState({ previousChildren: null });
        }, 200);
      }
      this.setState({ height });
    }
  }

  render() {
    // TODO: the height should recalculate when the page resizes so that the cards grow with their
    // content as expected
    const { className, children } = this.props;
    const { height, previousChildren } = this.state;
    const style = {
      height,
    };

    if (this.animationTimer === null) {
      style.transitionDuration = "0s";
      style.overflow = "visible";
    }

    return (
      <div
        className={`${S.expansionContainer} ${className || ""}`}
        style={style}
      >
        <div>{!height ? previousChildren : null}</div>
        <div ref={this.measurementDiv}>{children}</div>
      </div>
    );
  }
}
