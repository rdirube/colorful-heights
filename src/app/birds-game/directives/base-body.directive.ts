import {Directive, ViewChild} from '@angular/core';
import {SubscriberOxDirective} from 'micro-lesson-components';
import {BirdInfo} from '../../shared/models/types';
import anime from 'animejs';
import {ClockComponent} from '../components/clock/clock.component';
import {BirdToSelectComponent} from '../components/bird-to-select/bird-to-select.component';

@Directive({
  selector: '[appBaseBody]'
})
export class BaseBodyDirective extends SubscriberOxDirective {
  @ViewChild(ClockComponent) clockComponent!: ClockComponent;
  @ViewChild(BirdToSelectComponent) birdToSelectComponent!: BirdToSelectComponent;

  // public modifiedAnswerForIndex3!: BirdInfo;
  // public modifiedAnswerForIndex4!: BirdInfo;

  treeClass: string = 'tree-hide no-transition';
  baseClass: string = 'base-show no-transition';
  public absoluteAnswerCounter: number = 0;
  public correctAnswerCounter: number = 0;

  topNestInfo: (BirdInfo | undefined)[] = [];
  botNestInfo: (BirdInfo | undefined)[] = [];

  constructor() {
    super();
  }


  // protected answerModifidied4and5(birdIndex: number, birdQuantity: number, optionBirds: BirdInfo[] = []): BirdInfo {
  //   const answerBird = birdQuantity === 4 ? optionBirds[birdIndex]
  //     : optionBirds[birdIndex + 1];
  //   return answerBird as BirdInfo;
  // }

  // protected replaceBirds3and4(optionBirds: BirdInfo[] = []) {
  //   this.modifiedAnswerForIndex3 = this.answerModifidied4and5(2, optionBirds.length, optionBirds);
  //   this.modifiedAnswerForIndex4 = this.answerModifidied4and5(3, optionBirds.length, optionBirds);
  // }

  protected birdsUpAnimation(delay: number = 0, complete: () => void = () => {}): void {
    anime({
        targets: '.birdImage',
        translateY: ['110%', '0%'],
        duration: 1050,
        easing: 'easeInOutExpo',
        delay,
        complete
      }
    );
  }

  protected birdsDownAnimation(complete = () => {
  }): void {
    anime({
      targets: '.birdImage',
      translateY: '125%',
      easing: 'linear',
      duration: 250,
      complete
    });
  }

  protected setNests(birds: BirdInfo[]): void {
    switch (birds.length) {
      case 2:
        this.topNestInfo = [birds[0], undefined, birds[1]];
        this.botNestInfo = [undefined, undefined, undefined];
        break;
      case 3:
        this.topNestInfo = [birds[0], birds[1], birds[2]];
        this.botNestInfo = [undefined, undefined, undefined];
        break;
      case 4:
        this.topNestInfo = [birds[0], undefined, birds[1]];
        this.botNestInfo = [birds[2], undefined, birds[3]];
        break;
      case 5:
        this.topNestInfo = [birds[0], birds[1], birds[2]];
        this.botNestInfo = [birds[3], undefined, birds[4]];
        break;
      case 6:
        this.topNestInfo = [birds[0], birds[1], birds[2]];
        this.botNestInfo = [birds[3], birds[4], birds[5]];
        break;
    }
  }
}
