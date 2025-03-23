/*       */
import * as React from 'react'
import { CardView } from '../card-view'
import { LocaleSettings } from './locale-settings'
import { AccountSettings } from './account-settings'
import { Help } from './help'
import { Contribute } from './contribute'
                                                                 

                     
                   
                
                   
                    
                      
 

export function Settings({ username, email, verified, settings }       ) {
  return (
    <CardView>
      <AccountSettings name={username} email={email} verified={verified} />
      <LocaleSettings currency={settings.currency} language={settings.language} />
      <Contribute />
      <Help />
    </CardView>
  )
}
