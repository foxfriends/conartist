/*       */
import * as React from "react";
import * as ReactX from "../../react-ext";
import { filter, map, takeUntil, tap } from "rxjs/operators";

import { List } from "./index";
import { dragStart, dragEvents } from "../../drag";

import S from "./index.css";

// $FlowIgnore
export class AutoList extends ReactX.Component {
  dragIdentifier;
  // $FlowIgnore
  containerRef;

  static getDerivedStateFromProps(props) {
    return {
      data: [...props.dataSource],
    };
  }

  constructor(props) {
    super(props);
    this.dragIdentifier = Symbol();
    this.containerRef = React.createRef();
    this.state = {
      data: [...props.dataSource],

      dragValue: null,
      dragIndex: null,
      dragPosition: null,
    };

    dragEvents
      .pipe(
        takeUntil(this.unmounted),
        tap((event) => {
          const { reorderable } = this.props;
          const {
            dragValue,
            dragIndex,
            data: [...data],
          } = this.state;
          if (
            reorderable &&
            dragIndex !== null &&
            dragValue !== null &&
            !event.target
          ) {
            const [removed] = data.splice(dragValue, 1);
            data.splice(
              dragIndex > dragValue ? dragIndex - 1 : dragIndex,
              0,
              removed,
            );
            reorderable(dragValue, dragIndex);
            this.setState({ data, dragIndex: null, dragValue: null });
          }
        }),
        filter((event) => event.target === this.dragIdentifier),
        map((event) => event.position),
        map((position) => {
          const { current: currentRef } = this.containerRef;
          if (!currentRef) {
            return null;
          }
          const { data } = this.state;
          const [, absY] = position;
          const { top } = currentRef.getBoundingClientRect();
          const relY = absY - top;
          const rowHeight = 50;
          return Math.min(
            Math.max(0, Math.round(relY / rowHeight)),
            data.length,
          );
        }),
      )
      .subscribe((dragIndex) => this.setState({ dragIndex }));
  }

  render() {
    const { className, style, children, reorderable } = this.props;
    const { data, dragIndex } = this.state;
    const [emptyState, transformer, footer] =
      children instanceof Array ? [...children] : [, children];
    const onDragStart = reorderable
      ? (value, index) => {
          this.setState({ dragValue: value, dragIndex: index });
          dragStart(this.dragIdentifier);
        }
      : null;

    const contents = data.map((item, index) =>
      transformer(item, index, { index, onDragStart }),
    );
    if (dragIndex !== null) {
      contents.splice(
        dragIndex,
        0,
        <div key="drag-indicator" className={S.dragIndicator} />,
      );
    }

    return (
      <List
        className={className}
        style={style}
        containerRef={this.containerRef}
      >
        {data.length === 0 ? emptyState || "" : contents}
        {footer || null}
      </List>
    );
  }
}
