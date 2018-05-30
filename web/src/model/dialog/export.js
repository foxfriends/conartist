/* @flow */
import type { Convention } from '../convention'

export type Export
  = ExportProducts
  | ExportRecords

type ExportProducts = { name: 'export', type: 'products' }
export const exportProducts: ExportProducts = { name: 'export', type: 'products' }


type ExportRecords = { name: 'export', type: 'records', convention: Convention }
export function exportRecords(convention: Convention): ExportRecords {
  return { name: 'export', type: 'records', convention }
}
