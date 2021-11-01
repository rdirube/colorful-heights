import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import anime, { random } from 'animejs';
import { ClickableOxDirective, LoadedSvgComponent } from 'micro-lesson-components';
import { BirdsAux, BirdType, Replaces, BirdState, BirdInfo } from 'src/app/shared/models/types';
import { anyElement, PreloaderOxService } from 'ox-core';
import { ColorfulHeightsChallengeService } from 'src/app/shared/services/colorful-heights-challenge.service';
import { SubscriberOxDirective } from 'micro-lesson-components';
import { interval, Subscription, timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { ColorfulHeightsAnswerService } from '../../../shared/services/colorful-heights-answer.service';
import { FeedbackOxService, GameActionsService, SoundOxService } from 'micro-lesson-core';
import { sameBird } from '../../../shared/models/functions';


@Component({
  selector: 'app-bird',
  templateUrl: './bird.component.html',
  styleUrls: ['./bird.component.scss']
})


export class BirdComponent extends ClickableOxDirective implements OnInit, OnDestroy {


  @ViewChild('htmlSpanElement') htmlSpanElement!: ElementRef;
  @ViewChild(LoadedSvgComponent) loadedSvgComponent!: LoadedSvgComponent;

  @Input('birdInfo')
  set setBirdInfo(b: BirdInfo) {
    this.bird = b;
    this.birdState = '';
    this.updatePathAndReplaces();
  }
  @Input() hintInput!: boolean;
  bird!: BirdInfo;
  @Input() isOption!: boolean;
  public isDoubleCounter: number = 0;

  public wingsUpActivate: boolean = false;
  public birdState: BirdState = "";

  public bodyPathWithReplaces!: Replaces;
  public wings1PathWithReplaces!: Replaces;
  public wings2PathWithReplaces!: Replaces;

  private wingAnimationSub: Subscription | undefined;

  constructor(private elementRef: ElementRef,
    private gameActions: GameActionsService<any>,
    private feedbackService: FeedbackOxService,
    private soundOxService: SoundOxService,
    private answerService: ColorfulHeightsAnswerService,
    private preloaderService: PreloaderOxService,
    private challengeService: ColorfulHeightsChallengeService) {
    super(soundOxService, preloaderService, elementRef);
    this.changeOpacityByInteractable = false;
    this.forceNoAnimations = true;
    this.toStyle = this.htmlSpanElement;
    this.realClick = this.birdSelectMethod;
    this.addSubscription(this.challengeService.currentExercise, z => this.interactable = true);
    this.addSubscription(this.gameActions.checkedAnswer, z => {
      this.interactable = false;
      console.log('check answer rin bird');
      const isCorrect = z.correctness === 'correct';
      this.destroyWingAnimationSub();
      const isAnswerBird = sameBird(this.bird, this.challengeService.currentExercise.value.exerciseData.targetBird);
      if (isAnswerBird) {
        this.birdState = isCorrect ? "happy" : 'sad';
        this.setBodyByState(this.getReplaces());
      }

      if (isCorrect) {
        this.wingAnimationSub = interval(200).pipe(take(4)).subscribe(w => {
          this.wingAnimationMethod();
          if (w === 3 && !this.isOption) {
            this.feedbackService.endFeedback.emit();
          }
        });
      } else {
        timer(600).subscribe(t => this.feedbackService.endFeedback.emit());
      }
    });

    this.addSubscription(this.gameActions.showHint, z => {
      if (sameBird(this.bird, this.challengeService.currentExercise.value.exerciseData.hintBird)) {
        this.hintDissapear();
      }
    })
  }


  ngOnInit(): void {
  }


  wingAnimationMethod(): void {
    this.wingsUpActivate = !this.wingsUpActivate;
  }


  birdSelectMethod() {
    if (this.bird.isDouble && this.isDoubleCounter < 1) {
      this.isDoubleCounter++;
    } else {
      this.answerService.setBirdAsAnswer(this.bird, this.svgBirdGenerator(this.bird.type, []));
      this.gameActions.actionToAnswer.emit();
      this.answerService.onTryAnswer();
    }
  }


  svgBirdGenerator(bird: BirdType, extraWords: string[] = []): string {
    return "colorful-heights/svg/Pajaritos/" + [bird as string].concat(extraWords.filter(z => z.length > 0)).join('_') + ".svg";
    // return "colorful-heights/svg/Pajaritos/" + [bird as string].concat(extraWords).join('_') + ".svg";
  }

  // svgBirdGenerator(bird: BirdType, svgType: string = ''): string {
  //   if (svgType === "happy" || svgType === "sad") {
  //     svgType = "_" + svgType;
  //   } else if (svgType.length > 0) {
  //     const wingTypeSolution = svgType.split(" ");
  //     svgType = "_" + wingTypeSolution[0] + "_" + wingTypeSolution[1];
  //   }
  //   return "colorful-heights/svg/Pajaritos/" + bird + svgType + ".svg";
  // }

  colorsParseMethod(color: string): string {
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

  private assignPathAndReplaceTo(state: string[], replaces: Map<string, string>): Replaces {
    return {
      path: this.svgBirdGenerator(this.bird.type, state),
      replaces
    };
  }

  updatePathAndReplaces() {
    const replaces = this.getReplaces();
    this.setBodyByState(replaces);
    this.wings1PathWithReplaces = this.assignPathAndReplaceTo(['alas', '1'], replaces);
    this.wings2PathWithReplaces = this.assignPathAndReplaceTo(['alas', '2'], replaces);
  }


  private setBodyByState(replaces: Map<string, string>) {
    this.bodyPathWithReplaces = this.assignPathAndReplaceTo([this.birdState], replaces);
  }

  getReplaces(): Map<string, string> {
    const replaces = new Map<string, string>();
    replaces.set("#406faf", this.colorsParseMethod(this.bird.color));
    return replaces;
  }


  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.destroyWingAnimationSub();
  }

  private destroyWingAnimationSub(): void {
    if (this.wingAnimationSub) {
      this.wingAnimationSub.unsubscribe();
    }
    this.wingAnimationSub = undefined;
  }


  hintDissapear() {
    anime({
      targets: this.elementRef.nativeElement,
      scale: 0,
      duration: 200,
      easing: 'easeInOutSine'
    })
  }



}


