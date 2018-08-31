import * as React from 'react';
import { css } from 'emotion';
import { SpringMorph, SpringMorphParameters } from './morph';

const fromClassname = css`
  width: 100px;
`;

const toClassname = css`
  position: absolute;
  top: 120px;
  left: 70px;
  width: 150px;
  border: 2px solid black;
`;

export class Root extends React.PureComponent<{}> {
  state: {
    state: 'from' | 'to';
  };

  constructor(props) {
    super(props);
    this.state = { state: 'from' };
  }

  render() {
    return (
      <React.Fragment>
        <span>test1</span>
      <SpringMorph fromClass={fromClassname} toClass={toClassname}>
        {(params: SpringMorphParameters) => {
          return <React.Fragment>
            <div {...params.from()} onClick={() => params.toggle()}>TEST FROM</div>
            <div {...params.to()} onClick={() => params.toggle()}>TEST TO</div>
          </React.Fragment>;
        }}
      </SpringMorph>
      <span>test2</span>
      </React.Fragment>
    );
  }
}
