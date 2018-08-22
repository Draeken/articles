import { ColdSubscription } from 'popmotion/lib/action/types';
import keyframes from 'popmotion/lib/animations/keyframes';
import spring from 'popmotion/lib/animations/spring';
import tween from 'popmotion/lib/animations/tween';
import value, { ValueReaction } from 'popmotion/lib/reactions/value';
import * as React from 'react';
import css from 'stylefire/lib/css';
import { keyframe } from './keyframe';

interface IBox {
  top: number;
  left: number;
  width: number;
  height: number;
}

const _pipe = (a, b) => (...args) => b(a(...args));
export const pipe = (...ops) => ops.reduce(_pipe);

const getBox = (elm: HTMLDivElement, { getMargins = false } = {}): IBox => {
  const box = elm.getBoundingClientRect();
  const styles = getComputedStyle(elm);

  return {
    top: box.top + window.scrollY - (getMargins ? parseInt(styles.marginTop || '', 10) : 0),
    left: box.left + window.scrollX - (getMargins ? parseInt(styles.marginLeft || '', 10) : 0),
    width:
      box.width +
      (getMargins
        ? parseInt(styles.marginLeft || '', 10) + parseInt(styles.marginRight || '', 10)
        : 0),
    height:
      box.height +
      (getMargins
        ? parseInt(styles.marginTop || '', 10) + parseInt(styles.marginBottom || '', 10)
        : 0),
  };
};

const getValueFromProgress = (from, to, progress) => -progress * from + progress * to + from;

const interpolateObject = (from = {}, to = {}) => t => ({
  ...Object.keys(from).reduce(
    (acc, key) => ({
      [key]: getValueFromProgress(from[key], to[key], t),
      ...acc,
    }),
    {}
  ),
});

const fadeOutTween = ({ element, options = {} }) =>
  tween({
    from: 1,
    to: 0,
    ease: p => p,
    ...options,
  }).start(v => {
    const node = element;
    node.style.opacity = v;
    if (v === 1) node.style.pointerEvents = 'all';
  });

const fadeInTween = ({ element, options = {} }) => {
  const styler = css(element);
  return keyframes({
    values: [{ opacity: 0 }, { opacity: 1 }],
    easings: [p => p],
    times: [0.8, 1],
    ...options,
  }).start(style => {
    const node = element;

    styler.set(style);

    if (style.opacity === 1) {
      node.style.pointerEvents = 'all';
    }
  });
};

const hideTween = ({ element }) => ({
  seek: pipe(
    Math.round,
    t => {
      const node = element;

      node.style.visibility = t > 0 ? 'hidden' : 'visible';
    }
  ),
});

const hide = styler => t =>
  styler.set({
    opacity: t,
    visibility: t > 0 ? 'visible' : 'hidden',
  });

const diffRect = (a: IBox, b: IBox) => ({
  translateY: a.top - b.top,
  translateX: a.left - b.left,
  scaleY: a.height / b.height,
  scaleX: a.width / b.width,
});

interface ISpring {
  restDelta?: number;
  restSpeed?: number;
  stiffness: number;
  mass?: number;
  damping: number;
}

type keyOptFunc = (key: string, opts: MorphOptions) => { ref: (node: HTMLDivElement) => void };
type optFunc = (opts: MorphOptions) => { ref: (node: HTMLDivElement) => void };

export interface MorphParameters {
  from: keyOptFunc;
  to: keyOptFunc;
  fadeIn: optFunc;
  fadeOut: optFunc;
  seek: (t: number) => void;
  go: (t: number, opts?: MorphOptions) => void;
  progress: ValueReaction;
  state: 'from' | 'to';
  hide: optFunc;
  init: (t: number) => void;
}

type childFunc = (data: MorphParameters) => React.ReactNode;

interface MorphProps {
  portalElement?: any;
  children: childFunc;
  spring?: ISpring;
}

interface MorphOptions {
  zIndex?: number;
  getMargins?: boolean;
  easing?: (a: any) => any;
}

interface ElemWithOpt {
  element: HTMLDivElement;
  options: MorphOptions;
}

export class Morph extends React.Component<MorphProps> {
  static defaultProps = {
    portalElement: document && document.body,
    spring: {
      restDelta: 0.001,
      restSpeed: 0.001,
      damping: 26,
      mass: 1,
      stiffness: 170,
    },
  };

  state: {
    state: 'from' | 'to';
  } = {
    state: 'from',
  };

  componentWillUnmount() {
    // Remove clones.
    this.elementsCloned.forEach(node => this.props.portalElement.removeChild(node));
  }

  elementFrom: {
    [key: string]: ElemWithOpt;
  } = {};
  elementTo: {
    [key: string]: ElemWithOpt;
  } = {};

  elementsCloned: HTMLDivElement[] = [];

  hideElements: ElemWithOpt[] = [];
  fadeInElements: ElemWithOpt[] = [];
  fadeOutElements: ElemWithOpt[] = [];

  isPlaying = false;
  timeline: ColdSubscription[] = [];

  hide = (options: MorphOptions) => ({
    ref: (node: HTMLDivElement) => {
      const element = node;
      this.hideElements.push({ element, options });
    },
  });

  seek = (t: number) => {
    if (t === 1 || t === 0) {
      this.setState({ state: t ? 'to' : 'from' });
    }

    this.timeline.forEach(x => (x as any).seek(t));
  };

  progress = value(0, this.seek);

  fadeIn = (options: MorphOptions) => ({
    ref: (node: HTMLDivElement) => {
      const element = node;
      if (!element) return;

      (element as any).style.willChange = 'opacity';
      element.style.pointerEvents = 'none';
      element.style.opacity = '0';
      this.fadeInElements.push({ element, options });
    },
  });

  fadeOut = (options: MorphOptions) => ({
    ref: (node: HTMLDivElement) => {
      const element = node;
      if (!element) return;

      (element as any).style.willChange = 'opacity';
      this.fadeOutElements.push({ element, options });
    },
  });

  from = (key: string, options: MorphOptions) => ({
    ref: (node: HTMLDivElement) => {
      const element = node;
      if (!element || this.elementFrom[key]) return;

      (element as any).style.willChange = 'transform';
      this.elementFrom[key] = { element, options };
    },
  });

  to = (key: string, options: MorphOptions) => ({
    ref: (node: HTMLDivElement) => {
      const element = node;
      if (!element || this.elementTo[key]) return;

      element.style.visibility = 'hidden';
      element.style.opacity = '0';
      (element as any).style.willChange = 'transform';
      this.elementTo[key] = { element, options };
    },
  });

  go = (to: number, options: MorphOptions = {}) => {
    if (!this.timeline.length) {
      this.init(to);
      return;
    }

    spring({
      from: this.progress.get(),
      to,
      ...this.props.spring,
      ...options,
    }).start(x => {
      this.progress.update(x);
      this.seek(x);
    });
  };

  /* eslint-disable max-statements */
  morph = (key: string) => {
    const {
      element: original,
      options: { zIndex = 1, getMargins = true, easing: optEasing = x => x, ...options } = {},
    } = this.elementFrom[key];
    const { element: target } = this.elementTo[key];

    const originalRect = getBox(original, { getMargins });
    const targetRect = getBox(target, { getMargins });
    const originalCloneContainer = document.createElement('div');
    const originalClone = original.cloneNode(true);

    originalCloneContainer.appendChild(originalClone);

    const originalStyler = css(original);
    const cloneStyler = css(originalCloneContainer);
    const targetStyler = css(target);

    cloneStyler.set({
      position: 'absolute',
      transformOrigin: 'top left',
      pointerEvents: 'none',
      ...originalRect,
      ...options,
      zIndex,
    });
    targetStyler.set({
      'transform-origin': 'top left',
      visibility: 'visible',
    });

    this.props.portalElement.appendChild(originalCloneContainer);
    this.elementsCloned = [...this.elementsCloned, originalCloneContainer];

    const diffStyle = diffRect(targetRect, originalRect);

    const cloneTranslateIn = interpolateObject(
      { translateX: 0, translateY: 0, scaleX: 1, scaleY: 1 },
      diffStyle
    );

    const diffTargetStyles = diffRect(originalRect, targetRect);
    const targetTranslateFLIP = interpolateObject(diffTargetStyles, {
      translateX: 0,
      translateY: 0,
      scaleX: 1,
      scaleY: 1,
    });

    this.timeline.push(
      // In and out track.
      {
        seek: keyframe({
          0.01: t => {
            hide(originalStyler)(1 - t);
          },
          30: () => {},
          100: t => {
            hide(cloneStyler)(1 - t);
          },
        }),
      },
      // Full track.
      {
        seek: keyframe({
          100: t => {
            pipe(
              optEasing,
              cloneTranslateIn,
              cloneStyler.set
            )(t);
            pipe(
              optEasing,
              targetTranslateFLIP,
              targetStyler.set
            )(t);
          },
        }),
      },
      // Half way track.
      {
        seek: keyframe({
          0.01: t => {
            hide(cloneStyler)(t);
          },
          30: t => hide(targetStyler)(t),
        }),
      }
    );

    this.isPlaying = true;
  };

  init = (to: number) => {
    if (this.timeline.length) {
      return;
    }

    Object.keys(this.elementFrom).forEach(this.morph);

    const fadeOuts = this.fadeOutElements.map(fadeOutTween);
    const fadeIns = this.fadeInElements.map(fadeInTween);
    const hidesIns = this.hideElements.map(hideTween);

    this.timeline = [...fadeOuts, ...fadeIns, ...hidesIns, ...this.timeline];

    requestAnimationFrame(() => this.go(to));
  };

  render() {
    const renderedChildren = this.props.children({
      from: this.from,
      to: this.to,
      fadeIn: this.fadeIn,
      fadeOut: this.fadeOut,
      seek: this.seek,
      go: this.go,
      progress: this.progress,
      state: this.state.state,
      hide: this.hide,
      init: this.init,
    });

    return renderedChildren && React.Children.only(renderedChildren);
  }
}
