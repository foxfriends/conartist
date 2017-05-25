'use strict';
import * as React from 'react';

type Props = {
  open: boolean;
  openSecondary?: boolean;
  width?: number;
  onBackdropClick?: () => any;
};
type State = {
  open: boolean;
};

import './sidenav.scss';

export default class Sidenav extends React.Component<Props, State> {
  state: State = { open: false };

  componentWillReceiveProps(props: Props) {
    this.setState({ open: props.open });
  }

  render() {
    return (
      <div className='md-sidenav'>
        <div className={`md-sidenav__backdrop md-sidenav__backdrop--${this.state.open ? 'visible': 'hidden'}`} onClick={this.props.onBackdropClick} onTouchStart={this.props.onBackdropClick}/>
        <div className={`md-sidenav__content md-sidenav__content--${this.state.open ? 'open' : 'closed'} md-sidenav__content--${this.props.openSecondary ? 'right' : 'left'}`}>
          { this.props.children }
        </div>
      </div>
    );
  }
}
