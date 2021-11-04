import {AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BaseBodyDirective} from '../../directives/base-body.directive';
import {MAGNIFIER_POSITIONS, MagnifierPosition, TutorialStep} from '../../../shared/models/types';
import {Observable, Subscription, timer} from 'rxjs';
import anime from 'animejs';
import {TextComponent} from 'typography-ox';
import {NestGroupComponent} from '../nest-group/nest-group.component';
import {BirdComponent} from '../bird/bird.component';
import {TutorialService} from '../../services/tutorial.service';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})
export class TutorialComponent extends BaseBodyDirective implements OnInit, AfterViewInit, OnDestroy {


  @ViewChild('tutorialText') tutorialText!: TextComponent;
  @ViewChild(NestGroupComponent) nestGroup!: NestGroupComponent;

  exercise = this.tutorialService.generateTutorialExercise(3, 0);

  private currentEndStepSubscription!: Subscription | undefined;

  private currentStep = 0;
  public magnifier!: MagnifierPosition | undefined;
  text: string = '';
  private steps: TutorialStep[] = [];
  private clicksOn: boolean = false;
  public boxOn: boolean = false;
  readonly magnifierPositions = MAGNIFIER_POSITIONS;
  private okButtonHasBeenClick = new EventEmitter();


  constructor(private tutorialService: TutorialService) {
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
  }

  ngOnInit(): void {
  }


  tutorialBirdClick(bird: BirdComponent) {
    if (!bird.isOption || this.clicksOn) return;
    if (bird.bird.isDouble && bird.isDoubleCounter < 1) {
      bird.isDoubleCounter++;
      this.tutorialService.birdStepCorrect.emit(this.currentStep);
    } else {
      console.log('I have been clicked', bird);

      // TRY CLICK
      // bird.answerService.setBirdAsAnswer(bird.bird, bird.svgBirdGenerator(bird.bird.type, []));
      // bird.gameActions.actionToAnswer.emit();
      // bird.answerService.onTryAnswer();
    }
  }

  ngAfterViewInit(): void {
    this.birdsUpAnimation(400);
    this.birdToSelectComponent.birdToSelectAnimationAppearence();
    this.executeCurrentStep();
  }

  private addStep(text: string, actions: () => void, completedSub: Observable<any>) {
    this.steps.push({text, actions, completedSub});
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

  private setSteps() {
    this.addStep('Bienvenidos', () => {
    }, timer(4000));
    this.addStep('El objetivo del juego consiste en alimentar al pajaro que nos indique la ventana ubicada arriba a la derecha',
      () => {
        console.log(this.exercise.optionsBirds);
        timer(4000).subscribe( z => this.setMagnifierReference('bird-to-select'));
      }, this.okButtonHasBeenClick);
    // this.addStep('Visualiza el pajaro indicado en la parte superior', () => {
    //
    // }, );
    this.addStep('Haz click en pajaro de las opciones señaladas que coincida en forma y color con el indicado en el paso anterior', () => {
      this.setMagnifierReference('all-birds');
    }, timer(5000));
    this.addStep('Los pájaros pueden ser dobles, en caso de coincidir con el , clickealo dos veces para alimentar a ambos', () => {
      this.setNewExercise(1, true,
        () => this.setMagnifierReference('bird-' + this.exercise.optionsBirds.findIndex(z => z.isDouble)));
    }, timer(4000));
    this.addStep('alimentar la mayor cantidad de que se acabe el tiempo', () => {
      this.clockComponent.startTime(15000);
      this.setMagnifierReference('clock');
    }, this.okButtonHasBeenClick);
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

  onOkButtonClicked() {
    this.okButtonHasBeenClick.emit();
  }

  private destroyEndStepSubscription() {
    if (this.currentEndStepSubscription) {
      this.currentEndStepSubscription.unsubscribe();
    }
    this.currentEndStepSubscription = undefined;
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.destroyEndStepSubscription();
  }
}
