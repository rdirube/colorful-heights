import { Component, HostListener, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import anime  from 'animejs';
import { ChallengeService } from 'micro-lesson-core';
import { BirdInfo, Bonus , BirdsAux} from 'src/app/shared/models/types';
import { ColorfulHeightsChallengeService } from 'src/app/shared/services/colorful-heights-challenge.service';
import { ExerciseOx, PreloaderOxService, randomBetween, shuffle } from 'ox-core';
import { timer } from 'rxjs';
import { TryButtonComponent } from 'micro-lesson-components';
import { OxTextInfo } from 'ox-types';
import { Typographies, TextComponent } from 'typography-ox';
import { SubscriberOxDirective } from 'micro-lesson-components';




@Component({
  selector: 'app-game-body',
  templateUrl: './game-body.component.html',
  styleUrls: ['./game-body.component.scss']
})


export class GameBodyComponent extends SubscriberOxDirective implements OnInit {

  


  showCountDown: boolean | undefined;
  treeClass: string = 'tree-hide';
  baseClass: string = 'base-show';
  public avaiableBirdsPerExercise: number[] = [];
  public nestsPerExercise: boolean[] = [];
  public allBirds: BirdsAux[] = [{svg:'colorful-heights/svg/Pajaritos/cóndor_amarillo.svg', isDouble:false}, {svg:'colorful-heights/svg/Pajaritos/cóndor_azul.svg',isDouble:false}, {svg:'colorful-heights/svg/Pajaritos/cotorra_roja.svg', isDouble:false}, {svg:"colorful-heights/svg/Pajaritos/cotorra_violeta.svg", isDouble:false},
    {svg:"colorful-heights/svg/Pajaritos/cotorra_amarillo.svg", isDouble:false}, {svg:"colorful-heights/svg/Pajaritos/lechuza_azul.svg", isDouble:false}, {svg:"colorful-heights/svg/Pajaritos/pelado_verde.svg",isDouble:false}, {svg:"colorful-heights/svg/Pajaritos/gordo_azul.svg",isDouble:false}, {svg:"colorful-heights/svg/Pajaritos/pelado_rojo.svg", isDouble:false}];
  public birdToSelect!: BirdsAux;
  public answerBirds: BirdsAux[]=[];
  public duration!: number;
  public isDouble!:boolean;
  public correctAnswerCounter: number = 0;
  public bonusValuesList: Bonus[] = [{ numberOfCorrectAnswersForBonus: 5, timeEarnPerBonus: 20, isAble: true }, {
    numberOfCorrectAnswersForBonus: 10, timeEarnPerBonus: 40, isAble: true
  }, {
    numberOfCorrectAnswersForBonus: 15, timeEarnPerBonus: 60,
    isAble: true
  }]
  public correctCountertext = new OxTextInfo;
  @ViewChild('counterText') counterText!: TextComponent;



  constructor(private challengeService: ColorfulHeightsChallengeService) {
    super()
    this.addSubscription(this.challengeService.startTime, x => {
      timer(1300).subscribe(z=> {
        anime({
          targets: '.bird',
          translateY: ['100%', '-2%'],
        duration: 1050,
        easing: 'easeInOutExpo'
        })
      })
    })
  }



  ngOnInit(): void {
    this.birdsAddedToExercises(6);
    this.birdToSelectGenerator();
    console.log(this.nestsPerExercise.length);

  }



  ngAfterViewInit(): void {
  }




  birdToSelectGenerator(): void {
    this.answerBirds = [];
    const shuffledBirds = shuffle(this.allBirds);
    this.birdToSelect = shuffledBirds[0];
    this.answerBirds.push(this.birdToSelect);
    const allBirdsWithoutCorrect = shuffledBirds.filter(z => z !== this.birdToSelect);
    allBirdsWithoutCorrect.forEach( (z,i)=> z.isDouble = i%3===0);
    for (let i = 0; i < this.nestsPerExercise.length; i++) {
    
       this.answerBirds.push(allBirdsWithoutCorrect[i]);
  
    }
    this.answerBirds = shuffle(this.answerBirds);
    this.bonusValuesList.forEach(z => {
      if (z.numberOfCorrectAnswersForBonus === this.correctAnswerCounter && z.isAble) {
        this.challengeService.bonusTime.emit(z.timeEarnPerBonus);
        z.isAble = false;
      }
    })
  }






  birdSelectMethod(i: BirdsAux) {
    this.correctAnswerCounter++;
    this.challengeService.activateCounter.emit(this.correctAnswerCounter)
    const birdsAnimation = anime.timeline({
      targets: '.birdImage',
      duration: 1000
    });
    birdsAnimation.add({
      translateY: '100%',
      easing: 'linear',
      duration: 250,
    })
      .add({
        translateY: ['95%', '0'],
        duration: 750,
        easing: 'easeInOutElastic'
      })
    timer(250).subscribe(z => {
      this.birdToSelectGenerator();     
    })
  }



  birdsAddedToExercises(numberOfBirds: number) {
    for (let i = 0; i < numberOfBirds; i++) {
      this.nestsPerExercise.push(true);
    }
    if (numberOfBirds === 4) {
      this.nestsPerExercise[2] = false;
      this.nestsPerExercise[4] = true;
    }

  }


  startGame(): void {
    this.showCountDown = false;
    console.log(' Start game');
    // this.playSequence();
  }


  // avaiableBirdsGenerator(birdsQuantity:number) {
  //   this.challengeService.exerciseConfig.birdsQuantity = birdsQuantity;
  //   this.challengeService.avaiableBirdsGenerator();
  //   this.avaiableBirdsPerExercise = this.challengeService.availableBirdsInLevel;
  // }





  @HostListener('document:keydown', ['$event'])
  asdsad($event: KeyboardEvent) {
    if ($event.key === 't') {
      this.treeClass = 'tree-show';
      this.baseClass = 'base-hide';
      timer(800).subscribe(z => {
        this.challengeService.startTime.emit();
      })
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
    if ($event.key === 's') {
      this.correctAnswerCounter = 0;
      console.log(this.correctAnswerCounter)
    }
  }
}

