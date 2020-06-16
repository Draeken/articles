export type size = [number, number];
export interface Requirement {
  id: string;
  spawnPosition: 'center' | 'left' | 'right' | 'top' | 'bottom';
  minimalSize: size;
  bestSize: size;
}
export type Position1D = [number, number];
export interface Position2D {
  x: Position1D;
  y: Position1D;
}
export interface Recommendation {
  requirementId: string;
  place: Position2D;
}
