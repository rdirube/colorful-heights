import {PostMessageBridgeFactory} from "ngox-post-message";

export interface ColorfullHeightsExercise {
  targetBird: BirdInfo;
  optionsBirds: BirdInfo[];
}

export type BirdColor = 'yellow' | 'blue' | 'red' | 'violet' | 'green';
export type BirdType = 'cóndor' | 'cotorra' | 'lechuza' | 'gordo' | 'pelado';
export type TrapType = 'Equal shape' | 'Equal color' | 'different color and shape';


export interface BirdInfo {
  color: BirdColor;
  type: BirdType;
}


export interface Bonus {
  numberOfCorrectAnswersForBonus: number,
  timeEarnPerBonus: number,
  isAble?: boolean,
}


export interface TrapsInterface {
  forcedTrapsType: TrapType[],
  quantity: number
}


export interface NivelationColorfulHeightInfo {
  birdsQuantity: number,
  colorsToUse: BirdColor[],
  birdsToUse: BirdType[],
  statementChangeFromExercise?: number,
  probabilityOfStatementChange?: number,
  minMultipleBirds?: number,
  maxMultipleBirds?: number,
  totalGameTime: number,
  bonusRequirmentsAndTimeEarn: Bonus[],
  forcesTraps: TrapsInterface[]
}


export interface BirdsAux {
  type: BirdType,
  svgBird: string,
  svgBirdHappy: string,
  svgBirdSad: string,
  svgWings: string,
  svgWingsUp: string,
  isDouble: boolean,
  pathWithReplaces: Replaces[],
  currentColor?: string;
}


export interface Replaces {
  path: string;
  replaces: Map<string, string>;
}
