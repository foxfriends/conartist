/*       */
import * as React from 'react'
import { BehaviorSubject } from 'rxjs'
import { share } from 'rxjs/operators'
                                      
import S from './index.css'

                                           
                               
                      
 

                                           
                                      
                              
 

export class Toast                       extends React.Component                     {
  static getDerivedStateFromProps({ children }          , { children: previousChildren }          ) {
    return {
      previousChildren,
      children: children ? React.cloneElement(children) : null,
    }
  }

  constructor(props          ) {
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

export function show(toast                                   ) {
  subject.next(toast)
}

export const toast                                                = subject.asObservable().pipe(share())
