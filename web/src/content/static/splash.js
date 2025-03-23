/*       */
import * as React from 'react'
import { Link } from '../../common/link'
import { l } from '../../localization'
import { APP_STORE_URL, DISCORD_URL } from '../../constants'
import APP_STORE from '../../../images/app-store.svg'
import DISCORD from '../../../images/discord.svg'
import S from './static.css'

                     
                     
                                        
 

export function Splash({ className, style }       ) {
  return (
    <section className={`${S.container} ${className || ''}`} style={style}>
      <hgroup className={S.splashBanner}>
        <h1 className={S.headline}>{l`<Splash title>`}</h1>
        <p className={S.paragraph}>{l`<Splash body>`}</p>
      </hgroup>
      <div className={S.links}>
        <Link href={APP_STORE_URL} target='_blank'>
          <img src={APP_STORE} alt={l`Download on the App Store`} />
        </Link>
        <Link href={DISCORD_URL} target='_blank'>
          <img src={DISCORD} alt={l`Chat on Discord`} height={40} />
        </Link>
      </div>
    </section>
  )
}
