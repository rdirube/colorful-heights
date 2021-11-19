import {Component, OnInit} from '@angular/core';
import anime from 'animejs';
import {
  FeedbackOxService,
  GameActionsService,
  HintService,
  MicroLessonMetricsService,
  SoundOxService
} from 'micro-lesson-core';
import {BASE_BIRD_COLOR, BirdInfo, ColorfullHeightsExercise} from 'src/app/shared/models/types';
import {ColorfulHeightsChallengeService} from 'src/app/shared/services/colorful-heights-challenge.service';
import {ExerciseOx,} from 'ox-core';
import {timer} from 'rxjs';
import {ExerciseData, MultipleChoiceSchemaData, OptionShowable, ScreenTypeOx, Showable} from 'ox-types';
import {filter, take} from 'rxjs/operators';
import {BaseBodyDirective} from '../../directives/base-body.directive';
import {colorsParseFunction, sameBird, svgBirdGenerator} from '../../../shared/models/functions';
import {BirdsService} from '../../services/birds.service';

@Component({
  selector: 'app-game-body',
  templateUrl: './game-body.component.html',
  styleUrls: ['./game-body.component.scss']
})

export class GameBodyComponent extends BaseBodyDirective implements OnInit {


  showCountDown: boolean | undefined;
  public exercise: ColorfullHeightsExercise | undefined;
  private itWasCorrect!: boolean;
  private readonly bonusTime: number = 5;
  private readonly bonusPer: number = 10;


  constructor(private challengeService: ColorfulHeightsChallengeService,
              private metricsService: MicroLessonMetricsService<any>,
              private gameActions: GameActionsService<any>,
              private birdsService: BirdsService,
              private hintService: HintService,
              private soundService: SoundOxService,
              private feedbackService: FeedbackOxService) {
    super();
    this.feedbackService.playFeedBackSounds = false;
    this.addSubscription(this.gameActions.microLessonCompleted, x => {
      timer(300).subscribe(z => {
        this.treeClass = 'tree-hide no-transition';
        this.baseClass = 'base-show no-transition';
      });
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
        this.absoluteAnswerCounter++;
        this.correctAnswerCounter++;
      } else
        this.correctAnswerCounter = 0;
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
          this.absoluteAnswerCounter = 0;
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
        image: [
          {
            path: svgBirdGenerator(bird.type, []),
            keys: [BASE_BIRD_COLOR],
            values: [colorsParseFunction(bird.color)]
          },
          {
            path: svgBirdGenerator(bird.type, ['alas', '1']),
            keys: [BASE_BIRD_COLOR],
            values: [colorsParseFunction(bird.color)]
          },
        ]
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
    if (this.correctAnswerCounter > 0 && this.correctAnswerCounter % this.bonusPer === 0) {
      this.clockComponent.addTimeMethod(this.bonusTime);
    }
    // this.challengeService.exerciseConfig.bonusRequirmentsAndTimeEarn.forEach(z => {
    //   if (z.numberOfCorrectAnswersForBonus === this.correctAnswerCounter && z.isAble) {
    //     this.clockComponent.addTimeMethod(z.timeEarnPerBonus);
    //     z.isAble = false;
    //     return;
    //   }
    // });
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
    // this.challengeService.exerciseConfig.totalGameTime = 15;
    // this.clockComponent.startTime();
    this.clockComponent.startTime(this.challengeService.exerciseConfig.totalGameTime);
    this.startAnimations();
  }

  private startAnimations(): void {
    this.birdToSelectComponent.birdToSelectAnimationAppearence();
    this.birdsUpAnimation(1300, () => {
      this.treeClass += ' no-transition';
      this.baseClass += ' no-transition';
    });
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
    this.birdsService.birdsInteractable.emit(false);
    this.birdsDownAnimation(() => {
        this.checkBonus();
        this.birdsUp();
      }
    );
  }

  private birdsUp() {
    this.gameActions.showNextChallenge.emit();
    this.birdsUpAnimation(0, () => {
      this.birdsService.birdsInteractable.emit(true);
    });
  }
}

