export interface ColorfullHeightsExercise {
  targetBird: BirdInfo;
  quantity: number;
  optionsBirds: { quantity: number, bird: BirdInfo }[];
}

export type BirdColor = 'yellow' | 'blue' | 'red' | 'violet' | 'orange' | 'green';
export type BirdType = 'peluso' | 'buho' | 'buitre' | 'loro' | 'pelado';

export interface BirdInfo {
  color: BirdColor;
  type: BirdType;
}
