import * as React from 'react';
import { animated, Transition, interpolate } from 'react-spring';

interface SpringMorphProps extends React.HTMLAttributes<HTMLDivElement> {
  fromClass: string;
  toClass: string;
  children: (params: SpringMorphParameters) => React.ReactNode;
}

export interface SpringMorphParameters {
  from: () => { ref: React.Ref<any> };
  to: () => { ref: React.Ref<any> };
  toggle: () => void;
}

interface SpringMorphState {
  state: 'from' | 'to';
  morph: {
    from: {
      scaleX: number;
      scaleY: number;
      translateX: number;
      translateY: number;
    };
    leave: {
      scaleX: number;
      scaleY: number;
      translateX: number;
      translateY: number;
    };
  };
}

export class SpringMorph extends React.Component<SpringMorphProps> {
  state: SpringMorphState = {
    state: 'from',
    morph: {
      from: {
        scaleX: 1,
        scaleY: 1,
        translateX: 0,
        translateY: 0,
      },
      leave: {
        scaleX: 1,
        scaleY: 1,
        translateX: 0,
        translateY: 0,
      },
    },
  };

  //FROM compute scale/transform for [to] to correspond to [from]

  //ENTER neutral scale/transform

  //LEAVE compute scale/transform for [from] to correspond to [to]

  /**
   * start: [from]
   * transition: [from] leave and [to] come
   * [from] has to go to [to] (to -> leave prop)
   * [to] has to go from [from] to [to] (from -> from prop) and (to -> enter prop)
   */

  boxFrom: IBox;
  boxTo: IBox;

  from = () => ({
    ref: (node: HTMLDivElement) => {
      const element = node;
      console.log('from ref', node);
      if (!element || this.boxFrom) {
        return;
      }
      this.boxFrom = getBox(element);
    },
  });

  to = () => ({
    ref: (node: HTMLDivElement) => {
      console.log('to ref', node);
      const element = node;
      if (!element || this.boxTo) {
        return;
      }
      this.boxTo = getBox(element);

      const leave = diffRect(this.boxFrom, this.boxTo);
      const from = diffRect(this.boxTo, this.boxFrom);
      this.setState({
        morph: {
          ...this.state.morph,
          from,
          leave,
        },
      } as SpringMorphState);
    },
  });

  toggle = () => {
    if (this.state.state === 'from') {
      return this.setState({ state: 'to', morph: { from: this.state.morph.to, to: this.state.morph.from } });
    }
    return this.setState({ state: 'from', morph: { from: this.state.morph.to, to: this.state.morph.from } });
  };

  render() {
    const { fromClass, toClass, children, ...defaultProps } = this.props;
    const toRender: any = children({
      from: this.from,
      to: this.to,
      toggle: this.toggle,
    });
    const childrenArr = toRender.props.children;
    const { from, leave } = this.state.morph;
    const enter = { opacity: 1, scaleX: 1, scaleY: 1, translateX: 0, translateY: 0 };
    console.log('enter, from, leave', enter, from, leave);
    return (
      <React.Fragment>
        <Transition
          native
          keys={[this.state.state]}
          from={{ ...from, opacity: 0 }}
          enter={enter}
          leave={{ ...leave, opacity: 0 }}
        >
          {[
            ({ opacity, scaleX, scaleY, translateX, translateY }) => {
              const styles = {
                opacity,
                transform: interpolate(
                  [scaleX, scaleY, translateX, translateY],
                  (sX, sY, tX, tY) => `scale(${sX}, ${sY}) translate(${tX}px, ${tY}px)`
                ),
              };
              // console.log('Transition function evaluated !');
              // console.log('state', this.state.state);
              if (this.state.state === 'from') {
                // console.log('display 0', childrenArr[0]);
                return (
                  <animated.div {...defaultProps} className={fromClass} style={styles}>
                    {childrenArr[0]}
                  </animated.div>
                );
              }
              // console.log('display 1', childrenArr[1]);
              return (
                <animated.div {...defaultProps} className={toClass} style={styles}>
                  {childrenArr[1]}
                </animated.div>
              );
            },
          ]}
        </Transition>
      </React.Fragment>
    );
  }
}

interface IBox {
  top: number;
  left: number;
  width: number;
  height: number;
}

const diffRect = (a: IBox, b: IBox) => ({
  translateY: a.top - b.top,
  translateX: a.left - b.left,
  scaleY: a.height / b.height,
  scaleX: a.width / b.width,
});

const getBox = (elm: HTMLDivElement): IBox => {
  const box = elm.getBoundingClientRect();

  return {
    top: box.top + window.scrollY,
    left: box.left + window.scrollX,
    width: box.width,
    height: box.height,
  };
};
