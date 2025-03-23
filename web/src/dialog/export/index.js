/*       */
import * as React from 'react'
import { ExportProducts } from './products'
import { ExportRecords } from './records'
                                                        
                                                      

                                                

export function Export(props       ) {
  switch (props.type) {
    case 'products':
      return <ExportProducts {...props} />
    case 'records':
      return <ExportRecords {...props} />
  }
  return null
}

export default Export
