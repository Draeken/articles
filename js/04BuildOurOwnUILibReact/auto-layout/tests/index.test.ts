import test from 'ava';
import { main } from '../src/index';

test('maximize a solo requirement', t => {
  const res = main(
    [4, 4],
    [
      [
        {
          bestSize: [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY],
          id: 'A',
          minimalSize: [1, 1],
          spawnPosition: 'center',
        },
      ],
    ]
  );
  t.is(res.length, 1);
  t.is(res[0].length, 1);
  t.deepEqual(res[0][0], { requirementId: 'A', place: { x: [0, 4], y: [0, 4] } });
});

test.skip('two comp with vertical preference will be splitted vertically due to width constraint', t => {
  const res = main(
    [2, 4],
    [
      [
        {
          id: 'A',
          spawnPosition: 'center',
          minimalSize: [2, 1],
          bestSize: [2, Number.POSITIVE_INFINITY],
        },
        {
          id: 'B',
          spawnPosition: 'center',
          minimalSize: [2, 1],
          bestSize: [2, Number.POSITIVE_INFINITY],
        },
      ],
    ]
  );
  t.is(res.length, 1);
  t.is(res[0].length, 2);
  t.deepEqual(res[0][0], { requirementId: 'A', place: { x: [0, 2], y: [0, 2] } });
  t.deepEqual(res[0][1], { requirementId: 'B', place: { x: [0, 2], y: [2, 4] } });
});
