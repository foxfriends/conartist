/*       */
import * as React from "react";

import { l, lx } from "../../localization";
import { Textarea } from "../../common/textarea";
import { Icon } from "../../common/icon";
import { Basic } from "../basic";
import { CreateSuggestion as CreateSuggestionRequest } from "../../api/create-suggestion";
import { closeDialog as closeDialogButton } from "../action";
import { closeDialog } from "../../update/dialog";
import * as update from "../../update/suggestions";
import * as toast from "../../toast";
import S from "./index.css";

export class CreateSuggestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      suggestion: "",
      processing: false,
    };
  }

  async saveChanges() {
    const { suggestion } = this.state;
    this.setState({ processing: true });
    const response = await new CreateSuggestionRequest()
      .send({ suggestion })
      .toPromise();
    this.setState({ processing: false });
    if (response.state === "failed") {
      toast.show(
        <span>
          {l`It seems something went wrong.`} <Icon name="check" />
        </span>,
      );
    } else {
      update.addSuggestion(response.value);
      toast.show(
        <span>
          {l`Thanks for your feedback!`} <Icon name="check" />
        </span>,
      );
      closeDialog();
    }
  }

  render() {
    const { suggestion, processing } = this.state;
    const save = {
      enabled: !!suggestion && !processing,
      title: "Save",
      action: () => this.saveChanges(),
    };
    return (
      <Basic
        title={l`Make a Suggestion`}
        onClose={closeDialogButton}
        onContinue={save}
      >
        <div className={S.form}>
          <Textarea
            className={S.full}
            placeholder={l`Use lots of details. Make sure we know what you want!`}
            onChange={(suggestion) => this.setState({ suggestion })}
          />
          <div className={S.disclaimer}>
            {lx`<Suggestion disclaimer>`((_) => _)}
          </div>
        </div>
      </Basic>
    );
  }
}

export default CreateSuggestion;
