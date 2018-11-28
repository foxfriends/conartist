/* @flow */
import * as React from 'react'

const TermsOfService = React.lazy(() => import(/* webpackChunkName: 'legal' */ './terms-of-service'))
const PrivacyPolicy = React.lazy(() => import(/* webpackChunkName: 'legal' */ './privacy-policy'))

import { Splash } from './splash'
import { Loading } from './loading'

const { Suspense } = React

export type Props = {
  name: 'static',
  content: 'terms-of-service' | 'privacy-policy' | 'splash',
}

export function Static({ content }: Props) {
  switch (content) {
    case 'terms-of-service': return <Suspense fallback={<Loading />}><TermsOfService /></Suspense>
    case 'privacy-policy':   return <Suspense fallback={<Loading />}><PrivacyPolicy /></Suspense>
    case 'splash':           return <Splash />
    default: return null
  }
}
