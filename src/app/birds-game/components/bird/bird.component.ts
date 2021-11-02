import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {ClickableOxDirective} from 'micro-lesson-components';
import {BirdType, Replaces, BirdState, BirdInfo, BirdColor} from 'src/app/shared/models/types';
import { PreloaderOxService} from 'ox-core';
import {ColorfulHeightsChallengeService} from 'src/app/shared/services/colorful-heights-challenge.service';
import {interval, Subscription, timer} from 'rxjs';
import {take} from 'rxjs/operators';
import {ColorfulHeightsAnswerService} from '../../../shared/services/colorful-heights-answer.service';
import {FeedbackOxService, GameActionsService, SoundOxService} from 'micro-lesson-core';
import {sameBird} from '../../../shared/models/functions';


@Component({
  selector: 'app-bird',
  templateUrl: './bird.component.html',
  styleUrls: ['./bird.component.scss']
})


export class BirdComponent extends ClickableOxDirective implements OnInit, OnDestroy {

  @ViewChild('htmlSpanElement') htmlSpanElement!: ElementRef;

  @Input('birdInfo')
  set setBirdInfo(b: BirdInfo) {
    this.bird = b;
    this.birdState = '';
    this.isDoubleCounter = 0;
    this.updatePathAndReplaces();
    this.elementRef.nativeElement.style.transform = '';
  }

  bird!: BirdInfo;
  @Input() isOption!: boolean;
  private isDoubleCounter: number = 0;

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
      } else if (!this.isOption) {
        timer(600).subscribe(t => this.feedbackService.endFeedback.emit());
      }
    });

    this.addSubscription(this.gameActions.showHint, z => {
      if (sameBird(this.bird, this.challengeService.currentExercise.value.exerciseData.hintBird)) {
        this.hintAnimation();
      }
    });
  }


  ngOnInit(): void {
    this.playSound = this.isOption;
    this.cantClickSound = false;
  }


  wingAnimationMethod(): void {
    this.wingsUpActivate = !this.wingsUpActivate;
  }

  birdSelectMethod() {
    if (!this.isOption) return;
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
  }

  colorsParseMethod(color: BirdColor): string {
    switch (color) {
      case 'azul':
        return "#406faf";
      case 'rojo':
        return "#e81e25";
      case 'amarillo':
        return "#ffc807";
      case 'violeta':
        return "#8b2c90";
      case 'verde':
        return "#73be44";
      default:
        throw new Error('A color not listed came in ' + color);
    }
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


  hintAnimation() {
    this.elementRef.nativeElement.style.transition = 'transform 0.15s';
    this.elementRef.nativeElement.style.transform = 'scale(0)';
  }

}


