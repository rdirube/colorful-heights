import {Component, OnInit} from '@angular/core';
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
import {ExerciseData, MultipleChoiceSchemaData, OptionShowable, ScreenTypeOx, Showable} from 'ox-types';
import {filter, take} from 'rxjs/operators';
import {BaseBodyDirective} from '../../directives/base-body.directive';
import {sameBird} from '../../../shared/models/functions';

@Component({
  selector: 'app-game-body',
  templateUrl: './game-body.component.html',
  styleUrls: ['./game-body.component.scss']
})

export class GameBodyComponent extends BaseBodyDirective implements OnInit {


  showCountDown: boolean | undefined;
  public exercise: ColorfullHeightsExercise | undefined;
  private itWasCorrect!: boolean;


  constructor(private challengeService: ColorfulHeightsChallengeService,
              private metricsService: MicroLessonMetricsService<any>,
              private gameActions: GameActionsService<any>,
              private hintService: HintService,
              private soundService: SoundOxService,
              private feedbackService: FeedbackOxService) {
    super();
    this.feedbackService.playFeedBackSounds = false;
    this.addSubscription(this.gameActions.microLessonCompleted, x => {
      this.treeClass = 'tree-hide no-transition';
      this.baseClass = 'base-show no-transition';
    });
    this.addSubscription(this.gameActions.restartGame, x => {
      this.treeClass = 'tree-hide no-transition';
      this.baseClass = 'base-show no-transition';
    });
    this.addSubscription(this.feedbackService.endFeedback, z => {
      this.birdsDown();
      if (this.itWasCorrect) {
        this.soundService.playRightSound(ScreenTypeOx.Game);
      } else {
        this.soundService.playWrongSound(ScreenTypeOx.Game);
      }
    });
    this.addSubscription(this.gameActions.checkedAnswer, z => {
      this.itWasCorrect = z.correctness === 'correct';
      if (this.itWasCorrect) {
        this.correctAnswerCounter++;
      }
    });

    this.addSubscription(this.challengeService.currentExercise.pipe(filter(x => x !== undefined)),
      (exercise: ExerciseOx<ColorfullHeightsExercise>) => {
        console.log('OTRO EJERCICIOS  ');
        this.exercise = exercise.exerciseData;
        this.addMetric();
        this.hintService.usesPerChallenge = this.exercise.optionsBirds.length > 2 ? 1 : 0;
        this.hintService.checkHintAvailable();
        // this.replaceBirds3and4(this.exercise?.optionsBirds);
        this.setNests(this.exercise.optionsBirds);
        if (this.metricsService.currentMetrics.expandableInfo?.exercisesData.length === 1) {
          this.showCountDown = true;
          this.correctAnswerCounter = 0;
          this.challengeService.exerciseConfig.bonusRequirmentsAndTimeEarn.forEach(z => z.isAble = true);
          if (this.birdToSelectComponent)
            this.birdToSelectComponent.birdToSelectOut();
          this.animeHeaderButtons(false);
          this.birdsDownAnimation();
        }
      });
  }

  private birdToOption(bird: BirdInfo): OptionShowable {
    return {
      isCorrect: sameBird(this.challengeService.currentExercise.value.exerciseData.targetBird, bird),
      showable: {
      },
      customProperties: [
        {
          name: 'color',
          value: bird.color,
        },
        {
          name: 'type',
          value: bird.type,
        },
        {
          name: 'double',
          value: bird.isDouble !== undefined,
        }
      ]
    };
  }

  private addMetric(): void {
    const myMetric: ExerciseData = {
      schemaType: 'multiple-choice',
      schemaData: {
        statement: {parts: []},
        additionalInfo: [],
        options: this.challengeService.currentExercise.value.exerciseData.optionsBirds.map(this.birdToOption.bind(this)),
        optionMode: 'independent',
        requiredOptions: 1
      } as MultipleChoiceSchemaData,
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
    this.clockComponent.startTime(this.challengeService.exerciseConfig.totalGameTime);
    this.startAnimations();
  }

  private startAnimations(): void {
    this.birdToSelectComponent.birdToSelectAnimationAppearence();
    this.birdsUpAnimation(1300);
    this.animeHeaderButtons();
  }

  private animeHeaderButtons(goIn: boolean = true): void {
    anime({
      targets: '.button-hint',
      translateX: goIn ? ['100%', '0%'] : '100%',
      duration: goIn ? 700 : 0,
      easing: 'easeInOutExpo',
      delay: goIn ? 1200 : 0
    });
    anime({
      targets: '.button-menu',
      translateX: goIn ? ['-100%', '0%'] : '-100%',
      duration: goIn ? 700 : 0,
      easing: 'easeInOutExpo',
      delay: goIn ? 1200 : 0
    });
  }

  private birdsDown() {
    this.birdsDownAnimation(() => {
        this.checkBonus();
        this.birdsUp();
      }
    );
  }

  private birdsUp() {
    this.gameActions.showNextChallenge.emit();
    this.birdsUpAnimation();
  }
}

