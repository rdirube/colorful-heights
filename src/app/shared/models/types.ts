import { PostMessageBridgeFactory } from "ngox-post-message";

export interface ColorfullHeightsExercise {
  targetBird: BirdInfo;
  quantity: number;
  optionsBirds: { quantity: number, bird: BirdInfo }[];
}

export type BirdColor = 'yellow' | 'blue' | 'red' | 'violet' | 'green';
export type BirdType = 'cóndor' | 'cotorra' | 'lechuza' | 'gordo' | 'pelado';
export type TrapType = 'Equal shape' | 'Equal color' | 'different color and shape';



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


export interface TrapsInterface {
  
  
    forcedTrapsType:string[],
    quantity:number
  
    
 
}





export interface NivelationColorfulHeightInfo {
  birdsQuantity:number, 
  colorsToUse:BirdColor[],
  birdsToUse:BirdType[],
  statementChangeFromExercise?:number,
  probabilityOfStatementChange?:number,
  minMultipleBirds?:number,
  maxMultipleBirds?:number,
  totalGameTime:number,
  bonusRequirmentsAndTimeEarn:Bonus[],
  forcesTraps:TrapsInterface[]
}




export interface BirdsAux {
  svgBird:string,
  svgBirdHappy:string,
  svgBirdSad:string,
  svgWings:string,
  svgWingsUp:string,
  isDouble:boolean,
  pathWithReplaces:Replaces[]
}



export interface Replaces {
  path: string;
  replaces: Map<string, string>;
}