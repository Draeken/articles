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
        <div {...data.from('card')} onClick={() => data.go(1)}>
          <div>{item ? item.content : 'add'}</div>
        </div>
        <div {...data.from('edit-content')} />
        <div className={editClass} {...data.to('card')} />
        <div className={editClass} {...data.to('edit-content')}>
          <div {...data.fadeIn({ times: [0.4, 1] })}>
            <span>content: </span>
            <input type="text" value={this.state.content} onChange={this.handleChange} />
            <button
              onClick={() => {
                this.handleValidate();
                this.setState({ content: '' });
              }}
            >
              VALIDATE
            </button>
          </div>
        </div>
        <input
          type="range"
          defaultValue="100"
          onChange={({ target: { value } }) => data.go(+value / 100)}
          step="0.01"
          style={{
            position: 'absolute',
            zIndex: 9999,
            bottom: 10,
            width: '90%',
          }}
        />
      </div>
    );
  }

  render() {
    return <Morph>{this.handleMorph}</Morph>;
  }
}
