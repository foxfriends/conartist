/*       */
import * as React from 'react'
import { of } from 'rxjs'
import { catchError } from 'rxjs/operators'

import IMAGE from '../../../images/welcome.png'
import { l } from '../../localization'
import * as API from '../../api'
import { SignUpRequest } from '../../api/signup'
import { setUser } from '../../update/signin'
                                           
                                         
                                            

const { Fragment } = React

import S from './completed.css'

                                    
             
                 
                  
                     
     
 

              
                                   
 

export class Completed extends React.Component               {
  constructor(props       ) {
    super(props)
    this.state = {
      response: API.unsent,
    }
  }

  componentDidMount() {
    new SignUpRequest()
      .send(this.props.account)
      .pipe(
        catchError(() => of({
          state: 'failed',
          error: l`An unknown error has occurred`,
        })),
      )
      .subscribe(response => this.setState({ response }, () => {
        if (this.state.response.state === 'retrieved') {
          setUser(this.state.response.value)
        }
        this.props.onValidate(this.state.response.state === 'retrieved')
      }))
  }

  render() {
    let copy                
    let heading                
    switch (this.state.response.state) {
      case 'unsent':
      case 'sending':
        heading = l`Working...`
        copy = null
        break
      case 'retrieved':
        heading = l`... You're in!`
        copy = (
          <Fragment>
            {l`We're glad you joined us.`}<br />
            {l`Let's get started!`}
          </Fragment>
        )
        break
      default:
      case 'failed':
        heading = l`Oh no...`
        copy = (
          <Fragment>
            {l`It seems something went wrong.`}<br />
            {l`You'll have to try again later... Sorry for the inconvenience.`}<br />
            {this.state.response.error}
          </Fragment>
        )
        break
    }
    return (
      <div className={S.container}>
        <h1 className={S.heading}>{ heading }</h1>
        { this.state.response.state === 'retrieved' ? <img src={IMAGE} className={S.banner} /> : null }
        <p className={S.copy}>
          { copy }
        </p>
      </div>
    )
  }
}
