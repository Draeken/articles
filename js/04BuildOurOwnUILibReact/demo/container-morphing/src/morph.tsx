import * as React from 'react';
import { animated, AnimatedValue, controller as spring, interpolate } from 'react-spring';

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
  displayTo: boolean;
}

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
      if (!element || this.boxFrom) {
        return;
      }
      this.boxFrom = getBox(element);
    },
  });

  to = () => ({
    ref: (node: HTMLDivElement) => {
      const element = node;
      if (!element || this.boxTo) {
        return;
      }
      this.boxTo = getBox(element);

      this.fromMorph = diffRect(this.boxFrom, this.boxTo);
      this.toMorph = diffRect(this.boxTo, this.boxFrom);
      this.fromMorph.forEach((morphVal, i) => this.toAnimations[i + 1].setValue(morphVal));
    },
  });

  toggle = () => {
    if (this.state.state === 'from') {
      return this.setState({ state: 'to', displayTo: true }, this.launchAnimation);
    }
    return this.setState({ state: 'from' }, this.launchAnimation);
  };

  launchAnimation = () => {
    if (this.state.state === 'to') {
      const [fromOpacity, ...fromMorpProps] = this.fromAnimations;
      const [toOpacity, ...toMorpProps] = this.toAnimations;
      spring(fromOpacity, { to: 0 }).start();
      fromMorpProps.forEach((anim, i) => {
        spring(anim, { to: this.toMorph[i] }).start();
      });
      spring(toOpacity, { to: 1 }).start();
      toMorpProps.forEach((anim, i) => {
        spring(anim, { to: this.neutralMorph[i] }).start();
      });
    } else {
      const [fromOpacity, ...fromMorpProps] = this.fromAnimations;
      const [toOpacity, ...toMorpProps] = this.toAnimations;
      spring(fromOpacity, { to: 1 }).start();
      fromMorpProps.forEach((anim, i) => {
        spring(anim, { to: this.neutralMorph[i] }).start();
      });
      spring(toOpacity, { to: 0 }).start(() => this.setState({ displayTo: false }));
      toMorpProps.forEach((anim, i) => {
        spring(anim, { to: this.fromMorph[i] }).start();
      });
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
    const { fromClass, toClass, children, ...defaultProps } = this.props;
    const toRender: any = children({
      from: this.from,
      to: this.to,
      toggle: this.toggle,
    });
    const childrenArr = toRender.props.children;
    return (
      <React.Fragment>
        <animated.div
          key="from"
          {...defaultProps}
          className={fromClass}
          style={this.interpolateSTyles(this.fromAnimations)}
        >
          {childrenArr[0]}
        </animated.div>
        {this.state.displayTo && (
          <animated.div
            key="to"
            {...defaultProps}
            className={toClass}
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

const diffRect = (a: IBox, b: IBox) => {
  const scaleY = a.height / b.height;
  const scaleX = a.width / b.width;
  const translateY = a.top - b.top;
  const translateX = a.left - b.left;
  return [scaleX, scaleY, translateX, translateY];
};

const getBox = (elm: HTMLDivElement): IBox => {
  const box = elm.getBoundingClientRect();

  return {
    top: box.top + window.scrollY,
    left: box.left + window.scrollX,
    width: box.width,
    height: box.height,
  };
};
