/* @flow */
import * as React from 'react'
import { Icon } from './icon'
import S from './checkbox.css'

export type Props = {
  defaultValue?: boolean,
  onChange: (boolean) => void,
  children?: React.Node,
  className?: string,
  style?: { [string]: string | number },
}

type State = {
  checked: bool,
}

export class Checkbox extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      checked: props.defaultValue || false,
    }
  }

  handleClick(event: SyntheticMouseEvent<HTMLDivElement>) {
    // $FlowIgnore: it's an HTMLElement but Flow doesn't want to believe me
    if (event.target.tagName !== 'A') { // good enough, but not the best. revisit if needed
      this.setState({ checked: !this.state.checked }, () => {
        this.props.onChange(this.state.checked)
      })
    }
  }

  render() {
    const { children, style, className } = this.props
    const { checked } = this.state
    return (
      <div tabIndex={0} autoFocus className={`${S.container} ${className || ''}`} onClick={event => this.handleClick(event)} style={style}>
        <Icon name={checked ? 'check_box' : 'check_box_outline_blank'} />
        { children ? <p className={S.label}>{ children }</p> : null }
      </div>
    )
  }
}
