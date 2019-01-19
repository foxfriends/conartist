/* @flow */
import type { Observable } from 'rxjs/Observable'
import { from } from 'rxjs'
import { map, flatMap } from 'rxjs/operators'
import format from 'date-fns/format'
import uuid from 'uuid/v4'

import { GraphQLMutation } from './index'
import { parse } from '../model/expense'
import { RFC3339 } from '../constants'
import type { Expense } from '../model/expense'
import type { Response, APIRequest, APIError } from './index'
import type {
  AddExpense as AddExpenseMutation,
  AddExpenseMutationVariables,
  UpdateExpense as UpdateExpenseMutation,
  UpdateExpenseMutationVariables,
  DeleteExpense as DeleteExpenseMutation,
  DeleteExpenseMutationVariables,
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
  expenseId: number,
  category: string,
  amount: Money,
  note: string,
|}

type Delete = {|
  action: 'delete',
  expenseId: number,
|}

export class SaveExpense implements APIRequest<Params, Expense> {
  addExpense: GraphQLMutation<AddExpenseMutationVariables, AddExpenseMutation>
  updateExpense: GraphQLMutation<UpdateExpenseMutationVariables, UpdateExpenseMutation>
  deleteExpense: GraphQLMutation<DeleteExpenseMutationVariables, DeleteExpenseMutation>

  constructor() {
    // $FlowIgnore: trouble importing graphql files
    const addExpense = import(/* webpackChunkName: 'sales' */ './graphql/mutation/add-expense.graphql')
    const updateExpense = import(/* webpackChunkName: 'sales' */ './graphql/mutation/update-expense.graphql')
    const deleteExpense = import(/* webpackChunkName: 'sales' */ './graphql/mutation/delete-expense.graphql')
    this.addExpense = addExpense.then(addExpense => new GraphQLMutation(addExpense.default))
    this.updateExpense = updateExpense.then(updateExpense => new GraphQLMutation(updateExpense.default))
    this.deleteExpense = deleteExpense.then(deleteExpense => new GraphQLMutation(deleteExpense.default))
  }

  send(action: Params): Observable<Response<Expense, string>> {
    switch (action.action) {
      case 'create': {
        const variables = {
          expense: {
            conId: action.conId,
            uuid: uuid(),
            category: action.category,
            price: action.amount.toJSON(),
            description: action.note,
            time: format(new Date(), RFC3339),
          }
        }
        return from(this.addExpense)
          .pipe(
            flatMap(req => req.send(variables)),
            map(response => response.state === 'retrieved'
              ? { state: 'retrieved', value: parse(response.value.addUserExpense) }
              : response
            )
          )
      }
      case 'update': {
        const variables = {
          expense: {
            expenseId: action.expenseId,
            category: action.category,
            price: action.amount.toJSON(),
            description: action.note,
          }
        }
        return from(this.updateExpense)
          .pipe(
            flatMap(req => req.send(variables)),
            map(response => response.state === 'retrieved'
              ? { state: 'retrieved', value: parse(response.value.modUserExpense) }
              : response
            )
          )
      }
      case 'delete': {
        const variables = {
          expense: {
            expenseId: action.expenseId,
          }
        }
        return from(this.deleteExpense)
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
