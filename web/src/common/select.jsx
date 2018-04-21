/* @flow */
import * as React from 'react'

import { Icon } from './icon'
import { Cover } from './cover'
import S from './select.css'

type Transformer<T> = (T) => React.Node

export type Props<Value> = {
  options: Value[],
  defaultValue?: Value,
  children: Transformer<Value>,
  className?: string,
  onChange: (Value) => void,
}

type State<Value> = {
  value: Value,
  expanded: boolean,
}

export class Select<Value> extends React.Component<Props<Value>, State<Value>>  {
  constructor(props: Props<Value>) {
    super(props)
    this.state = {
      value: props.defaultValue || props.options[0],
      expanded: false,
    }
  }

  handleOptionClicked(option: Value) {
    this.setState({ value: option, expanded: false })
    this.props.onChange(option)
  }

  toggleExpansion() {
    this.setState({ expanded: !this.state.expanded })
  }

  render() {
    const { options, children, className } = this.props
    const { expanded, value } = this.state
    return (
      <>
        { expanded ? <Cover fixed={true} onClick={() => this.toggleExpansion()} className={S.cover} /> : '' }
        <div className={`${S.container} ${className || ''}`}>
          <div className={S.selection} onClick={() => this.toggleExpansion()}>
            { children(value) }
            <Icon name='arrow_drop_down' className={S.arrow}/>
          </div>
          <div className={`${S.optionsContainer} ${expanded ? S.expanded : ''}`} style={{ maxHeight: expanded ? Math.min(8, options.length) * 50 : 0 }}>
            { expanded
              ? <div className={S.options}>
                  { options.map((option, i) =>
                      <div className={S.option} onClick={() => this.handleOptionClicked(option)} key={`option_${i}`}>
                        { children(option) }
                        { option === value ? <Icon name='check' className={S.check}/> : null }
                      </div>
                    )
                  }
                </div>
              : null
            }
          </div>
        </div>
      </>
    )
  }
}
