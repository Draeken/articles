const sort = (a: number, b: number) => a - b;

const toFloat = (x: string) => parseFloat(x);

const noop = () => {};

const chunk2 = <T>(value: Array<T>) => {
  const arr: T[][] = [];
  for (let i = 0; i < value.length; i += 2) {
    arr.push(value.slice(i, i + 2));
  }

  return arr;
};

const onceDifferent = <T>(sideEffectFunc: (a: T) => void, value?: T) => {
  let memo = value;

  return (newVal: T) => {
    if (newVal === memo) {
      return memo;
    }
    sideEffectFunc(newVal);
    memo = newVal;

    return memo;
  };
};

// From popmotion's calc.
const getProgressFromValue = (from: number, to: number, value: number) =>
  (value - from) / (to - from);
const getValueFromProgress = (from: number, to: number, progress: number) =>
  -progress * from + progress * to + from;

/**
 * popmotion's Interpolate from set of values to another
 */
const interpolate = (
  input: number[],
  output: number[],
  rangeEasing?: Array<(n: number) => number>
) => {
  const rangeLength = input.length;
  const finalIndex = rangeLength - 1;

  return (v: number) => {
    // If value outside minimum range, quickly return
    if (v <= input[0]) {
      return output[0];
    }

    // If value outside maximum range, quickly return
    if (v >= input[finalIndex]) {
      return output[finalIndex];
    }

    let i = 1;

    // Find index of range start
    for (; i < rangeLength; i += 1) {
      if (input[i] > v || i === finalIndex) {
        break;
      }
    }

    const progressInRange = getProgressFromValue(input[i - 1], input[i], v);
    const easedProgress = rangeEasing ? rangeEasing[i - 1](progressInRange) : progressInRange;
    return getValueFromProgress(output[i - 1], output[i], easedProgress);
  };
};

/**
 * keyframes
 * @param {Object} frames
 * @return {Function}
 */
export const keyframe = (originalFrames: { [key: number]: (v: number) => void }) => {
  const frames = { ...originalFrames };
  let noZero = false;

  if (!frames[0]) {
    noZero = true;
    frames[0] = noop;
  }

  const framesArray = Object.keys(frames);

  framesArray.forEach(key => {
    const func = frames[key];

    frames[key] = onceDifferent(func);
  });

  let keysNumbers = framesArray.map(toFloat);

  keysNumbers = [...keysNumbers, ...keysNumbers].sort(sort).slice(1, Infinity);

  const chucks = chunk2(keysNumbers);

  const caller = (progress: number) => {
    // When 0 is present considered it done like the initial state similar to css keyframes.
    frames[0](1);

    chucks.forEach((chunk) => {
      // Handle the last chunk [100] without and end;
      if (!chunk[1]) {
        return;
      }

      const func = frames[chunk[1]];
      const interpolatedValue = interpolate([chunk[0], chunk[1]], [0, 1]);
      func(interpolatedValue(progress * 100));
    });

    if (progress < 0) {
      frames[framesArray[noZero ? 1 : 0]](progress);
    }
    if (progress > 1) {
      frames[framesArray[framesArray.length - 1]](progress);
    }
  };

  return caller;
};
