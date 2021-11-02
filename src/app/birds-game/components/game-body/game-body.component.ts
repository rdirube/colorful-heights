import { Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import anime from 'animejs';
import {
  FeedbackOxService,
  GameActionsService,
  HintService,
  MicroLessonMetricsService,
  SoundOxService
} from 'micro-lesson-core';
import {BirdInfo, ColorfullHeightsExercise} from 'src/app/shared/models/types';
import {ColorfulHeightsChallengeService} from 'src/app/shared/services/colorful-heights-challenge.service';
import {ExerciseOx,} from 'ox-core';
import {timer} from 'rxjs';
import {ExerciseData, ScreenTypeOx} from 'ox-types';
import {TextComponent} from 'typography-ox';
import {SubscriberOxDirective} from 'micro-lesson-components';
import {StickComponent} from '../stick/stick.component';
import {filter, take} from 'rxjs/operators';
import {ClockComponent} from '../clock/clock.component';
import {BirdToSelectComponent} from '../bird-to-select/bird-to-select.component';


@Component({
  selector: 'app-game-body',
  templateUrl: './game-body.component.html',
  styleUrls: ['./game-body.component.scss']
})


export class GameBodyComponent extends SubscriberOxDirective implements OnInit {

  @ViewChild(BirdToSelectComponent) birdToSelectComponent!: BirdToSelectComponent;
  @ViewChild(ClockComponent) clockComponent!: ClockComponent;
  @ViewChild('counterText') counterText!: TextComponent;
  @ViewChildren(StickComponent) stickComponent!: QueryList<StickComponent>;

  showCountDown: boolean | undefined;
  treeClass: string = 'tree-hide no-transition';
  baseClass: string = 'base-show no-transition';
  public modifiedAnswerForIndex3!: BirdInfo;
  public modifiedAnswerForIndex4!: BirdInfo;
  public correctAnswerCounter: number = 0;
  public exercise: ColorfullHeightsExercise  | undefined;

  public answerModifidied4and5(birdIndex: number): BirdInfo {
    const answerBird = this.challengeService.exerciseConfig?.birdsQuantity === 4 ? this.exercise?.optionsBirds[birdIndex] : this.exercise?.optionsBirds[birdIndex + 1];
    return answerBird as BirdInfo;
  }

  public replaceBirds3and4() {
    this.modifiedAnswerForIndex3 = this.answerModifidied4and5(2);
    this.modifiedAnswerForIndex4 = this.answerModifidied4and5(3);
  }

  constructor(private challengeService: ColorfulHeightsChallengeService,
              private metricsService: MicroLessonMetricsService<any>,
              private gameActions: GameActionsService<any>,
              private hintService: HintService,
              private soundService: SoundOxService,
              private feedbackService: FeedbackOxService) {
    super();
    this.feedbackService.playFeedBackSounds = false;
    this.addSubscription(this.feedbackService.endFeedback, z => {
      this.birdsDown();
      this.checkBonus();
    });
    this.addSubscription(this.gameActions.checkedAnswer, z => {
      if (z.correctness === 'correct') {
        this.correctAnswerCounter++;
        this.soundService.playRightSound(ScreenTypeOx.Game);
      } else {
        this.soundService.playWrongSound(ScreenTypeOx.Game);
      }
    });

    this.addSubscription(this.challengeService.currentExercise.pipe(filter(x => x !== undefined)),
      (exercise: ExerciseOx<ColorfullHeightsExercise>) => {
        console.log('OTRO EJERCICIOS  ');
        this.exercise = exercise.exerciseData;
        this.addMetric();
        this.hintService.usesPerChallenge = this.exercise.optionsBirds.length > 2 ? 1 : 0;
        this.hintService.checkHintAvailable();
        this.replaceBirds3and4();
        if (this.metricsService.currentMetrics.expandableInfo?.exercisesData.length === 1) {
          this.showCountDown = true;
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

  checkBonus(): void {
    this.challengeService.exerciseConfig.bonusRequirmentsAndTimeEarn.forEach(z => {
      if (z.numberOfCorrectAnswersForBonus === this.correctAnswerCounter && z.isAble) {
        this.clockComponent.addTimeMethod(z.timeEarnPerBonus);
        z.isAble = false;
        return;
      }
    });
  }

  startGame(): void {
    this.showCountDown = false;
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
    this.birdToSelectComponent.birdToSelectAnimationAppearence();
    this.clockComponent.startTime(this.challengeService.exerciseConfig.totalGameTime);
    this.startAnimations();
  }

  private startAnimations(): void {
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
  }

  private birdsDown() {
    anime({
      targets: '.birdImage',
      translateY: '125%',
      easing: 'linear',
      duration: 250,
      complete: () => {
        this.birdsUp();
      }
    });
  }

  private birdsUp() {
    this.gameActions.showNextChallenge.emit();
    anime(
      {
        targets: '.birdImage',
        translateY: ['100%', '0%'],
        duration: 1050,
        easing: 'easeInOutExpo',
      }
    );
  }
}

