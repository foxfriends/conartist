import React, { useState, useCallback } from "react";
import { l } from "../../localization";
import { Input } from "../../common/input";
import { Icon } from "../../common/icon";
import { Basic } from "../basic";
import { DeleteAccount as DeleteAccountMutation } from "../../api/delete-account";
import { closeDialog as closeDialogButton } from "../action";
import { closeDialog } from "../../update/dialog";
import * as update from "../../update/settings";
import * as toast from "../../toast";
import S from "./index.css";

export function DeleteAccount({ email: expectedEmail }) {
  const [email, setEmail] = useState("");
  const [processing, setProcessing] = useState(false);

  const doDelete = useCallback(async () => {
    setProcessing(true);
    const response = await new DeleteAccountMutation().send({}).toPromise();
    setProcessing(false);
    if (response.value === true) {
      update.signOut();
      toast.show(
        <>
          {l`Account deleted successfully`} <Icon email="check" />
        </>,
      );
      closeDialog();
    } else {
      toast.show(<>{l`Failed to delete account`}</>);
    }
  }, []);

  const save = {
    enabled: email === expectedEmail,
    title: "Confirm",
    action: doDelete,
  };

  return (
    <Basic
      title={l`Delete Account`}
      onClose={closeDialogButton}
      onContinue={save}
    >
      <div className={S.form}>
        <Input
          className={S.input}
          onChange={setEmail}
          placeholder={expectedEmail}
        />
        <div className={S.disclaimer}>{l`<Delete account warning>`}</div>
      </div>
    </Basic>
  );
}

export default DeleteAccount;
