import { BirdInfo, ButtonInfo } from "./types";
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