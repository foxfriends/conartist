'use strict';
import * as React from 'react';

type Props = {
  cond: boolean;
  inline?: boolean;
  // children: JSX.Element;
};
type State = {};

export class If extends React.Component<Props, State> {
  render() {
    if(!this.props.cond) {
      return null;
    } else if(this.props.inline) {
      return <span>{ this.props.children }</span>;
    } else {
      return <div>{ this.props.children }</div>;
    }
  }
}

const RESIZE_EVENT = 'resize_event';
{
  let batch = false;
  window.addEventListener('resize', () => {
    if(batch) { return; }
    batch = true;
    window.requestAnimationFrame(() => {
      window.dispatchEvent(new CustomEvent(RESIZE_EVENT));
      batch = false;
    });
  });
}

type Constructor<T> = new(...args: any[]) => T;
export function Resizable<P, S, C extends Constructor<React.Component<P,S>>>(Component: C): C {
  return class extends Component {
    onResize() {
      this.forceUpdate();
    }

    componentDidMount(): void {
      window.addEventListener(RESIZE_EVENT, () => this.onResize());
    }

    componentWillUnmount(): void {
      window.removeEventListener(RESIZE_EVENT, () => this.onResize());
    }
  };
}
