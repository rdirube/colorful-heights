import { Injectable, EventEmitter } from '@angular/core';
import {
  AppInfoOxService,
  ChallengeService,
  FeedbackOxService,
  GameActionsService,
  LevelService,
  SubLevelService
} from 'micro-lesson-core';
import { anyElement, equalArrays, ExerciseOx, PreloaderOxService, shuffle , randomBetween} from 'ox-core';
import {
  BirdColor,
  BirdInfo,
  BirdType,
  ColorfullHeightsExercise,
  NivelationColorfulHeightInfo,
  TrapType,
} from '../models/types';
import { ExpandableInfo, Showable } from 'ox-types';
import { sameBird } from '../models/functions';


@Injectable({
  providedIn: 'root'
})
export class ColorfulHeightsChallengeService extends ChallengeService<ColorfullHeightsExercise, any> {

  public resources = new Map<string, string>();
  public exerciseConfig!: NivelationColorfulHeightInfo;
  public validColors: BirdColor[] = [];
  public validShapes: BirdType[] = [];

  private readonly allColors = ['amarillo', 'azul', 'rojo', 'violeta', 'verde'];
  private readonly allTypes = ['cóndor', 'cotorra', 'lechuza', 'gordo', 'pelado'];

  constructor(gameActionsService: GameActionsService<any>, private levelService: LevelService,
    subLevelService: SubLevelService,
    private preloaderService: PreloaderOxService,
    private feedback: FeedbackOxService,
    private appInfo: AppInfoOxService,
  ) {
    super(gameActionsService, subLevelService, preloaderService);
    gameActionsService.restartGame.subscribe(z => {
      this.cachedExercises = [];
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
    return equalArrays(exerciseData.optionsBirds, exerciseDoneData.optionsBirds);
  }

  getRandomBird(): BirdInfo {
    return { color: anyElement(this.exerciseConfig?.colorsToUse || this.allColors), type: anyElement(this.exerciseConfig?.birdsToUse || this.allTypes) };
  }

  private generateTrap(t: TrapType, currentOptions: BirdInfo[], answer: BirdInfo): BirdInfo {
    switch (t) {
      case 'different color and shape':
        return this.generateDifferentColorAndShapeTrap(currentOptions, answer);
      case 'Equal color':
        return this.generateSameColor(currentOptions, answer);
      case 'Equal shape':
        return this.generateSameShape(currentOptions, answer);
    }
  }

  private addTrap(currentOptions: BirdInfo[], validTrapsToAdd: TrapType[], answer: BirdInfo): void {
    const trapToAdd = anyElement(validTrapsToAdd.map(trapType => this.generateTrap(trapType, currentOptions, answer)).filter(trap => trap !== undefined));
    if (!trapToAdd) {
      throw new Error('There is a problem generating the traps.');
    }
    currentOptions.push(trapToAdd);
  }

  protected generateNextChallenge(subLevel: number): ExerciseOx<ColorfullHeightsExercise> {
    const answerBird: BirdInfo = this.getRandomBird();
    const answerBirdOptions: BirdInfo[] = [answerBird];
    this.exerciseConfig.forcesTraps.forEach(forceTrap => {
      for (let i = 0; i < forceTrap.quantity; i++) {
        this.addTrap(answerBirdOptions, forceTrap.forcedTrapsType, answerBird);
      }
    });
    for (let i = 0; this.exerciseConfig.birdsQuantity > answerBirdOptions.length + i; i++) {
      this.addTrap(answerBirdOptions, ['different color and shape', 'Equal color', 'Equal shape'], answerBird);
    }
    return new ExerciseOx(
      {
        optionsBirds: this.doubleBirdFilterMethod(shuffle(answerBirdOptions)),
        targetBird: answerBird,
        hintBird: anyElement(answerBirdOptions.filter(z => z !== answerBird))
      } as ColorfullHeightsExercise, 1, {
      maxTimeToBonus: 0,
      freeTime: 0
    }, []);
  }

  beforeStartGame(): void {
    const gameCase = this.appInfo.microLessonInfo.extraInfo.exerciseCase;
    switch (gameCase) {
      case 'created-config':
        this.currentSubLevelPregeneratedExercisesNeeded = 1;
        this.exerciseConfig = this.appInfo.microLessonInfo.creatorInfo?.microLessonGameInfo.properties;
        this.setInitialExercise();
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

  private setInitialExercise(): void {
    this.validColors = this.exerciseConfig.colorsToUse;
    this.validShapes = this.exerciseConfig.birdsToUse;
    this.exerciseConfig.bonusRequirmentsAndTimeEarn.forEach( z => z.isAble = true);
  }

  //////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////* TRAPS *///////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////
  private generateDifferentColorAndShapeTrap(currentOptions: BirdInfo[], answer: BirdInfo): BirdInfo {
    const auxValidColors = this.validColors.filter(z => z !== answer.color);
    const auxValidShapes = this.validShapes.filter(z => z !== answer.type);
    const differentFromAnswer = auxValidColors.map(color => auxValidShapes.map(type => {
      return { type, color } as BirdInfo;
    })).reduce((a, b) => a.concat(b));
    return anyElement(differentFromAnswer.filter(z => !currentOptions.some(optionBird => sameBird(z, optionBird))));
  }

  private generateSameProperty<T>(listToUse: T[], mapMethod: (a: T) => BirdInfo, currentOptions: BirdInfo[]): BirdInfo {
    const aux = listToUse.map(z => mapMethod(z));
    return anyElement(aux.filter(z => !currentOptions.some(optionBird => sameBird(z, optionBird))));
  }

  private generateSameColor(currentOptions: BirdInfo[], answer: BirdInfo): BirdInfo {
    return this.generateSameProperty(this.validShapes, (type) => {
      return { type, color: answer.color } as BirdInfo;
    }, currentOptions);
  }

  private generateSameShape(currentOptions: BirdInfo[], answer: BirdInfo): BirdInfo {
    return this.generateSameProperty(this.validColors, (color) => {
      return { type: answer.type, color } as BirdInfo;
    }, currentOptions);
  }


  private doubleBirdFilterMethod(answerOptions: BirdInfo[]):BirdInfo[] {
    const randomDoubleQuantityNumber = randomBetween(this.exerciseConfig.minMultipleBirds!,this.exerciseConfig.maxMultipleBirds!)
    console.log(randomDoubleQuantityNumber);
    for(let i = 0; i < randomDoubleQuantityNumber; i++) {
      answerOptions[i].isDouble = true;
    }
    return shuffle(answerOptions);
  }



}
