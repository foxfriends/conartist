/*       */
import * as React from 'react'
import { l } from '../../localization'
import { Card } from '../card-view/card'
import { Input } from '../../common/input'
import { AutoList as List } from '../../common/list/auto'
import { Item } from '../../common/list/item'
import { IconButton } from '../../common/icon-button'
import { ColorPicker } from '../../common/color-picker'
import { scrollIdentifier } from '../../update/navigate'
import { INVALID, VALID } from '../../model/validation'
import { DuplicateName, DuplicateSku, NonNumberQuantity, NonIntegerQuantity, NegativeQuantity } from './schema'
                                                 
                                                        
                                                                                         
                                                                       
import S from './index.css'
const { Fragment } = React

function productTypeValidation(validation                             )                  {
  if (validation.state !== INVALID) {
    return validation
  }
  switch (validation.error) {
    case DuplicateName:
      return { state: INVALID, error: l`This name is used twice!` }
    default:
      return { state: VALID }
  }
}

function productNameValidation(validation                             )                  {
  if (validation.state !== INVALID) {
    return validation
  }
  switch (validation.error) {
    case DuplicateName:
      return { state: INVALID, error: l`This name is used twice!` }
    default:
      return { state: VALID }
  }
}

function productSkuValidation(validation                             )                  {
  if (validation.state !== INVALID) {
    return validation
  }
  switch (validation.error) {
    case DuplicateSku:
      return { state: INVALID, error: l`This SKU is used twice!` }
    default:
      return { state: VALID }
  }
}

function productQuantityValidation(validation                             )                  {
  if (validation.state !== INVALID) {
    return validation
  }
  switch (validation.error) {
    case NonNumberQuantity:
      return { state: INVALID, error: l`This isn't a number!` }
    case NonIntegerQuantity:
      return { state: INVALID, error: l`This has to be a whole number!` }
    case NegativeQuantity:
      return { state: INVALID, error: l`You can't have less than none!` }
    default:
      return { state: VALID }
  }
}

                     
                                   
                              
                      
                         
                                            
                                             
                                  
                                            
                                           
                                                
                                           
                                
                                             
                                   
 

export function EditProductCard({
  productType,
  products,
  topAction,
  bottomAction,
  onProductTypeNameChange,
  onProductTypeColorChange,
  onProductTypeDelete,
  onProductNameChange,
  onProductSkuChange,
  onProductQuantityChange,
  onProductToggleDiscontinue,
  onProductDelete,
  onProductReorder,
  onSortAlphabetically,
}       ) {
  return (
    <Card
      id={scrollIdentifier('product-type', productType.id)}
      collapsible={true}
      defaultCollapsed={productType.discontinued}
      topAction={topAction}
      bottomAction={bottomAction}
      className={productType.discontinued ? S.discontinued : ''}>
      <Fragment>
        <Input
          className={S.productTypeName}
          defaultValue={productType.name}
          placeholder={l`New product type`}
          onChange={onProductTypeNameChange}
          validation={productTypeValidation(productType.validation)}
          />
        { productType.discontinued
          ? <IconButton
              title='delete'
              action={onProductTypeDelete}
              className={S.deleteTypeButton}
              />
          : <>
              <IconButton
                className={S.sortButton}
                title='sort_by_alpha'
                action={onSortAlphabetically}
                />
              <ColorPicker
                className={S.productTypeColor}
                defaultValue={productType.color}
                onChange={onProductTypeColorChange}
                />
            </>
        }
      </Fragment>
      <Fragment>
        <List dataSource={products} reorderable={onProductReorder}>
          <div className={S.placeholder}>
            {l`No products yet... add one!`}
          </div>
          {(product, _, extraProps) =>
            <Item key={`product_${product.id}`} className={product.discontinued ? S.discontinued : ''} reorderable={!product.discontinued} {...extraProps}>
              <Input
                defaultValue={product.name}
                placeholder={l`New product`}
                onChange={name => onProductNameChange(product.id, name)}
                className={S.productName}
                validation={productNameValidation(product.nameValidation)}
                />
              <Input
                defaultValue={product.sku}
                placeholder={l`SKU (optional)`}
                onChange={sku => onProductSkuChange(product.id, sku)}
                className={S.productSku}
                validation={productSkuValidation(product.skuValidation)}
                />
              { product.discontinued
                  ? null
                  : <Input
                      defaultValue={isNaN(product.quantity) ? '' : `${product.quantity}`}
                      placeholder={l`Quantity`}
                      onChange={quantity => onProductQuantityChange(product.id, quantity)}
                      className={S.productQuantity}
                      validation={productQuantityValidation(product.quantityValidation)}
                      />
              }
              <IconButton
                title={product.discontinued ? 'add_circle_outline' : 'remove_circle_outline'}
                action={() => onProductToggleDiscontinue(product.id)}
                className={S.discontinueButton}
                />
              { product.discontinued
                  ? <IconButton title='delete' action={() => onProductDelete(product.id)} className={S.deleteButton}/>
                  : null
              }
            </Item>
          }
        </List>
      </Fragment>
    </Card>
  )
}
