import { PostMessageBridgeFactory } from "ngox-post-message";

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
 setType(bird:BirdInfo) {
    return bird.type;
 } 

 setColor(color:BirdColor){
   return color;
 }
}


export interface Bonus {
  numberOfCorrectAnswersForBonus:number,
  timeEarnPerBonus:number,
  isAble?:boolean,
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


export interface BirdsAux {
  svgBird:string,
  svgBirdHappy:string,
  svgBirdSad:string,
  svgWings:string,
  svgWingsUp:string,
  isDouble:boolean
}


export interface BirdsAndWings {
  svgBird:string;
  wings:string;
}