import {Component, HostListener, OnInit} from '@angular/core';
import anime from 'animejs';
import { ChallengeService } from 'micro-lesson-core';
import { BirdInfo } from 'src/app/shared/models/types';
import { ColorfulHeightsChallengeService } from 'src/app/shared/services/colorful-heights-challenge.service';

@Component({
  selector: 'app-game-body',
  templateUrl: './game-body.component.html',
  styleUrls: ['./game-body.component.scss']
})
export class GameBodyComponent implements OnInit {

  showCountDown: boolean | undefined;
  treeClass: string = 'tree-hide';
  baseClass: string = 'base-show';
  public avaiableBirdsPerExercise!:BirdInfo[];



  constructor(challengeService:ColorfulHeightsChallengeService) {

  }


  ngOnInit(): void {
  }


  startGame(): void {
    this.showCountDown = false;
    console.log(' Start game');
    // this.playSequence();
  }
  

  avaiableBirdsGenerator() {
    this.challengeService
  }
 

  


  @HostListener('document:keydown', ['$event'])
  asdsad($event: KeyboardEvent) {
    if ($event.key === 't') {
      this.treeClass = 'tree-show';
      this.baseClass = 'base-hide';
    }
    if ($event.key === 'b') {
      this.treeClass = 'tree-hide';
      this.baseClass = 'base-show';
    }
    if ($event.key === 'p') {
      anime({
        targets: '.birdImage',
        translateY: '100%',
        easing: 'linear',
        duration: 250,
      });
    }
    if ($event.key === 'o') {
      anime({
        targets: '.birdImage',
        translateY: ['65%', '0'],
        duration: 750,
        easing: 'easeInOutElastic'
      });
    }
  }
}
