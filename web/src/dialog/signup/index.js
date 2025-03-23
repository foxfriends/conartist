/*       */
import * as React from "react";
import { l } from "../../localization";
import { Basic } from "../basic";
import { NameForm } from "./name-form";
import { EmailForm } from "./email-form";
import { PasswordForm } from "./password-form";
import { TermsForm } from "./terms-form";
import { Completed } from "./completed";
import { progressToNextStep } from "../../update/signup";
import { closeDialog } from "../action";

export class SignUp extends React.Component {
  formDelegate;

  constructor(props) {
    super(props);
    this.state = {
      isValid: false,
      formValue: "",
    };
    this.formDelegate = {
      onValidate: (isValid) => this.setState({ isValid }),
      onChange: (formValue) => this.setState({ formValue }),
      onSubmit: () => this.handleContinue(),
    };
  }

  handleBack() {
    const { step } = this.props;
    if (step.name === "signed-in") {
      return;
    }
    this.setState({ isValid: false, formValue: "" });
    progressToNextStep(step.previous());
  }

  handleContinue() {
    if (this.state.isValid) {
      const { step } = this.props;
      if (step.name === "signed-in") {
        return;
      }
      this.setState({ isValid: false, formValue: "" });
      progressToNextStep(step.next(this.state.formValue));
    }
  }

  render() {
    const { step, ...basicProps } = this.props;
    const { isValid } = this.state;

    let form;
    let pagerProps = {
      pages: 5,
      page: 0,
    };

    const onContinue = {
      title: l`Continue`,
      action: () => this.handleContinue(),
      priority: "primary",
      enabled: isValid,
    };

    let onBack = {
      title: l`Back`,
      action: () => this.handleBack(),
      priority: "secondary",
    };

    switch (step.name) {
      case "name":
        pagerProps.page = 0;
        onBack = null;
        form = <NameForm {...this.formDelegate} />;
        break;
      case "email":
        pagerProps.page = 1;
        form = <EmailForm {...this.formDelegate} />;
        break;
      case "password":
        pagerProps.page = 2;
        form = <PasswordForm {...this.formDelegate} />;
        break;
      case "terms":
        pagerProps.page = 3;
        form = <TermsForm {...this.formDelegate} />;
        break;
      case "completed":
        pagerProps.page = 4;
        onBack = null;
        onContinue.title = l`Finish`;
        const account = {
          // $FlowIgnore: Flow failing at enums again
          name: step.username,
          // $FlowIgnore: Flow failing at enums again
          email: step.email,
          // $FlowIgnore: Flow failing at enums again
          password: step.password,
        };
        form = <Completed {...this.formDelegate} account={account} />;
        break;
    }

    return (
      <Basic
        title={l`Sign up`}
        onContinue={onContinue}
        onBack={onBack}
        onClose={closeDialog}
        pager={pagerProps}
      >
        {form}
      </Basic>
    );
  }
}

export default SignUp;
