import * as React from 'react'
import { Basic } from '../basic'
import { Input } from '../../common/input'
import { Textarea } from '../../common/textarea'
import { Icon } from '../../common/icon'
import { l } from '../../localization'
import { closeDialog as closeDialogButton } from '../action'
import { closeDialog } from '../../update/dialog'
import { loadConvention } from '../../update/helpers'
import { SaveExpense } from '../../api/save-expense'
import { Money } from '../../model/money'
import { EMPTY, INVALID, VALID } from '../../model/validation'
import * as toast from '../../toast'
import type { Expense } from '../../model/expense'
import type { IdentifiableConvention } from '../../model/convention'
import type { Validation } from '../../common/input'
import S from './index.css'

export type Props = {
  name: 'new-expense',
  convention: IdentifiableConvention,
  expense?: ?Expense
}

type State = {
  category: string,
  amount: Money,
  note: string,
}

export class NewExpense extends React.Component<Props, State> {
  constructor(props) {
    super(props)

    this.state = {
      category: props.expense ? props.expense.category : '',
      amount: props.expense ? props.expense.amount.toString() : Money.zero.toString(),
      note: props.expense ? props.expense.note : '',
      processing: false,
      moneyValidation: { state: EMPTY },
    }
  }

  setAmount(amount: Money) {
    let moneyValidation = { state: VALID };
    try {
      const money = Money.parse(amount);
      if (money.amount === 0) {
        moneyValidation = { state: INVALID, error: l`The amount cannot be zero` }
      }
    } catch (error) {
      moneyValidation = { state: INVALID, error: l`The amount is invalid` }
    }
    this.setState({ amount, moneyValidation })
  }

  async saveChanges() {
    const { expense, convention: { id: conId } } = this.props
    const { category, amount, note } = this.state
    this.setState({ processing: true })
    let action
    if (expense) {
      action = { action: 'update', category, amount: Money.parse(amount), note }
    } else {
      action = { action: 'create', conId, category, amount: Money.parse(amount), note }
    }
    const response = await new SaveExpense()
      .send(action)
      .toPromise()
    try {
      await loadConvention(conId)
    } catch (_) { /* ignore */ }
    this.setState({ processing: false })
    if (response.state === 'failed') {
      toast.show(<span>{l`It seems something went wrong.`} <Icon name='warning'/></span>)
    } else {
      toast.show(<span>{l`Expense saved`} <Icon name='check'/></span>)
      closeDialog()
    }
  }

  render() {
    const { expense: editing } = this.props
    const { category, amount, note, moneyValidation, processing } = this.state
    const save = {
      enabled: !!category && moneyValidation.state === VALID && !processing,
      title: 'Save',
      action: () => this.saveChanges(),
    }
    const title = editing ? l`Editing Expense` : l`New Expense`

    return (
      <Basic title={title} onClose={closeDialogButton} onContinue={save}>
        <div className={S.form}>
          <Input
            className={S.formItem}
            defaultValue={category}
            placeholder={l`Category`}
            title={l`Category`}
            onChange={category => this.setState({ category })}
            />
          <Input
            className={S.formItem}
            defaultValue={amount}
            placeholder={l`Amount`}
            title={l`Amount`}
            onChange={amount => this.setAmount(amount)}
            validation={moneyValidation}
            />
          <Textarea
            className={S.full}
            defaultValue={note}
            placeholder={l`Note`}
            onChange={note => this.setState({ note })}
            />
        </div>
      </Basic>
    )
  }
}

export default NewExpense;
