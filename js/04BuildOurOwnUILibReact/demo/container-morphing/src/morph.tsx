import { css } from 'emotion';
import * as React from 'react';
import { animated, AnimatedValue, controller as spring, interpolate } from 'react-spring';

interface SpringMorphProps extends React.HTMLAttributes<HTMLDivElement> {
  children: (params: SpringMorphParameters) => React.ReactNode;
}

export interface SpringMorphParameters {
  from: () => { ref: React.Ref<any> };
  to: () => { ref: React.Ref<any> };
  toggle: () => void;
  state: 'from' | 'to';
}

interface SpringMorphState {
  state: 'from' | 'to';
  displayTo: boolean;
}

const defaultClass = css`
  display: inline-block;
`;

export class SpringMorph extends React.PureComponent<SpringMorphProps> {
  // opacity, scaleX, scaleY, translateX, translateY
  fromAnimations = [
    new AnimatedValue(1),
    new AnimatedValue(1),
    new AnimatedValue(1),
    new AnimatedValue(0),
    new AnimatedValue(0),
  ];
  toAnimations = [
    new AnimatedValue(0),
    new AnimatedValue(1),
    new AnimatedValue(1),
    new AnimatedValue(0),
    new AnimatedValue(0),
  ];
  fromMorph: number[];
  toMorph: number[];
  neutralMorph = [1, 1, 0, 0];

  state: SpringMorphState = {
    state: 'from',
    displayTo: false,
  };

  boxFrom: IBox;

  from = (): any => ({
    ref: (node: HTMLDivElement) => {
      const element = node;
      if (!element || this.boxFrom) {
        return;
      }
      this.boxFrom = getBox(element);
    },
  });

  to = (): any => ({
    ref: (node: HTMLDivElement) => {
      const element = node;
      if (!element || this.fromMorph) {
        return;
      }

      const boxTo = getBox(element);
      this.fromMorph = diffRect(this.boxFrom, boxTo);
      this.toMorph = diffRect(boxTo, this.boxFrom, true);
      this.fromMorph.forEach((morphVal, i) => this.toAnimations[i + 1].setValue(morphVal));
    },
  });

  toggle = () => {
    if (this.state.state === 'from') {
      return this.setState({ state: 'to', displayTo: true }, this.launchAnimation);
    }
    return this.setState({ state: 'from' }, this.launchAnimation);
  };

  executeAnimation = (
    fromOpaTo: number,
    toOpacTo: number,
    fromRef: number[],
    toRef: number[],
    endAnimCallBack?: () => void
  ) => {
    const [fromOpacity, ...fromMorpProps] = this.fromAnimations;
    const [toOpacity, ...toMorpProps] = this.toAnimations;
    spring(fromOpacity, { to: fromOpaTo }).start();
    fromMorpProps.forEach((anim, i) => {
      spring(anim, { to: fromRef[i] }).start();
    });
    spring(toOpacity, { to: toOpacTo }).start(endAnimCallBack);
    toMorpProps.forEach((anim, i) => {
      spring(anim, { to: toRef[i] }).start();
    });
  };

  launchAnimation = () => {
    if (this.state.state === 'to') {
      this.executeAnimation(0, 1, this.toMorph, this.neutralMorph);
    } else {
      this.executeAnimation(1, 0, this.neutralMorph, this.fromMorph, () =>
        this.setState({ displayTo: false })
      );
    }
  };

  // opacity, scaleX, scaleY, translateX, translateY
  interpolateSTyles = (animations: any[]) => {
    const [opacity, scaleX, scaleY, translateX, translateY] = animations;
    return {
      opacity,
      transform: interpolate(
        [scaleX, scaleY, translateX, translateY],
        (sX, sY, tX, tY) => `scale(${sX}, ${sY}) translate(${tX}px, ${tY}px)`
      ),
    };
  };

  render() {
    const { children, ...defaultProps } = this.props;
    const toRender: any = children({
      from: this.from,
      to: this.to,
      toggle: this.toggle,
      state: this.state.state,
    });
    const childrenArr = toRender.props.children;
    return (
      <React.Fragment>
        <animated.div
          {...defaultProps}
          className={defaultClass}
          style={this.interpolateSTyles(this.fromAnimations)}
        >
          {childrenArr[0]}
        </animated.div>
        {this.state.displayTo && (
          <animated.div
            {...defaultProps}
            className={defaultClass}
            style={this.interpolateSTyles(this.toAnimations)}
          >
            {childrenArr[1]}
          </animated.div>
        )}
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

const diffRect = (a: IBox, b: IBox, scale?: boolean) => {
  const scaleY = a.height / b.height;
  const scaleX = a.width / b.width;
  const translateY = a.top - b.top;
  const translateX = a.left - b.left;
  return scale
    ? [scaleX, scaleY, translateX / scaleX, translateY / scaleY]
    : [scaleX, scaleY, translateX, translateY];
};

const getBox = (elm: HTMLDivElement): IBox => {
  const box = elm.getBoundingClientRect();
  const iBox = {
    top: box.top + window.scrollY,
    left: box.left + window.scrollX,
    width: box.width,
    height: box.height,
  };
  return iBox;
};
