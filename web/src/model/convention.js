/* @flow */
import type { MetaConvention } from './meta-convention'
import type { FullConvention } from './full-convention'
export type Convention = MetaConvention | FullConvention
export type IdentifiableConvention = Convention | { id: number }
