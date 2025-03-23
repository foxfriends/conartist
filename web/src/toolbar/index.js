/*       */
import * as React from "react";

import { BehaviorSubject } from "rxjs";

import LOGO from "../../images/logo.png";
import S from "./index.css";

import { Button } from "../common/button";
import { Icon } from "../common/icon";
import { Input } from "../common/input";
import { focus as focusNavigation } from "../navigation/focus";
import * as navigate from "../update/navigate";
import { isSignedIn } from "../util/is-signed-in";

export const status = new BehaviorSubject({ primary: null, secondary: null });

export function Toolbar({
  className,
  primary,
  secondary,
  tertiary,
  textField,
  pageIcon,
}) {
  return (
    <div className={`${S.toolbar} ${className}`}>
      <div className={S.inner}>
        <div
          className={`${S.logoContainer} ${S.desktop}`}
          onClick={() =>
            isSignedIn() ? navigate.dashboard() : navigate.splash()
          }
        >
          <img className={S.logo} src={LOGO} height={44} />
          <span className={S.title}>ConArtist</span>
        </div>
        <div
          className={`${S.logoContainer} ${S.mobile}`}
          onClick={() => (isSignedIn() ? focusNavigation() : navigate.splash())}
        >
          <img
            className={`${S.logo} ${pageIcon ? S.hidden : ""}`}
            src={LOGO}
            height={44}
          />
          {pageIcon ? <Icon className={S.pageIcon} name={pageIcon} /> : null}
        </div>
        {textField ? (
          <Input
            className={S.textField}
            title={textField.title}
            onChange={textField.onChange || (() => {})}
            placeholder={textField.title}
            onSubmit={textField.onSubmit || (() => {})}
            action={textField.action || null}
          />
        ) : null}
        {tertiary ? (
          <Button {...tertiary} priority="tertiary" className={S.action} />
        ) : null}
        {secondary ? (
          <Button {...secondary} priority="tertiary" className={S.action} />
        ) : null}
        {primary ? (
          <Button {...primary} priority="primary" className={S.action} />
        ) : null}
      </div>
    </div>
  );
}
