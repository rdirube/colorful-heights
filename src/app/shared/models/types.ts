export interface ColorfullHeightsExercise {
  targetBird: BirdInfo;
  quantity: number;
  optionsBirds: { quantity: number, bird: BirdInfo }[];
}

export type BirdColor = 'yellow' | 'blue' | 'red' | 'violet' | 'orange' | 'green';
export type BirdType = 'peluso' | 'buho' | 'buitre' | 'loro' | 'pelado';



export class BirdInfo {
  color: BirdColor;
  type: BirdType;
  constructor(color:BirdColor, type:BirdType) {
    this.color=color;
    this.type=type
  }
 

}


export interface Bonus {
  numberOfCorrectAnswersForBonus:number,
  timeEarnPerBonus:number
}


export interface NivelationColorfulHeightInfo {
  birdsQuantity:number, 
  colorsToUse:string[],
  birdsToUse:string[],
  statementChangeFromExercise?:number,
  probabilityOfStatementChange?:number,
  minMultipleBirds?:number,
  maxMultipleBirds?:number,
  totalGameTime:number,
  bonusRequirmentsAndTimeEarn:Bonus[]
}