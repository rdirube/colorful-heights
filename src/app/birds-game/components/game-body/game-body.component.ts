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
import {ChallengeService} from 'micro-lesson-core';
import {
  BirdInfo,
  Bonus,
  BirdsAux,
  Replaces,
  BirdType,
  BirdColor,
  NivelationColorfulHeightInfo
} from 'src/app/shared/models/types';
import {ColorfulHeightsChallengeService} from 'src/app/shared/services/colorful-heights-challenge.service';
import {ExerciseOx, PreloaderOxService, randomBetween, shuffle, anyElement} from 'ox-core';
import {timer, zip} from 'rxjs';
import {TryButtonComponent, LoadedSvgComponent} from 'micro-lesson-components';
import {OxTextInfo} from 'ox-types';
import {Typographies, TextComponent} from 'typography-ox';
import {SubscriberOxDirective} from 'micro-lesson-components';
import {StickComponent} from '../stick/stick.component';
import {sameBird, sameShape, sameColor, sameParsedColor} from 'src/app/shared/models/functions';
import {THIS_EXPR} from '@angular/compiler/src/output/output_ast';


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
  public allBirds: BirdsAux[] =
    [{
      type: 'cóndor',
      svgBird: 'colorful-heights/svg/Pajaritos/cóndor.svg',
      svgBirdHappy: 'colorful-heights/svg/Pajaritos/cóndor_happy.svg',
      svgBirdSad: 'colorful-heights/svg/Pajaritos/cóndor_sad.svg',
      svgWings: 'colorful-heights/svg/Pajaritos/cóndor_alas_1.svg',
      svgWingsUp: 'colorful-heights/svg/Pajaritos/cóndor_alas_2.svg',
      isDouble: false,
      pathWithReplaces: undefined as any
    },
      {
        type: 'cotorra',
        svgBird: 'colorful-heights/svg/Pajaritos/cotorra.svg',
        svgBirdHappy: 'colorful-heights/svg/Pajaritos/cotorra_happy.svg',
        svgBirdSad: 'colorful-heights/svg/Pajaritos/cotorra_sad.svg',
        svgWings: 'colorful-heights/svg/Pajaritos/cotorra_alas_1.svg',
        svgWingsUp: 'colorful-heights/svg/Pajaritos/cotorra_alas_2.svg',
        isDouble: false,
        pathWithReplaces: undefined as any
      },
      {
        type: 'gordo',
        svgBird: 'colorful-heights/svg/Pajaritos/gordo.svg',
        svgBirdHappy: 'colorful-heights/svg/Pajaritos/gordo_happy.svg',
        svgBirdSad: 'colorful-heights/svg/Pajaritos/gordo_sad.svg',
        svgWings: 'colorful-heights/svg/Pajaritos/gordo_alas_1.svg',
        svgWingsUp: 'colorful-heights/svg/Pajaritos/gordo_alas_2.svg',
        isDouble: false,
        pathWithReplaces: undefined as any
      },
      {
        type: 'lechuza',
        svgBird: "colorful-heights/svg/Pajaritos/lechuza.svg",
        svgBirdHappy: "colorful-heights/svg/Pajaritos/lechuza_happy.svg",
        svgBirdSad: "colorful-heights/svg/Pajaritos/lechuza_sad.svg",
        svgWings: 'colorful-heights/svg/Pajaritos/lechuza_alas_1.svg',
        svgWingsUp: "colorful-heights/svg/Pajaritos/lechuza_alas_2.svg",
        isDouble: false,
        pathWithReplaces: undefined as any
      },
      {
        type: 'pelado',
        svgBird: "colorful-heights/svg/Pajaritos/pelado.svg",
        svgBirdHappy: "colorful-heights/svg/Pajaritos/pelado_happy.svg",
        svgBirdSad: "colorful-heights/svg/Pajaritos/pelado_sad.svg",
        svgWings: 'colorful-heights/svg/Pajaritos/pelado_alas_1.svg',
        svgWingsUp: 'colorful-heights/svg/Pajaritos/pelado_alas_2.svg',
        isDouble: true,
        pathWithReplaces: undefined as any
      }];
  public birdToSelect!: BirdsAux;
  public svgBird: string[] = [];
  public answerBirds!: BirdsAux[];
  public duration!: number;
  public exerciseConfig!: NivelationColorfulHeightInfo;
  public birdsQuantity: number = 4;
  public correctAnswerCounter: number = 0;
  public bonusValuesList: Bonus[] = [{numberOfCorrectAnswersForBonus: 5, timeEarnPerBonus: 20, isAble: true}, {
    numberOfCorrectAnswersForBonus: 10, timeEarnPerBonus: 40, isAble: true
  }, {
    numberOfCorrectAnswersForBonus: 15, timeEarnPerBonus: 60,
    isAble: true
  }];
  public pathWithReplaces!: Replaces[];

  public correctCountertext = new OxTextInfo;

  public answerModifidied4and5(birdIndex: number): BirdsAux {
    const answerBird = this.birdsQuantity === 4 ? this.answerBirds[birdIndex] : this.answerBirds[birdIndex + 1];
    return answerBird;
  }

  public answerTest!: string[];
  public colorsAvaiable: string[] = ["#406faf", "#e81e25", "#ffc807", "#8b2c90", "#73be44"];


  constructor(private challengeService: ColorfulHeightsChallengeService, stickComponent: StickComponent,
              private cdr: ChangeDetectorRef) {
    super();
    this.addSubscription(this.challengeService.startTime, x => {
      timer(1300).subscribe(z => {
        anime({
          targets: '.birdImage',
          translateY: ['100%', '0%'],
          duration: 1050,
          easing: 'easeInOutExpo'
        });
      });
    });
    this.addSubscription(this.challengeService.startTime, x => {
      timer(1200).subscribe(z => {
        anime({
          targets: '.button-hint',
          translateX: ['100%', '0%'],
          duration: 700,
          easing: 'easeInOutExpo'
        });
      });
      timer(1200).subscribe(z => {
        anime({
          targets: '.button-menu',
          translateX: ['-100%', '0%'],
          duration: 700,
          easing: 'easeInOutExpo'
        });
      });
    });
    this.addSubscription(this.challengeService.clickBirdEvent, (z => {
        timer(1200).subscribe(v => {
          this.birdAnimationGenerator();
        });
      }
    ));
  }


  ngOnInit(): void {
    this.birdToSelectGenerator(4);
  }


  ngAfterViewInit(): void {
  }


  colorsParseMethod(color: string, i: number): string {
    let birdColorParsed!: string;
    switch (color) {
      case 'azul':
        birdColorParsed = "#406faf";
        break;
      case 'rojo':
        birdColorParsed = "#e81e25";
        break;
      case 'amarillo':
        birdColorParsed = "#ffc807";
        break;
      case 'violeta':
        birdColorParsed = "#8b2c90";
        break;
      default:
        birdColorParsed = "#73be44";
    }
    return birdColorParsed;
  }

  birdToSelectGenerator(birds: number): void {
    this.answerBirds = [];
    this.challengeService.answerBirdOptions.forEach((e, i) => {
      const foundBird = this.allBirds.find(z => z.type === this.challengeService.answerBirdOptions[i].type)!;
      this.answerBirds.push(foundBird);
    });
    this.replacePathBirds();
    this.birdToSelect = this.answerBirds.find(z => sameShape(z.type, this.challengeService.answerBird.type) &&
      sameParsedColor(z.currentColor!, this.colorsParseMethod(this.challengeService.answerBird.color, 0)))!;
    console.log('I have just Updated the birds and they are', this.answerBirds);
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
    this.answerBirds.forEach((b, i) => {
      b.pathWithReplaces = [{
        path: b.svgBird,
        replaces: new Map<string, string>()
      }, {path: b.svgBirdHappy, replaces: new Map<string, string>()},
        {path: b.svgWings, replaces: new Map<string, string>()},
        {path: b.svgWingsUp, replaces: new Map<string, string>()}];
      b.pathWithReplaces.forEach(o =>
        o.replaces.set("#406faf", this.colorsParseMethod(this.challengeService.answerBirdOptions[i].color, i))
      );
      this.answerBirds[i].currentColor = this.colorsParseMethod(this.challengeService.answerBirdOptions[i].color, i);
    });
  }


  startGame(): void {
    this.showCountDown = false;
    console.log(' Start game');
  }


  @HostListener('document:keydown', ['$event'])
  asdsad($event: KeyboardEvent) {
    if ($event.key === 'k') {
      this.birdToSelectGenerator(1);
    }
    if ($event.key === 't') {
      this.treeClass = 'tree-show';
      this.baseClass = 'base-hide';
      timer(800).subscribe(z => {
        this.challengeService.startTime.emit();
      });
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
      console.log(this.correctAnswerCounter);
    }
    if ($event.key === 'l') {
      this.cdr.detectChanges();
    }
  }
}

