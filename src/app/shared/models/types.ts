import {Observable, Subscription} from 'rxjs';

export const BASE_BIRD_COLOR = "#406faf";

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
export type PositionYAxis = "top" | "bottom" | "center";

export interface BirdInfo {
  color: BirdColor;
  type: BirdType;
  isDouble?: boolean
}

export interface ButtonInfo {
  horizontal: PositionXAxis;
  vertical: PositionYAxis;
  offsetX?: number,
  offsetY?: number,
}

export interface ButtonPosition {
  xAxis: number;
  yAxis: number;
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
  buttonInfo?: ButtonInfo,
  reference: string,

}

export const MAGNIFIER_POSITIONS: MagnifierPosition[] = [
  {
    width: '150vh',
    height: '100vh',
    transform: 'translate(0vh, 0vh)',
    borderRadius: '0%',
    flexPosition: 'center center',
    reference: 'initial-state'
  },
  {
    width: '32vh',
    height: '29vh',
    transform: 'translate(-2vh, 9vh)',
    borderRadius: '20%',
    flexPosition: 'end start',
    buttonInfo: {horizontal: 'left', vertical: 'bottom'},
    reference: 'bird-to-select'
  },
  {
    width: '32vh',
    height: '29vh',
    transform: 'translate(-41.5vh, 8.7vh)',
    borderRadius: '20%',
    flexPosition: 'center center',
    reference: 'bird-0',
    buttonInfo: {horizontal: 'center', vertical: 'top'},
  },
  {
    width: '32vh',
    height: '29vh',
    transform: 'translate(0vh, 12vh)',
    borderRadius: '20%',
    flexPosition: 'center center',
    reference: 'bird-1',
    buttonInfo: {horizontal: 'center', vertical: 'top'},
  },
  {
    width: '32vh',
    height: '29vh',
    transform: 'translate(41.5vh, 8.7vh)',
    borderRadius: '20%',
    flexPosition: 'center center',
    reference: 'bird-2',
    buttonInfo: {horizontal: 'center', vertical: 'top'},
  },
  {
    width: '131vh',
    height: '33vh',
    transform: 'translate(0vh, 9vh)',
    borderRadius: '10px',
    flexPosition: 'center center',
    reference: 'all-birds',
    buttonInfo: {horizontal: 'center', vertical: 'top'},
  },
  {
    width: '27vh',
    height: '25vh',
    transform: 'translate(0vh, -14vh)',
    borderRadius: '20%',
    flexPosition: 'center center',
    buttonInfo: {horizontal: 'right', vertical: 'bottom', offsetX: 2, offsetY: 2},
    reference: 'clock'
  }];

