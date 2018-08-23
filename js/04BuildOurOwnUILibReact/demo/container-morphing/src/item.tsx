import { css } from 'emotion';
import * as React from 'react';
import { Morph, MorphParameters } from './morph';

interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  addItem: (content: string) => void; // should emit action
  item?: { id: number; content: string };
}

const editClass = css`
  position: absolute;
  top: 25%;
  left: 25%;
`;

export class Item extends React.PureComponent<ItemProps> {
  state: {
    content: string;
  };
  constructor(props: ItemProps) {
    super(props);
    this.state = {
      content: props.item ? props.item.content : '',
    };
    this.handleMorph = this.handleMorph.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleValidate = this.handleValidate.bind(this);
  }

  handleChange(e) {
    this.setState({ content: e.target.value });
  }

  handleValidate() {
    this.props.addItem(this.state.content);
  }

  handleMorph(data: MorphParameters) {
    const { item } = this.props;
    return (
      <div>
        <div {...data.from('content')} onClick={() => data.go(1)}>
          {item ? item.content : 'add'}
        </div>
        <div className={editClass} {...data.to('content')}>
          <span>content: </span>
          <input type="text" value={this.state.content} onChange={this.handleChange} />
          <button onClick={() => { this.handleValidate(); this.setState({ content: '' }) }}>VALIDATE</button>
        </div>
      </div>
    );
  }

  render() {
    return <Morph>{this.handleMorph}</Morph>;
  }
}
