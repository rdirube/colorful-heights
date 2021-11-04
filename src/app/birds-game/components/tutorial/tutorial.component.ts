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
  public clicksOn: boolean = false;
  public boxOn: boolean = false;
  readonly magnifierPositions = MAGNIFIER_POSITIONS;
  private okButtonHasBeenClick = new EventEmitter();
  private correctBirdSelect = new EventEmitter();

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
    console.log("hola");
    if (!bird.isOption || !this.clicksOn) return;
    if (bird.bird.isDouble && bird.isDoubleCounter < 1 && sameBird(bird.bird, this.exercise.targetBird)) {
      bird.isDoubleCounter++;
    } else if (sameBird(bird.bird, this.exercise.targetBird)) {
      this.correctBirdSelect.emit();
    }
  }

  // TRY CLICK
  // bird.answerService.setBirdAsAnswer(bird.bird, bird.svgBirdGenerator(bird.bird.type, []));
  // bird.gameActions.actionToAnswer.emit();
  // bird.answerService.onTryAnswer();



  ngAfterViewInit(): void {
    this.birdsUpAnimation(400);
    this.birdToSelectComponent.birdToSelectAnimationAppearence();
    this.executeCurrentStep();
  }

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




  private setSteps() {
    this.addStep('Bienvenidos', () => {
    }, timer(4000));
    this.addStep('El objetivo del juego consiste en alimentar al pajaro que nos indique la ventana ubicada arriba a la derecha',
      () => {
        console.log(this.exercise.optionsBirds);
        timer(4000).subscribe(z => this.setMagnifierReference('bird-to-select'));
      }, this.okButtonHasBeenClick);
    this.addStep('Haz click en el pajaro de las opciones señaladas que coincida en forma y color con el indicado en el paso anterior', () => {
      this.setMagnifierReference('all-birds');
    }, timer(5000));
    this.addStep('Atento a los pajaros trampa', () => {
      const trapBirds = this.tutorialService.birdComponents.filter(z => !sameBird(z.bird, this.exercise.targetBird));
      trapBirds.forEach(w => w.trapBirdOn = true);
    }, this.okButtonHasBeenClick);
    this.addStep('Haz click en el pajaro correcto', () => {
      this.clicksOn = true;
      this.tutorialService.birdComponents.forEach(d => {
        d.trapBirdOn = false;
      })
    }, this.correctBirdSelect);
    this.addStep('Los pájaros pueden ser dobles, en caso de coincidir con el , clickealo dos veces para alimentar a ambos', () => {
      this.setNewExercise(1, true,
        () => this.setMagnifierReference('bird-' + this.exercise.optionsBirds.findIndex(z => z.isDouble)));
    }, timer(3000));
    this.addStep('Clickea dos veces en los pájaros dobles correctos', ()=> {
      this.setMagnifierReference('all-birds');
    }, this.correctBirdSelect)
    this.addStep('Alimentar la mayor cantidad de pajaros antes de que se acabe el tiempo', () => {
      this.clockComponent.startTime(15000);
      this.setMagnifierReference('clock');
    }, this.okButtonHasBeenClick);
    this.addStep('Ante una racha de aciertos consecutivos, se activara un bonus de segundos extra', ()=> {
      this.clockComponent.goBackMethod(this.clockComponent.borderAnimation, -50);
    },this.okButtonHasBeenClick);
    // this.addStep('Cada ejercicio tiene un bonus')
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
