/*       */
import * as React from "react";

import { Icon } from "../../common/icon";
import S from "./item.css";

export class Item extends React.Component {
  render() {
    const {
      className,
      onClick,
      style,
      children,
      index,
      onDragStart,
      reorderable,
    } = this.props;

    return (
      <div
        className={`${S.item} ${onClick ? S.clickable : ""} ${className || ""}`}
        style={style || {}}
        onClick={onClick}
      >
        {children}
        {onDragStart && index !== undefined && reorderable ? (
          <span
            className={S.dragHandle}
            draggable
            onDragStart={() => onDragStart(index)}
          >
            <Icon name="drag_handle" />
          </span>
        ) : null}
      </div>
    );
  }
}
