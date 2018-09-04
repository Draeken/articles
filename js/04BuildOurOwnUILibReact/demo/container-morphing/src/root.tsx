import { css } from 'emotion';
import * as React from 'react';
import { SpringMorph, SpringMorphParameters } from './morph';

const fromClassname = css`
  display: inline-block;
  width: 100px;
  border: 2px solid black;
  transform-origin: top left;
`;

const toClassname = css`
  display: inline-block;
  position: absolute;
  top: 120px;
  left: 70px;
  width: 150px;
  border: 2px solid black;
  border-radius: 15px;
  padding: 15px;
  transform-origin: top left;
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
        <SpringMorph>
          {(params: SpringMorphParameters) => {
            return (
              <React.Fragment>
                <div {...params.from()} className={fromClassname} onClick={() => params.toggle()}>
                  TEST FROM
                </div>
                <div {...params.to()} className={toClassname} onClick={() => params.toggle()}>
                  <div>TEST TO</div>
                  <div>HERE</div>
                </div>
              </React.Fragment>
            );
          }}
        </SpringMorph>
        <span>test2</span>
      </React.Fragment>
    );
  }
}
