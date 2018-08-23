import { css } from 'emotion';
import * as React from 'react';
import { Item } from './item';

const parentStyle = css`
  display: flex;
  width: 100%;
  border: 1px dashed #ccc;
`;

const baseStyles = css`
  padding: 16px;
  margin: 4px;
  border-radius: 8px;
  border: 1px solid #d9d4ff;
`;

export class Root extends React.PureComponent<{}> {
  state: {
    items: Array<{ id: number; content: string }>;
  };

  constructor(props) {
    super(props);
    this.state = { items: [] };
    this.addItem = this.addItem.bind(this);
  }

  addItem(content) {
    const items = this.state.items;
    const lastId = items[0] ? items[0].id : 0;
    this.setState({ items: [{ id: lastId + 1, content }, ...items] });
  }

  render() {
    const { items } = this.state;
    const itemElms = items.map(item => (
      <Item key={item.id} className={baseStyles} addItem={this.addItem} item={item} />
    ));
    return (
      <React.Fragment>
        <div className={parentStyle}>
          <Item className={baseStyles} addItem={this.addItem} />
          {itemElms}
        </div>
      </React.Fragment>
    );
  }
}
