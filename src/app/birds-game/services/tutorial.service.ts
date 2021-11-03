import {EventEmitter, Injectable} from '@angular/core';
import {BirdComponent} from '../components/bird/bird.component';
import {BirdInfo, ColorfullHeightsExercise} from '../../shared/models/types';
import {ColorfulHeightsChallengeService} from '../../shared/services/colorful-heights-challenge.service';
import {sameBird} from '../../shared/models/functions';
import {anyElement, shuffle} from 'ox-core';

@Injectable({
  providedIn: 'root'
})
export class TutorialService {

  birdComponents: BirdComponent[] = [];
  usingTutorial = false;
  birdsInstanciated = new EventEmitter();

  constructor(private challengeService: ColorfulHeightsChallengeService) {
  }

  addBird(z: BirdComponent) {
    this.birdComponents.push(z);
    if (this.birdComponents.length === 6) {
      this.birdsInstanciated.emit();
    }
  }

  generateTutorialExercise(birdQuantity: number, doubleQuantity: number): ColorfullHeightsExercise {
    const birds: BirdInfo[] = [this.challengeService.getRandomBird()];
    let check = 0;
    do {
      const birdToAdd = this.challengeService.getRandomBird();
      if (!birds.some(z => sameBird(z, birdToAdd))) {
        birds.push(birdToAdd);
      }
    } while (birds.length < birdQuantity && check++ < 1000);
    this.checkValidation(check);
    birds.forEach((bird, index) => bird.isDouble = index < doubleQuantity);
    return {
      optionsBirds: shuffle(birds),
      targetBird: anyElement(birds),
      hintBird: undefined as any
    };
  }

  private checkValidation(check: number): void {
    if (check > 999) {
      throw new Error('There was an error generating tutorial exercise.');
    }
  }
}
