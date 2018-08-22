import * as React from 'react';
import { Morph, MorphParameters } from './morph';

interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  addItem: (content: string) => void;
}

export class Item extends React.PureComponent<ItemProps> {
  constructor(props) {
    super(props);
    this.handleMorph = this.handleMorph.bind(this);
  }

  handleMorph(data: MorphParameters) {
    const { children } = this.props;
    return <div>{children}</div>;
  }

  render() {
    return <Morph>{this.handleMorph}</Morph>;
  }
}
