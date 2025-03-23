/*       */
import * as React from 'react'

import { BasicHeader } from './basic-header'
import { IconButton } from '../../common/icon-button'
import S from './secondary-card.css'

                     
                
                
                                  
                       
                       
 

              
              
 

// NOTE: this is a bit sketchy, but it will do for now...
export class SecondaryCard extends React.Component               {
  // $FlowIgnore
  ref                           

  constructor(props       ) {
    super(props)
    // $FlowIgnore
    this.ref = React.createRef()
    this.state = {
      top: 16,
    }
  }

  shouldComponentUpdate(props       , state       ) {
    return this.state.top !== state.top
  }

  componentDidUpdate() {
    if (this.props.anchor && this.ref.current && this.props.anchor.current) {
      const cardView = document.querySelector('#card-view')
      if (!cardView) { throw new Error('There is no #card-view element!') }
      // $FlowIgnore
      const height = this.ref.current.clientHeight
      let node = this.props.anchor.current
      let recommendedTop = 0
      while (node && node !== cardView) {
        recommendedTop += node.offsetTop
        node = node.offsetParent
      }
      // prevent going off the bottom of the page
      let top = recommendedTop
      if (recommendedTop + height > cardView.offsetHeight - 16) {
        top = cardView.offsetHeight - height - 16
      }

      if (top < 0) {
        top = recommendedTop
      }

      this.setState({ top })
    }
  }

  componentDidMount() {
    this.componentDidUpdate()
  }

  render() {
    const { title, children, onClose } = this.props
    const { top } = this.state

    return (
      // $FlowIgnore
      <div className={S.card} style={{ top }} ref={this.ref}>
        <div className={S.header}>
          <BasicHeader>
            { title }
          </BasicHeader>
          { onClose ? <IconButton quiet className={S.rightAction} action={onClose} title='close' priority='secondary'/> : null }
        </div>
        <div className={S.content}>
          { children }
        </div>
      </div>
    )
  }
}
