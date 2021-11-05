import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BaseBodyDirective } from '../../directives/base-body.directive';
import { MAGNIFIER_POSITIONS, MagnifierPosition, TutorialStep } from '../../../shared/models/types';
import { Observable, Subscription, timer, zip } from 'rxjs';
import anime from 'animejs';
import { TextComponent } from 'typography-ox';
import { NestGroupComponent } from '../nest-group/nest-group.component';
import { BirdComponent } from '../bird/bird.component';
import { TutorialService } from '../../services/tutorial.service';
import { take } from 'rxjs/operators';
import { sameBird } from 'src/app/shared/models/functions';
import { OxTextInfo, ScreenTypeOx} from 'ox-types';
import { BirdToSelectComponent } from '../bird-to-select/bird-to-select.component';
import { SoundOxService } from 'micro-lesson-core';
import { PreloaderOxService } from 'ox-core';


@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})
export class TutorialComponent extends BaseBodyDirective implements OnInit, AfterViewInit, OnDestroy {


  @ViewChild('tutorialText') tutorialText!: TextComponent;
  @ViewChild(NestGroupComponent) nestGroup!: NestGroupComponent;
  @ViewChild(BirdToSelectComponent) birdToSelect!: BirdToSelectComponent;

  exercise = this.tutorialService.generateTutorialExercise(3, 0);

  private currentEndStepSubscription!: Subscription | undefined;

  private currentStep = 0;
  public magnifier!: MagnifierPosition | undefined;
  text: string = '';
  private steps: TutorialStep[] = [];
  public clicksOn: boolean = false;
  public boxOn: boolean = false;
  public buttonOkActivate: boolean = false;
  readonly magnifierPositions = MAGNIFIER_POSITIONS;
  private okButtonHasBeenClick = new EventEmitter();
  private correctBirdSelect = new EventEmitter();
  public isTutorialComplete:boolean = false;
  public tutorialComplete = new OxTextInfo();
  public saltarTutorialText = 'Saltar Tutorial';
  public playNowButtomText = 'Jugar Ahora';
  public repeatTutorialButtomText = 'Repetir Tutorial';
  constructor(private tutorialService: TutorialService, private soundService:SoundOxService, private preLoaderServide: PreloaderOxService) {
    super();
    this.addSubscription(this.tutorialService.birdsInstanciated, z => {
      console.log(this.tutorialService.birdComponents);
      this.tutorialService.birdComponents.forEach(bird => {
        bird.realClick = () => this.tutorialBirdClick(bird);
      });
    });
    this.tutorialService.usingTutorial = true;
    this.setSteps();
    // this.replaceBirds3and4(this.optionsBirds AS ANY);
    this.treeClass = 'tree-show no-transition';
    this.baseClass = 'base-hide no-transition';
    this.tutorialComplete.color = 'white';
    this.tutorialComplete.originalText = 'Tutorial completado ¡A jugar!';
    this.tutorialComplete.font = 'dinnRegular';
    this.tutorialComplete.fontSize = '6vh';
  }

  ngOnInit(): void {
  }


  tutorialBirdClick(bird: BirdComponent) {
    if (!bird.isOption || !this.clicksOn) return;
    if (bird.bird.isDouble && bird.isDoubleCounter < 1 && sameBird(bird.bird, this.exercise.targetBird)) {
      bird.isDoubleCounter++;
    } else if (sameBird(bird.bird, this.exercise.targetBird)) {
      bird.birdOptionCorrectCheck(bird.bird, this.exercise.targetBird, true, () => this.correctBirdSelect.emit());
    }
  }


  ngAfterViewInit(): void {
    this.birdsUpAnimation(400);
    this.birdToSelectComponent?.birdToSelectAnimationAppearence();
    this.executeCurrentStep();
    this.setMagnifierReference('initial-state');  }

  private addStep(text: string, actions: () => void, completedSub: Observable<any>) {
    this.steps.push({ text, actions, completedSub });
  }

  private executeCurrentStep() {
    this.destroyEndStepSubscription();
    const step = this.steps[this.currentStep];
    this.textChangeAnimation(step.text);
    step.actions();
    this.currentEndStepSubscription = step.completedSub.pipe(take(1)).subscribe(z => this.onCompleteStep());
  }

  private onCompleteStep() {
    if (this.steps[++this.currentStep])
      this.executeCurrentStep();
    else
      console.log('tutorialComplete');
  }



  textChangeAnimation(text: string): void {
    const duration = 500;
    const tl = anime.timeline({
      targets: this.tutorialText.textElement.nativeElement,
      easing: 'easeInOutExpo'
    });
    tl.add({
      translateY: {
        value: '8vh',
        duration,
      },
      complete: () => this.text = text
    }).add({
      translateY: {
        value: ['-8vh', 0],
        duration
      }
    });
  }




  public setSteps() {
    this.addStep('Bienvenidos', () => {
    }, timer(4000));
    this.addStep('El objetivo del juego consiste en alimentar al pajaro que nos indique la ventana ubicada arriba a la derecha',
      () => {
        this.buttonBirdsClickActivation(false)
        console.log(this.exercise.optionsBirds);
        timer(4000).subscribe(z =>
           {
             this.setMagnifierReference('bird-to-select');
             this.magnifierSoundMethod();
      });
      }, this.okButtonHasBeenClick);
    this.addStep('Haz click en el pajaro de las opciones señaladas que coincida en forma y color con el indicado en el paso anterior', () => {
      this.setMagnifierReference('all-birds');
      this.magnifierSoundMethod();
    }, this.okButtonHasBeenClick);
    this.addStep('Atento a los pajaros trampa', () => {
      const trapBirds = this.tutorialService.birdComponents.filter(z => !sameBird(z.bird, this.exercise.targetBird));
      trapBirds.forEach(w => w.trapBirdOn = true);
    }, this.okButtonHasBeenClick);
    this.addStep('Haz click en el pajaro correcto', () => {
      this.buttonBirdsClickActivation(true)
      this.tutorialService.birdComponents.forEach(d => {
        d.trapBirdOn = false;
      })
    }, this.correctBirdSelect);
    this.addStep('Los pájaros pueden ser dobles, en caso de coincidir con el , clickealo dos veces para alimentar a ambos', () => {
      this.setNewExercise(1, true,
        () => this.setMagnifierReference('bird-' + this.exercise.optionsBirds.findIndex(z => z.isDouble)));
        this.magnifierSoundMethod();
      this.buttonBirdsClickActivation(false)
    }, this.okButtonHasBeenClick);
    this.addStep('Clickea dos veces en los pájaros dobles correctos', () => {
      this.buttonBirdsClickActivation(true);
      this.magnifierSoundMethod();
      this.setMagnifierReference('all-birds');
    }, this.correctBirdSelect)
    this.addStep('Alimentar la mayor cantidad de pajaros antes de que se acabe el tiempo', () => {
      this.buttonBirdsClickActivation(false)
      this.clockComponent.startTime(10000);
      this.magnifierSoundMethod();
      this.setMagnifierReference('clock');
    }, this.okButtonHasBeenClick);
    this.addStep('Ante una racha de aciertos consecutivos, se activara un bonus de segundos extra', () => {
      this.clockComponent.tutorialClockMethod(-30, 2, 2000);
    }, this.okButtonHasBeenClick);
    this.addStep('',()=> {
      clearInterval(this.clockComponent.tutorialInterval);
      this.clockComponent.pauseTime();
      this.isTutorialComplete = true;
    }, this.okButtonHasBeenClick)
  }


 public repeatTutorialMethod():void {
    this.isTutorialComplete = false;
    this.setSteps();
 }



  private setMagnifierReference(ref: string) {
    this.magnifier = this.magnifierPositions.find(z => z.reference === ref);
  }

  private setNewExercise(doubleQuantity: number, forceDoubleCorrect: boolean = false, onBirdsDown: () => void = () => {
  }) {
    this.birdsDownAnimation(() => {
      this.exercise = this.tutorialService.generateTutorialExercise(3, doubleQuantity, forceDoubleCorrect);
      onBirdsDown();
      this.birdsUpAnimation(0, () => this.tutorialService.setClicksOn(true));
    });
  }

  buttonBirdsClickActivation(birdsActive: boolean): void {
    this.clicksOn = birdsActive ? true : false;
    this.buttonOkActivate = !this.clicksOn;
  }

  onOkButtonClicked():void {
    this.okButtonHasBeenClick.emit();
  }

  private destroyEndStepSubscription():void {
    if (this.currentEndStepSubscription) {
      this.currentEndStepSubscription.unsubscribe();
    }
    this.currentEndStepSubscription = undefined;
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.destroyEndStepSubscription();
  }

  private magnifierSoundMethod():void {
    this.soundService.playSoundEffect('colorful-heights/sounds/magnifier_sound.mp3', ScreenTypeOx.Game);
  }

}
