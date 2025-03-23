/*       */
import * as React from "react";
import { Icon } from "../icon";
import S from "./index.css";

export class Checkbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: props.defaultValue || false,
    };
  }

  handleClick(event) {
    // $FlowIgnore: it's an HTMLElement but Flow doesn't want to believe me
    if (event.target.tagName !== "A") {
      // good enough, but not the best. revisit if needed
      this.setState({ checked: !this.state.checked }, () => {
        this.props.onChange(this.state.checked);
      });
    }
  }

  render() {
    const { children, style, className } = this.props;
    const { checked } = this.state;
    return (
      <div
        tabIndex={0}
        autoFocus
        className={`${S.container} ${className || ""}`}
        onClick={(event) => this.handleClick(event)}
        style={style}
      >
        <Icon name={checked ? "check_box" : "check_box_outline_blank"} />
        {children ? <div className={S.label}>{children}</div> : null}
      </div>
    );
  }
}
