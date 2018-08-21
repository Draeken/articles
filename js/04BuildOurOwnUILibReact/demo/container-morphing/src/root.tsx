import { css } from 'emotion';
import * as React from 'react';

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

const childStyle = css`
  ${baseStyles};
`;

const addStyle = (createNew: boolean) => {
  if (!createNew) {
    return css`
      display: none;
    `;
  }
  return css`
    position: absolute;
    top: 25%;
    left: 25%;
    border: 1px solid #fafa;
    padding: 8px;
  `;
};

export class Root extends React.PureComponent<{}> {
  state: {
    createNew: boolean;
    items: Array<{ id: number; content: string }>;
    content: string;
  };

  private addRef = React.createRef<HTMLDivElement>();

  constructor(props) {
    super(props);
    this.state = { createNew: false, items: [], content: '' };
    this.addClicked = this.addClicked.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  addClicked() {
    this.setState({ createNew: true });
  }

  handleChange(e) {
    this.setState({ content: e.target.value });
  }

  render() {
    const { items, createNew } = this.state;
    const itemElms = items.map(item => (
      <div key={item.id} className={childStyle}>
        {item.content}
      </div>
    ));
    return (
      <React.Fragment>
        <div className={parentStyle}>
          <div ref={this.addRef} onClick={this.addClicked} className={childStyle}>
            add
          </div>
          {itemElms}
        </div>
        <div className={addStyle(createNew)}>
          item content: <input value={this.state.content} onChange={this.handleChange} />
        </div>
      </React.Fragment>
    );
  }
}
