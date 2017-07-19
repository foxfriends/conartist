import { Component, Input, Inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ProductPipe } from '../data/product.pipe';
import { TypePipe } from '../data/type.pipe';
import { ConDataSource } from '../data/data-source';
import template from './record-list.component.html';
import styles from './record-list.component.scss';

type ColumnName = 'type' | 'products' | 'price' | 'time';

const unique = <T>(v: T, i: number, arr: T[]): boolean => arr.indexOf(v) === i;

@Component({
  selector: 'con-record-list',
  template: template,
  styles: [ styles ],
})
export class RecordListComponent implements OnInit {
  readonly displayedColumns: ColumnName[] = ['type', 'products', 'price', 'time'];
  @Input() con: Observable<ca.FullConvention>;
  dataSource: ConDataSource<ca.Record>;

  constructor(
    @Inject(ProductPipe) private productPipe: ProductPipe,
    @Inject(TypePipe) private typePipe: TypePipe,
  ) {}

  ngOnInit() {
    this.dataSource = new ConDataSource(this.con.map(_ => _.data.records));
  }

  type(record: ca.Record): ca.ProductType {
    const products = record.products.filter(unique).map(_ => this.productPipe.transform(_));
    const typeIds = products.map(_ => _.type).filter(unique);
    if(typeIds.length === 1) {
      return this.typePipe.transform(typeIds[0]);
    } else {
      return { color: 0xFFFFFF, name: '?', discontinued: false, id: -1 };
    }
  }

  products(record: ca.Record): string {
    const products = record.products.reduce((_, product) => ({ ..._, [product]: (_[product] || 0) + 1 }), {} as { [key: number]: number });
    return (Object.entries(products) as [string, number][])
      .map(([product, count]) => this.productPipe.transform(+product, 'name') + (count === 1 ? '' : ` (${count})`))
      .join(', ');
  }
}
