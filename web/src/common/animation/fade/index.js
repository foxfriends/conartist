/*       */
import * as React from 'react'
import S from './index.css'

                                           
                     
                               
 

                                    
                                      
                              
               
 

export class Fade                       extends React.Component                     {
  static getDerivedStateFromProps({ children }          , state          ) {
    if (children !== state.children) {
      return {
        previousChildren: state.children ? React.cloneElement(state.children) : null,
        children: children || null,
        key: !state.key,
      }
    } else {
      return null;
    }
  }

  animationTimer            

  constructor(props          ) {
    super(props)
    this.animationTimer = null
    this.state = {
      previousChildren: null,
      children: props.children ? React.cloneElement(props.children) : null,
      key: false,
    }
  }

  componentWillUnmount() {
    if (this.animationTimer !== null) {
      clearTimeout(this.animationTimer)
    }
  }

  componentDidUpdate() {
    if (this.animationTimer !== null) {
      clearTimeout(this.animationTimer)
    }
    if (this.state.previousChildren) {
      this.animationTimer = setTimeout(() => {
        this.setState({ previousChildren: null })
        this.animationTimer = null
      }, 200)
    }
  }

  render() {
    const { className, children } = this.props
    const { previousChildren, key } = this.state

    return (
      <div className={`${S.container} ${className || ''}`}>
        <div className={`${S.fade} ${key ? S.visible : ''}`}>
          { key ? children : previousChildren }
        </div>
        <div className={`${S.fade} ${!key ? S.visible : ''}`}>
          { key ? previousChildren : children }
        </div>
      </div>
    )
  }
}
