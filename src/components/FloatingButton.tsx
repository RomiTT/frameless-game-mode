import React from 'react';
import { Button, MaybeElement, IconName, Intent } from '@blueprintjs/core';

interface IProps {
  position?: 'fixed' | 'absolute';
  left?: number;
  top?: number;
  text?: string;
  icon?: IconName | MaybeElement;
  intent?: Intent;
  scale?: number;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

export default class FloatingButton extends React.PureComponent<IProps> {
  static defaultProps = {
    position: 'absolute',
    left: 0,
    top: 0,
    scale: 1.0
  };

  render() {
    return (
      <div
        style={{
          position: this.props.position,
          left: this.props.left,
          top: this.props.top,
          transform: `scale(${this.props.scale === undefined ? 1 : this.props.scale})`
        }}
      >
        <Button
          text={this.props.text}
          icon={this.props.icon}
          intent={this.props.intent}
          onClick={this.props.onClick}
        />
      </div>
    );
  }
}
