/*       */
import * as React from "react";
import { BehaviorSubject, combineLatest } from "rxjs";
import { skip, switchMap } from "rxjs/operators";

import IMAGE from "../../../images/email.png";
import { l, lx } from "../../localization";
import { Input } from "../../common/input";
import { Icon } from "../../common/icon";
import { Tooltip } from "../../common/tooltip";
import { Form } from "../form";
import { EmailInUseRequest } from "../../api/email-in-use";
import { EMPTY, VALID, INVALID } from "../../model/validation";
import { EMAIL_FORMAT } from "../../constants";

import S from "../form.css";

export class EmailForm extends React.Component {
  // $FlowIgnore: Flow definitions not up to date
  confirmInput;
  email;
  confirmEmail;

  emailInUse;

  constructor(props) {
    super(props);
    this.confirmInput = React.createRef();
    this.email = new BehaviorSubject("");
    this.confirmEmail = new BehaviorSubject("");
    this.emailInUse = new EmailInUseRequest();
    this.state = {
      email: "",
      confirmEmail: "",
      emailValidation: { state: EMPTY },
      mismatchValidation: { state: EMPTY },
    };

    this.email.pipe(skip(1)).subscribe((email) => this.setState({ email }));
    this.confirmEmail
      .pipe(skip(1))
      .subscribe((confirmEmail) => this.setState({ confirmEmail }));

    combineLatest(this.email, this.confirmEmail)
      .pipe(
        skip(1),
        switchMap(([email, confirmEmail]) =>
          this.validate(email, confirmEmail),
        ),
      )
      .subscribe((validations) =>
        this.setState({ ...validations }, () => {
          this.props.onValidate(
            this.state.emailValidation.state === VALID &&
              this.state.mismatchValidation.state === VALID,
          );
        }),
      );
  }

  componentWillUnmount() {
    this.email.complete();
    this.confirmEmail.complete();
  }

  handleEmailChange(value) {
    const { onChange, onValidate } = this.props;
    const trimmed = value.replace(/(^\s+|\s+$)/g, "");
    onChange(trimmed);
    this.email.next(trimmed);
  }

  handleConfirmEmailChange(value) {
    const { onChange, onValidate } = this.props;
    const trimmed = value.replace(/(^\s+|\s+$)/g, "");
    this.confirmEmail.next(trimmed);
  }

  async validate(email, confirmEmail) {
    let emailValidation = { state: VALID };
    let mismatchValidation = { state: VALID };
    if (email === "") {
      emailValidation = { state: EMPTY };
    } else if (!EMAIL_FORMAT.test(email)) {
      emailValidation = { state: INVALID, error: l`Your email looks wrong` };
    } else if ((await this.emailInUse.send(email).toPromise()).value) {
      emailValidation = {
        state: INVALID,
        error: l`That email is already being used`,
      };
    }

    if (confirmEmail === "") {
      mismatchValidation = { state: EMPTY };
    } else if (email !== confirmEmail) {
      mismatchValidation = {
        state: INVALID,
        error: l`Your emails don't match`,
      };
    }
    return { emailValidation, mismatchValidation };
  }

  render() {
    const { onSubmit } = this.props;
    const { emailValidation, mismatchValidation } = this.state;
    return (
      <Form image={IMAGE} imageWidth={200}>
        <div className={S.question}>
          {l`Can I get your email?`}
          <Tooltip title={lx`<Email usage disclaimer>`((_) => _)}>
            <Icon className={S.info} name="info_outline" />
          </Tooltip>
        </div>
        {/* $FlowIgnore: Flow definitions not up to date */}
        <Input
          className={S.input}
          placeholder={l`Email`}
          onChange={(email) => this.handleEmailChange(email)}
          onSubmit={() =>
            this.confirmInput.current && this.confirmInput.current.focus()
          }
          key="email"
          autoFocus
          validation={emailValidation}
        />
        <Input
          className={S.input}
          placeholder={l`And again`}
          onChange={(email) => this.handleConfirmEmailChange(email)}
          ref={this.confirmInput}
          onSubmit={onSubmit}
          validation={mismatchValidation}
        />
        <span className={S.hint}>
          {l`We won't send you anything.`}
          <br />
          {l`Promise.`}
        </span>
      </Form>
    );
  }
}
