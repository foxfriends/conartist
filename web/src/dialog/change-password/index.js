/*       */
import * as React from "react";

import { l } from "../../localization";
import { Input } from "../../common/input";
import { Button } from "../../common/button";
import { Icon } from "../../common/icon";
import { Basic } from "../basic";
import { ChangePasswordRequest } from "../../api/change-password";

import { closeDialog as closeDialogButton } from "../action";
import { closeDialog } from "../../update/dialog";
import * as toast from "../../toast";
import { VALID, EMPTY, INVALID } from "../../model/validation";
import { MIN_PASSWORD_LENGTH } from "../../constants";
import S from "./index.css";

// NOTE: this component shares a lot of things with sign up password form... Maybe some code sharing
//       should be done... also the reset password form
export class ChangePassword extends React.Component {
  // $FlowIgnore: Flow definitions not up to date
  passwordInput;
  // $FlowIgnore: Flow definitions not up to date
  confirmInput;

  constructor(props) {
    super(props);
    this.confirmInput = React.createRef();
    this.passwordInput = React.createRef();
    this.state = {
      currentPassword: "",
      password: "",
      confirmPassword: "",
      processing: false,
      passwordValidation: { state: EMPTY },
      mismatchValidation: { state: EMPTY },
      currentPasswordValidation: { state: VALID },
    };
  }

  handleCurrentPasswordChange(value) {
    this.setState({
      currentPassword: value,
      currentPasswordValidation: { state: VALID },
    });
  }

  handlePasswordChange(value) {
    this.validate(value, this.state.confirmPassword);
    this.setState({ password: value });
  }

  handleConfirmPasswordChange(value) {
    this.validate(this.state.password, value);
    this.setState({ confirmPassword: value });
  }

  validate(password, confirmPassword) {
    let passwordValidation = { state: VALID };
    let mismatchValidation = { state: VALID };
    if (password === "") {
      passwordValidation = { state: EMPTY };
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      passwordValidation = {
        state: INVALID,
        error: l`Your password is too short`,
      };
    }
    if (confirmPassword === "") {
      mismatchValidation = { state: EMPTY };
    } else if (password !== confirmPassword) {
      mismatchValidation = {
        state: INVALID,
        error: l`Your passwords don't match`,
      };
    }
    this.setState({ passwordValidation, mismatchValidation });
  }

  async saveChanges() {
    const { currentPassword, password } = this.state;
    this.setState({ processing: true });
    const response = await new ChangePasswordRequest()
      .send({ old: currentPassword, new: password })
      .toPromise();
    this.setState({ processing: false });
    if (response.state === "failed") {
      this.setState({
        currentPasswordValidation: {
          state: INVALID,
          error: l`Your password is incorrect`,
        },
      });
    } else {
      toast.show(
        <>
          {l`Password changed successfully`} <Icon name="check" />
        </>,
      );
      closeDialog();
    }
  }

  render() {
    const {
      currentPasswordValidation,
      passwordValidation,
      mismatchValidation,
      processing,
    } = this.state;
    const save = {
      enabled:
        passwordValidation.state === VALID &&
        mismatchValidation.state === VALID &&
        !processing,
      title: "Save",
      action: () => {
        this.saveChanges();
      },
    };
    return (
      <Basic
        title={l`Change Password`}
        onClose={closeDialogButton}
        onContinue={save}
      >
        <div className={S.form}>
          {/* $FlowIgnore: Flow definitions not up to date */}
          <Input
            className={S.input}
            type="password"
            title={l`Current password`}
            onChange={(password) => this.handleCurrentPasswordChange(password)}
            onSubmit={() =>
              this.passwordInput.current && this.passwordInput.current.focus()
            }
            validation={currentPasswordValidation}
            autoFocus
          />
          {/* $FlowIgnore: Flow definitions not up to date */}
          <Input
            className={S.input}
            type="password"
            title={l`New password`}
            onChange={(password) => this.handlePasswordChange(password)}
            onSubmit={() =>
              this.confirmInput.current && this.confirmInput.current.focus()
            }
            ref={this.passwordInput}
            validation={passwordValidation}
          />
          <Input
            className={S.input}
            type="password"
            title={l`Confirm new password`}
            onChange={(password) => this.handleConfirmPasswordChange(password)}
            ref={this.confirmInput}
            onSubmit={() => {
              this.saveChanges();
            }}
            validation={mismatchValidation}
          />
        </div>
      </Basic>
    );
  }
}

export default ChangePassword;
