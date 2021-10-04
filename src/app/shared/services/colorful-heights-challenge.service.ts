import { Injectable } from '@angular/core';
import {
  AppInfoOxService,
  ChallengeService,
  FeedbackOxService,
  GameActionsService,
  LevelService,
  SubLevelService
} from 'micro-lesson-core';
import {ExerciseOx, PreloaderOxService} from 'ox-core';
import {BirdInfo, ColorfullHeightsExercise} from '../models/types';
import {ExpandableInfo, Showable} from 'ox-types';

@Injectable({
  providedIn: 'root'
})
export class ColorfulHeightsChallengeService extends ChallengeService<ColorfullHeightsExercise, any> {
  // public theme: ThemeInfo;
  public resources = new Map<string, string>();
  private allAvailableBirds: BirdInfo[] | undefined;
  private availableBirdsInLevel: BirdInfo[] | undefined;
  private mainBird: BirdInfo | undefined;
  private maxBirdsPerNest: number | undefined;
  private nests: number | undefined;

  constructor(gameActionsService: GameActionsService<any>, private levelService: LevelService,
              subLevelService: SubLevelService,
              private preloaderService: PreloaderOxService,
              private feedback: FeedbackOxService,
              private appInfo: AppInfoOxService) {
    super(gameActionsService, subLevelService, preloaderService);
    gameActionsService.restartGame.subscribe(z => {
      this.cachedExercises = [];
      // this.exercise = undefined;
      // this.setInitialExercise();
    });
    gameActionsService.showNextChallenge.subscribe(z => {
      // console.log('showNextChallenge');
    });
    // this.currentExercise.pipe(filter(z => z === undefined)).subscribe(z => {
    //
    // });
  }

  nextChallenge(): void {
    this.cachedExercises.push(this.generateNextChallenge(0));
  }

  protected equalsExerciseData(exerciseData: ColorfullHeightsExercise, exerciseDoneData: ColorfullHeightsExercise): boolean {
    return exerciseData.targetBird === exerciseDoneData.targetBird;
  }

  private getSublevelConfig(sublevel: number): any {
    return this.appInfo.getMicroLessonLevelConfiguration(this.levelService.currentLevel.value)
      .sublevelConfigurations[sublevel - 1].properties as any;
  }


  protected generateNextChallenge(subLevel: number): ExerciseOx<ColorfullHeightsExercise> {
    const exercise: ColorfullHeightsExercise = {optionsBirds: [], targetBird: new Bird(), quantity: Math.random() <= 0.05 ? this.maxBirdsPerNest : 1};
    const allColors = ['red', 'green', 'yellow', 'blue', 'violet'];
    exercise.targetBird.setType(this.mainBird ? this.mainBird.type : this.getRandomBirdType());
    exercise.targetBird.setColor(allColors.splice(Math.floor(Math.random() * allColors.length), 1)[0] as any);
    exercise.optionsBirds = Array(this.nests).fill(undefined).map(() => {
      return {quantity: Math.random() <= 0.05 ? this.maxBirdsPerNest : 1, bird: new Bird()};
    });
    exercise.optionsBirds.forEach((option, index, array) => {
      if (this.availableBirdsInLevel.length > 1) {
        do {
          const percentage = this.availableBirdsInLevel.length * 0.1;
          if (percentage >= Math.random()) {
            const birdsWithDistintctTypeOfExerciseTarget = this.availableBirdsInLevel.filter(e => e.type !== exercise.targetBird.type);
            option.bird.setType(birdsWithDistintctTypeOfExerciseTarget[this.oxUtils.randomBetween(0, birdsWithDistintctTypeOfExerciseTarget.length - 1)].type);
            const distintctPreviouslyUsedColors = array.slice(0, index).filter(e => e.bird.color !== exercise.targetBird.color);
            if (Math.random() < 0.3 && distintctPreviouslyUsedColors.length > 0) {
              option.bird.setColor(distintctPreviouslyUsedColors[this.oxUtils.randomBetween(0, distintctPreviouslyUsedColors.length - 1)].bird.color);
            } else {
              option.bird.setColor(exercise.targetBird.color);
            }
          } else {
            option.bird.setType(exercise.targetBird.type);
            option.bird.setColor(allColors[this.oxUtils.randomBetween(0, allColors.length - 1)] as any);
          }
        } while (array.slice(0, index).some(e => (e && this.equalBirds(e.bird, option.bird)
          || this.equalBirds(exercise.targetBird, option.bird))));
      } else {
        option.bird.setType(this.availableBirdsInLevel[0].type);
        option.bird.setColor(allColors.splice(this.oxUtils.randomBetween(0, allColors.length - 1), 1)[0] as any);
      }
    });
    const optionsBird = exercise.optionsBirds[Math.floor(Math.random() * exercise.optionsBirds.length)];
    optionsBird.quantity = exercise.quantity;
    optionsBird.bird
      .setColor(exercise.targetBird.color).setType(exercise.targetBird.type);
    return {exerciseData: exercise, requiredResources: [], subLevel: this.currentSubLevel};
  }


  beforeStartGame(): void {
    // this.info = JSON.parse(this.preloaderService.getResourceData('gnome-game/jsons/gnomes-and-scenes-info.json'));
    // this.allGnomes = this.info.gnomes;
    const gameCase = this.appInfo.microLessonInfo.extraInfo.exerciseCase;
    switch (gameCase) {
      case 'created-config':
        this.currentSubLevelPregeneratedExercisesNeeded = 1;
        // this.exerciseConfig = this.appInfo.microLessonInfo.creatorInfo.microLessonGameInfo.properties;
        // this.exerciseIndex = 0;
        this.feedback.endFeedback.subscribe(x => {
          // this.exerciseIndex++;
        });
        // this.setInitialExercise();
        break;
      default:
        throw new Error('Wrong game case recived from Wumbox');
    }
  }

  getGeneralTitle(): Showable {
    return undefined as any;
    // return this.appInfo.microLessonInfo.creatorInfo.microLessonGameInfo.generalTitle;
  }

  public getMetricsInitialExpandableInfo(): ExpandableInfo {
    // const generalTitle = this.getGeneralTitle();
    // this.totalTimeSubscription = timer(0, 1000).subscribe(() => this.metrics.totalSecondsInResource++);
    // TODO see what to do with this
    //  this.netTimeSubscription = timer(0, 1000).subscribe(() => this.metrics.netTime++);
    return {
      exercisesData: [],
      exerciseMetadata: {
        exercisesMode: 'cumulative',
        exercisesQuantity: 'infinite',
      },
      globalStatement: [],
      timeSettings: {
        timeMode: 'between-interactions',
      },
    };
  }

  // private setInitialExercise(): void {
  //   console.log(' Setting inital exercise');
  //   const gnomes = [];
  //   const gnomeCount = randomBetween(this.exerciseConfig.gnomeMinCount, this.exerciseConfig.gnomeMaxCount);
  //   this.exerciseConfig.forcedGnomes.forEach(z => {
  //     gnomes.push(this.allGnomes.find(g => g.reference === z));
  //   });
  //   const validGnomesToAdd = this.allGnomes.filter(z => this.exerciseConfig.validGnomes.includes(z.reference));
  //   for (let i = 0; i < gnomeCount - this.exerciseConfig.forcedGnomes.length; i++) {
  //     gnomes.push(anyElement(validGnomesToAdd.filter(z => !gnomes.includes(z))));
  //   }
  //   const sequenceGnomeIds = [];
  //   const auxScene = anyElement(this.exerciseConfig.possibleScenes);
  //   // const auxScene = 'jardin-alacena-5';
  //   // gnomes.push(anyElement(this.allGnomes.filter(z => !gnomes.includes(z))));
  //   // gnomes.push(anyElement(this.allGnomes.filter(z => !gnomes.includes(z))));
  //   // gnomes.push(anyElement(this.allGnomes.filter(z => !gnomes.includes(z))));
  //   for (let i = 0; i < this.exerciseConfig.startSoundCount - 1; i++) {
  //     sequenceGnomeIds.push(anyElement(this.getValidGnomeIds(3, sequenceGnomeIds, gnomes)));
  //   }
  //   this.exercise = {
  //     sequenceGnomeIds,
  //     scene: this.info.scenes.find(z => auxScene.includes(z.name)),
  //     soundDuration: this.exerciseConfig.soundDuration,
  //     gnomes,
  //     maxSecondsBetweenAnswers: this.exerciseConfig.maxSecondsBetweenAnswers,
  //     secondsToStartAnswer: this.exerciseConfig.secondsToStartAnswer,
  //     timeBetweenSounds: this.exerciseConfig.timeBetweenSounds
  //   };
  // }
}
