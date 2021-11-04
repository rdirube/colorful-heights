import { BirdInfo } from "./types";
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


export function okButtonPosition(x: PositionXAxis, y: PositionYAxis, width: string, height: string): ButtonPosition {
    const parseWidth = parseInt(width, 10);
    const parseHeight = parseInt(height, 10);
    return {
        xAxis: (parseWidth / 2) * getPositionMultipler(x),
        yAxis: (parseHeight / 2) * getPositionMultipler(y)
    };
}