import {
  Component,
  HostListener,
  OnInit,
  AfterViewInit,
  ViewChild,
  ViewChildren,
  QueryList,
  ChangeDetectorRef
} from '@angular/core';
import anime from 'animejs';
import {ChallengeService, GameActionsService, HintService, MicroLessonMetricsService} from 'micro-lesson-core';
import {
  BirdInfo,
  Bonus,
  BirdsAux,
  Replaces,
  BirdType,
  BirdColor,
  NivelationColorfulHeightInfo, ColorfullHeightsExercise
} from 'src/app/shared/models/types';
import {ColorfulHeightsChallengeService} from 'src/app/shared/services/colorful-heights-challenge.service';
import {ExerciseOx,} from 'ox-core';
import {timer} from 'rxjs';
import {ExerciseData, OxTextInfo} from 'ox-types';
import {TextComponent} from 'typography-ox';
import {SubscriberOxDirective} from 'micro-lesson-components';
import {StickComponent} from '../stick/stick.component';
import {filter, take} from 'rxjs/operators';


@Component({
  selector: 'app-game-body',
  templateUrl: './game-body.component.html',
  styleUrls: ['./game-body.component.scss']
})


export class GameBodyComponent extends SubscriberOxDirective implements OnInit {

  @ViewChild('counterText') counterText!: TextComponent;
  @ViewChildren(StickComponent) stickComponent!: QueryList<StickComponent>;


  showCountDown: boolean | undefined;
  treeClass: string = 'tree-hide';
  baseClass: string = 'base-show';
  public avaiableBirdsPerExercise: number[] = [];
  public nestsPerExercise: boolean[] = [];
  public exerciseConfig!: NivelationColorfulHeightInfo;
  public answer4!:BirdInfo;
  public answer5!:BirdInfo;
  public correctAnswerCounter: number = 0;
  public exercise: ColorfullHeightsExercise =  {
    targetBird: {
      color:'blue',
      type: 'lechuza'
    },
    optionsBirds: [
      {color:'blue',
      type: 'pelado'},{color:'red',
      type: 'cóndor'},{color:'yellow',
      type: 'cotorra'}
    ]
  }
  
  public bonusValuesList: Bonus[] = [{numberOfCorrectAnswersForBonus: 5, timeEarnPerBonus: 20, isAble: true}, {
    numberOfCorrectAnswersForBonus: 10, timeEarnPerBonus: 40, isAble: true
  }, {
    numberOfCorrectAnswersForBonus: 15, timeEarnPerBonus: 60,
    isAble: true
  }];
  public pathWithReplaces!: Replaces[];

  public correctCountertext = new OxTextInfo;


  public answerModifidied4and5(birdIndex: number): BirdInfo {
    const answerBird = this.challengeService.exerciseConfig?.birdsQuantity === 4 ? this.exercise.optionsBirds[birdIndex] : this.exercise.optionsBirds[birdIndex + 1];
    return answerBird;
  }

  public replaceBirds4and5(){
    this.answer4 = this.answerModifidied4and5(2);
    this.answer5 = this.answerModifidied4and5(3);
  }



  constructor(private challengeService: ColorfulHeightsChallengeService,
              private metricsService: MicroLessonMetricsService<any>,
              private gameActions: GameActionsService<any>,
              private hintService: HintService,
              private cdr: ChangeDetectorRef) {
    super();

    this.addSubscription(this.challengeService.startTime, x => {
      anime({
        targets: '.birdImage',
        translateY: ['100%', '0%'],
        duration: 1050,
        easing: 'easeInOutExpo',
        delay: 1300
      });

      anime({
        targets: '.button-hint',
        translateX: ['100%', '0%'],
        duration: 700,
        easing: 'easeInOutExpo',
        delay: 1200
      });
      anime({
        targets: '.button-menu',
        translateX: ['-100%', '0%'],
        duration: 700,
        easing: 'easeInOutExpo',
        delay: 1200

      });

    });
    this.addSubscription(this.challengeService.clickBirdEvent, (z => {
        timer(1200).subscribe(v => {
          this.birdAnimationGenerator();
        });
      }
    ));
    this.addSubscription(this.challengeService.currentExercise.pipe(filter(x => x !== undefined)),
      (exercise: ExerciseOx<ColorfullHeightsExercise>) => {
        this.exercise = exercise.exerciseData;
        console.log(this.exercise);
        console.log(this.exercise.optionsBirds);
        this.addMetric();
        this.hintService.usesPerChallenge = 1;
        this.hintService.hintAvailable.next(true);
        this.replaceBirds4and5();

        if (this.metricsService.currentMetrics.expandableInfo?.exercisesData.length === 1) {
          this.showCountDown = true;
        } else {
          // this.playSequence();
        }
      });


  }

 


  private addMetric(): void {
    const myMetric: ExerciseData = {
      schemaType: 'multiple-choice',
      schemaData: undefined,
      // schemaData: {
      //   statement: {parts: []},``
      //   additionalInfo: [],
      //   presentationOrder: 'ordered',
      //   processingCriteria: {
      //     type: this.challengeService.exerciseConfig.invertedGnomes
      //       ? 'inverse-presentation-order' : 'presentation-order'
      //   },
      //   stimulus: this.challengeService.exercise.sequenceGnomeIds.map(this.gnomeIdToStimulus.bind(this))
      // } as WorkingMemorySchemaData,
      userInput: {
        answers: [],
        requestedHints: 0,
        surrendered: false
      },
      finalStatus: 'to-answer',
      maxHints: 1,
      secondsInExercise: 0,
      initialTime: new Date(),
      finishTime: undefined as any,
      firstInteractionTime: undefined as any
    };
    this.addSubscription(this.gameActions.actionToAnswer.pipe(take(1)), z => {
      myMetric.firstInteractionTime = new Date();
    });
    this.addSubscription(this.gameActions.checkedAnswer.pipe(take(1)),
      z => {
        myMetric.finishTime = new Date();
        console.log('Finish time');
      });
    this.metricsService.addMetric(myMetric as ExerciseData);
    this.metricsService.currentMetrics.exercises++;
  }

  ngOnInit(): void {

  }


  ngAfterViewInit(): void {
  }


  



  birdToSelectGenerator(birds: number): void {
    // this.challengeService.answerBirdOptions.forEach((e, i) => {
    //   const foundBird = this.allBirds.find(z => z.type === this.challengeService.answerBirdOptions[i].type)!;
    //   this.answerBirds.push(foundBird);
    // });
    

    // this.birdToSelect = this.answerBirds.find(z => sameShape(z.type, this.challengeService.answerBird.type) &&
    //   sameParsedColor(z.currentColor!, this.colorsParseMethod(this.challengeService.answerBird.color, 0)))!;
    // console.log(this.answerBirds);
    // console.log(this.birdToSelect);
    // console.log(this.birdToSelect.currentColor);
    // console.log(this.colorsParseMethod(this.challengeService.answerBird.color,0))
    // const shuffledBirds = shuffle(this.allBirds);
    // this.birdToSelect = shuffledBirds[0];
    // this.answerBirds.push(this.birdToSelect);
    // const allBirdsWithoutCorrect = shuffledBirds.filter(z => z !== this.birdToSelect);
    // allBirdsWithoutCorrect.forEach((z, i) => z.isDouble = i % 4 === 0);
    // for (let i = 0; i < birds - 1; i++) {
    //   this.answerBirds.push(allBirdsWithoutCorrect[Math.floor(Math.random() * (this.allBirds.length - 1))])
    // }
    // this.answerBirds = shuffle(this.answerBirds);
    this.bonusValuesList.forEach(z => {
      if (z.numberOfCorrectAnswersForBonus === this.correctAnswerCounter && z.isAble) {
        this.challengeService.bonusTime.emit(z.timeEarnPerBonus);
        z.isAble = false;
      }
    });
  }


  birdAnimationGenerator() {
    this.correctAnswerCounter++;
    this.challengeService.activateCounter.emit(this.correctAnswerCounter);
    this.animationBirdsTimeline();
  }


  animationBirdsTimeline() {
    const birdsAnimation = anime.timeline({
      targets: '.birdImage',
      duration: 1200
    });
    birdsAnimation.add({
      translateY: '125%',
      easing: 'linear',
      duration: 250,
      complete: (anim) => {
        this.birdToSelectGenerator(4);
      }
    })
      .add({
        translateY: ['120%', '0'],
        duration: 950,
        easing: 'easeInOutElastic',
      });
  }


  replacePathBirds(): void {
    // this.answerBirds.forEach((b, i) => {
    //   b.pathWithReplaces = [{
    //     path: b.svgBird,
    //     replaces: new Map<string, string>()
    //   }, {path: b.svgBirdHappy, replaces: new Map<string, string>()},
    //     {path: b.svgWings, replaces: new Map<string, string>()},
    //     {path: b.svgWingsUp, replaces: new Map<string, string>()}];
    //   // b.pathWithReplaces.forEach(o =>
    //   //   o.replaces.set("#406faf", this.colorsParseMethod(this.challengeService.answerBirdOptions[i].color, i))
    //   // );
    //   // this.answerBirds[i].currentColor = this.colorsParseMethod(this.challengeService.answerBirdOptions[i].color, i);
    // });
  }

  startGame(): void {
    this.showCountDown = false;
    console.log(' Start game');
    this.raiseAnimation();
  }

  private raiseAnimation(): void {
    this.treeClass = 'tree-show';
    this.baseClass = 'base-hide';
    timer(800).subscribe(z => {
      this.gameHasStarted();
    });
  }

  private gameHasStarted() {
    this.challengeService.startTime.emit();
  }

  // @HostListener('document:keydown', ['$event'])
  // asdsad($event: KeyboardEvent) {
  //   if ($event.key === 'k') {
  //     this.birdToSelectGenerator(1);
  //   }
  //   if ($event.key === 't') {
  //
  //   }
  //   if ($event.key === 'b') {
  //     this.treeClass = 'tree-hide';
  //     this.baseClass = 'base-show';
  //   }
  //   if ($event.key === 'p') {
  //     anime({
  //       targets: '.birdImage',
  //       translateY: '100%',
  //       easing: 'linear',
  //       duration: 250,
  //     });
  //   }
  //   if ($event.key === 'o') {
  //     anime({
  //       targets: '.birdImage',
  //       translateY: ['65%', '0'],
  //       duration: 750,
  //       easing: 'easeInOutElastic'
  //     });
  //   }
  //   if ($event.key === 's') {
  //     this.correctAnswerCounter = 0;
  //     console.log(this.correctAnswerCounter);
  //   }
  //   if ($event.key === 'l') {
  //     this.cdr.detectChanges();
  //   }
  // }
}

