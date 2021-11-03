import {EventEmitter, Injectable} from '@angular/core';
import {BirdComponent} from '../components/bird/bird.component';

@Injectable({
  providedIn: 'root'
})
export class TutorialService {

  birdComponents: BirdComponent[] = [];
  usingTutorial = false;
  birdsInstanciated = new EventEmitter();

  constructor() {
  }

  addBird(z: BirdComponent) {
    this.birdComponents.push(z);
    if (this.birdComponents.length === 6) {
      this.birdsInstanciated.emit();
    }
  }
}
