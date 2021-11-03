import {AfterViewInit, Directive, Input, QueryList, ViewChildren} from '@angular/core';
import {BirdComponent} from '../components/bird/bird.component';
import {BirdInfo} from '../../shared/models/types';
import {TutorialService} from '../services/tutorial.service';

@Directive({
  selector: '[appNest]'
})
export class NestDirective implements AfterViewInit {

  @Input() bird!: BirdInfo;
  @ViewChildren(BirdComponent) birdComponents!: QueryList<BirdComponent>;

  constructor(private tutorialService: TutorialService) {
  }

  ngAfterViewInit(): void {
    if (this.tutorialService.usingTutorial)
      this.birdComponents.toArray().forEach(z => this.tutorialService.addBird(z));
  }

}
