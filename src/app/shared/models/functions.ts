import { BirdColor, BirdInfo, BirdType } from "./types";

export function sameBird(bird1: BirdInfo, bird2: BirdInfo): boolean {
    return bird1.color === bird2.color && bird1.type === bird2.type;
}

export function sameColor(color1:BirdColor, color2:BirdColor):boolean {
    return color1===color2;
}

export function sameShape(type1:BirdType, type2:BirdType):boolean {
    return type1===type2;
}


export function sameParsedColor (color1:string, color2:string): boolean {
    return color1 ===color2;
}