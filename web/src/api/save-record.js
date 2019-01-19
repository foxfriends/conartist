/* @flow */
import type { Observable } from 'rxjs/Observable'
import { from } from 'rxjs'
import { map, flatMap } from 'rxjs/operators'
import format from 'date-fns/format'
import uuid from 'uuid/v4'

import { GraphQLMutation } from './index'
import { parse } from '../model/record'
import { RFC3339 } from '../constants'
import type { Record } from '../model/record'
import type { Response, APIRequest, APIError } from './index'
import type {
  AddRecord as AddRecordMutation,
  AddRecordMutationVariables,
  UpdateRecord as UpdateRecordMutation,
  UpdateRecordMutationVariables,
  DeleteRecord as DeleteRecordMutation,
  DeleteRecordMutationVariables,
} from './schema'

export type Params = Create | Update | Delete

type Create = {|
  action: 'create',
  category: string,
  amount: Money,
  note: string,
|}

type Update = {|
  action: 'update',
  recordId: number,
  products: number[],
  price: Money,
  info: string,
|}

type Delete = {|
  action: 'delete',
  recordId: number,
|}

export class SaveRecord implements APIRequest<Params, Record> {
  addRecord: GraphQLMutation<AddRecordMutationVariables, AddRecordMutation>
  updateRecord: GraphQLMutation<UpdateRecordMutationVariables, UpdateRecordMutation>
  deleteRecord: GraphQLMutation<DeleteRecordMutationVariables, DeleteRecordMutation>

  constructor() {
    // $FlowIgnore: trouble importing graphql files
    const addRecord = import(/* webpackChunkName: 'sales' */ './graphql/mutation/add-record.graphql')
    const updateRecord = import(/* webpackChunkName: 'sales' */ './graphql/mutation/update-record.graphql')
    const deleteRecord = import(/* webpackChunkName: 'sales' */ './graphql/mutation/delete-record.graphql')
    this.addRecord = addRecord.then(addRecord => new GraphQLMutation(addRecord.default))
    this.updateRecord = updateRecord.then(updateRecord => new GraphQLMutation(updateRecord.default))
    this.deleteRecord = deleteRecord.then(deleteRecord => new GraphQLMutation(deleteRecord.default))
  }

  send(action: Params): Observable<Response<Record, string>> {
    switch (action.action) {
      case 'create': {
        const variables = {
          record: {
            conId: action.conId,
            uuid: uuid(),
            products: action.products,
            price: action.amount.toJSON(),
            info: action.info,
            time: format(new Date(), RFC3339),
          }
        }
        return from(this.addRecord)
          .pipe(
            flatMap(req => req.send(variables)),
            map(response => response.state === 'retrieved'
              ? { state: 'retrieved', value: parse(response.value.addUserRecord) }
              : response
            )
          )
      }
      case 'update': {
        const variables = {
          record: {
            recordId: action.recordId,
            products: action.products,
            price: action.amount.toJSON(),
            info: action.info,
          }
        }
        return from(this.updateRecord)
          .pipe(
            flatMap(req => req.send(variables)),
            map(response => response.state === 'retrieved'
              ? { state: 'retrieved', value: parse(response.value.modUserRecord) }
              : response
            )
          )
      }
      case 'delete': {
        const variables = {
          record: {
            recordId: action.recordId,
          }
        }
        return from(this.deleteRecord)
          .pipe(
            flatMap(req => req.send(variables)),
            map(response => response.state === 'retrieved'
              ? { state: 'retrieved', value: null }
              : response
            )
          )
      }
    }
  }
}
