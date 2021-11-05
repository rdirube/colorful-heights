import {BirdColor, BirdInfo, BirdType, ButtonInfo} from "./types";
import { PositionXAxis } from "./types";
import { PositionYAxis } from "./types";
import { ButtonPosition } from "./types";

export function sameBird(bird1: BirdInfo, bird2: BirdInfo): boolean {
    return bird1.color === bird2.color && bird1.type === bird2.type;
}


export function getPositionMultipler(position: PositionXAxis | PositionYAxis): 0 | 1 | -1 {
    return position === 'center' ? 0 :
        (position === 'right' || position === 'bottom' ? 1 : -1);
}


export function okButtonPosition(buttonInfo: ButtonInfo, width: string, height: string): ButtonPosition {
    const parseWidth = parseInt(width, 10);
    const parseHeight = parseInt(height, 10);
    console.log("magnifier2")
    return {
        xAxis: (parseWidth / 2) * getPositionMultipler(buttonInfo.horizontal) + (buttonInfo.offsetX || 0),
        yAxis: (parseHeight / 2) * getPositionMultipler(buttonInfo.vertical) + (buttonInfo.offsetY || 0)
    
    };

}

export function colorsParseFunction(color: BirdColor): string {
  switch (color) {
    case 'azul':
      return "#406faf";
    case 'rojo':
      return "#e81e25";
    case 'amarillo':
      return "#ffc807";
    case 'violeta':
      return "#8b2c90";
    case 'verde':
      return "#73be44";
    default:
      throw new Error('A color not listed came in ' + color);
  }
}

export function svgBirdGenerator(bird: BirdType, extraWords: string[] = []): string {
  return "mini-lessons/executive-functions/colorful-heights/svg/Pajaritos/" + [bird as string]
    .concat(extraWords.filter(z => z.length > 0)).join('_') + ".svg";
}
