import {Observable, Subscription} from 'rxjs';

export interface ColorfullHeightsExercise {
  hintBird: BirdInfo;
  targetBird: BirdInfo;
  optionsBirds: BirdInfo[];
}

export type BirdColor = 'amarillo' | 'azul' | 'rojo' | 'violeta' | 'verde';
export type BirdType = 'cóndor' | 'cotorra' | 'lechuza' | 'gordo' | 'pelado';
export type TrapType = 'Equal shape' | 'Equal color' | 'different color and shape';
export type BirdState = "" | "happy" | "sad"; 
export type PositionXAxis = "right" | "left" | "center";
export type PositionYAxis = "top" | "bottom"| "center";

export interface BirdInfo {
  color: BirdColor;
  type: BirdType;
  isDouble?:boolean
}

export interface ButtonInfo {
  horizontal: PositionXAxis;
  vertical: PositionYAxis;
}

export interface ButtonPosition {
  xAxis:number;
  yAxis:number;
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
  isDouble: boolean,
  currentColor?: BirdColor;
}


export interface Replaces {
  path: string;
  replaces: Map<string, string>;
}

export interface TutorialStep {
  text: string;
  actions: () => void,
  completedSub: Observable<any>;
}


export interface MagnifierPosition {
  width: string,
  height: string,
  transform: string,
  borderRadius: string,
  flexPosition: string,
  buttonInfo?: ButtonPosition
}
