import { Recommendation, Requirement, size } from './models';

type RA<T> = ReadonlyArray<T>;

export const main = (gridSize: size, toPlace: RA<RA<Requirement>>): RA<RA<Recommendation>> => {
  console.log(gridSize, toPlace);
  return [];
};
