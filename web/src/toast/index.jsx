/* @flow */
import * as React from 'react'
import { BehaviorSubject } from 'rxjs'
import { share } from 'rxjs/operators'
import type { Observable } from 'rxjs'
import S from './index.css'

export type Props<E: React.ElementType> = {
  children?: ?React.Element<E>,
  onClick: () => void,
}

export type State<E: React.ElementType> = {
  previousChildren: ?React.Element<E>,
  children: ?React.Element<E>,
}

export class Toast<E: React.ElementType> extends React.Component<Props<E>, State<E>> {
  static getDerivedStateFromProps({ children }: Props<E>, { children: previousChildren }: State<E>) {
    return {
      previousChildren,
      children: children ? React.cloneElement(children) : null,
    }
  }

  constructor(props: Props<E>) {
    super(props)
    this.state = {
      previousChildren: null,
      children: null,
    }
  }

  render() {
    const { children, onClick } = this.props
    const { previousChildren } = this.state
    return (
      <div className={`${S.toast} ${children ? S.visible : S.hidden}`} onClick={onClick}>
        { children || previousChildren }
      </div>
    )
  }
}

const subject = new BehaviorSubject(null)

export function show(toast: React.Element<React.ElementType>) {
  subject.next(toast)
}

export const toast: Observable<React.Element<React.ElementType>> = subject.asObservable().pipe(share())
