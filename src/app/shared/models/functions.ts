import {  BirdInfo } from "./types";

export function sameBird(bird1: BirdInfo, bird2: BirdInfo): boolean {
    return bird1.color === bird2.color && bird1.type === bird2.type;
}
