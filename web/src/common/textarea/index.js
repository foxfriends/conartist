/*       */
import * as React from "react";
import S from "./index.css";

export class Textarea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.defaultValue || "",
    };
  }

  handleChange(event) {
    const { value } = event.currentTarget;
    this.setState({ value });
    this.props.onChange(value);
  }

  render() {
    const { defaultValue, className, placeholder } = this.props;
    return (
      // $FlowIgnore
      <textarea
        className={`${S.textarea} ${className || ""}`}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={(event) => this.handleChange(event)}
      />
    );
  }
}
