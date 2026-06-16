import React, { useState, useCallback, useId, useRef } from "react";
import { Icon } from "../icon";
import { Cover } from "../cover";
import S from "./index.css";
import { clsx } from "clsx";

export function Select({
  defaultValue,
  options,
  onChange,
  children,
  className,
  title,
}) {
  const id = useId();
  const popoverRef = useRef();
  const [value, setValue] = useState(defaultValue ?? options[0]);
  const handleOptionClicked = useCallback(
    (option) => {
      setValue(option);
      popoverRef.current?.hidePopover();
      onChange?.(option);
    },
    [onChange],
  );

  return (
    <>
      <button className={clsx(S.selection, className)} popoverTarget={id}>
        {children(value)}
        <Icon name="arrow_drop_down" className={S.arrow} />
        <span className={S.title}>{title || ""}</span>
      </button>
      <div
        id={id}
        popover="auto"
        className={S.optionsContainer}
        ref={popoverRef}
      >
        <div className={S.options}>
          {options.map((option, i) => (
            <button
              className={S.option}
              onClick={() => handleOptionClicked(option)}
              key={`option_${i}`}
            >
              {children(option)}
              {option === value && <Icon name="check" className={S.check} />}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
