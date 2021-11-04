import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { BaseBodyDirective } from '../../directives/base-body.directive';
import { BirdInfo, MagnifierPosition, TutorialStep } from '../../../shared/models/types';
import { getPositionMultipler, okButtonPosition } from '../../../shared/models/functions';
import { Observable, Subscription, timer } from 'rxjs';
import anime from 'animejs';
import { TextComponent } from 'typography-ox';
import { NestGroupComponent } from '../nest-group/nest-group.component';
import { BirdComponent } from '../bird/bird.component';
import { TutorialService } from '../../services/tutorial.service';
import { ColorfulHeightsAnswerService } from 'src/app/shared/services/colorful-heights-answer.service';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})
export class TutorialComponent extends BaseBodyDirective implements OnInit, AfterViewInit {




  @ViewChild('tutorialText') tutorialText!: TextComponent;
  @ViewChild(NestGroupComponent) nestGroup!: NestGroupComponent;

  exercise = this.tutorialService.generateTutorialExercise(3, 0);

  private currentStep = 0;
  public magnifierIndex: number = 0;
  text: string = '';
  private steps: TutorialStep[] = [];
  private clicksOn: boolean = false;
  public boxOn: boolean = false;
  public buttonOkOn: boolean = false;


  public readonly magnifierPositions: MagnifierPosition[] = [{
    width: '32vh',
    height: '29vh',
    transform: 'translate(-2vh, 9vh)',
    borderRadius: '20%',
    flexPosition: 'end start',
    buttonInfo: okButtonPosition('left','bottom','32vh','29vh') 
  }, {
    width: '145vh',
    height: '33vh',
    transform: 'translate(0vh, 9vh)',
    borderRadius: '10px',
    flexPosition: 'center center'
  },
  {
    width: '32vh',
    height: '29vh',
    transform: 'translate(-41.5vh, 8.7vh)',
    borderRadius: '20%',
    flexPosition: 'center center'
  },
  {
    width: '32vh',
    height: '29vh',
    transform: 'translate(41.5vh, 8.7vh)',
    borderRadius: '20%',
    flexPosition: 'center center'
  },
  {
    width: '32vh',
    height: '29vh',
    transform: 'translate(0vh, 12vh)',
    borderRadius: '20%',
    flexPosition: 'center center'
  },
  {
    width:'27vh',
    height:'25vh',
    transform:'translate(0vh, -14vh)',
    borderRadius: '20%',
    flexPosition: 'center center',
    buttonInfo: okButtonPosition('right','bottom','27vh','25vh') 

  }];

  

  // 'translate(17.5vh, 42vh)' width 30vh : height 29vh bird left
  //  translate(118vh, 9vh) width 30vh : height 28vh select-bird
  //  translate(103.5vh, 44vh) : bird right
  // translate(60vh, 50vh) bird center;

  constructor(private tutorialService: TutorialService, private answerService: ColorfulHeightsAnswerService) {
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



  @HostListener('document:keydown', ['$event'])
  asdasdasdsad($event: KeyboardEvent): void {
    if ($event.key === 'n') {
      this.magnifierIndex++;
      if (this.magnifierIndex >= this.magnifierPositions.length) {
        this.magnifierIndex = 0;
      }
    }
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
    this.steps.push({ text, actions, completedSub });
  }

  private executeCurrentStep() {
    const step = this.steps[this.currentStep];
    this.textChangeAnimation(step.text);
    step.actions();
    step.completedSub.subscribe(z => this.onCompleteStep());
  }

  private onCompleteStep() {
    if (this.steps[++this.currentStep])
      this.executeCurrentStep();
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
   ()=> { console.log(this.exercise.optionsBirds)}  , timer(4000))
    this.addStep('Visualiza el pajaro indicado en la parte superior', () => {
      this.boxOn = true;
      this.buttonOkOn = true;
    },  timer(5000)
    // this.addSubscription(this.tutorialService.birdStepCorrect, x => {
    //   if (x==1) {
    //      this.onCompleteStep();
    //   }}
    )
    this.addStep('Haz click en pajaro de las opciones señaladas que coincida en forma y color con el indicado en el paso anterior', () => {
      this.magnifierIndex++;
      this.buttonOkOn = false;
    }, timer(5000));
    this.addStep('Los pájaros pueden ser dobles, en caso de coincidir con el , clickealo dos veces para alimentar a ambos', () => {
      this.setNewExercise(1, true);
    }, timer(4000));
    this.addStep('alimentar la mayor cantidad de que se acabe el tiempo', ()=> {
        this.clockComponent.startTime(15000);
        this.magnifierIndex = 5;
        timer(1000).subscribe(h=> this.buttonOkOn = true);
    }, timer(4000));
  }


  private setNewExercise(doubleQuantity: number, forceDoubleCorrect?: boolean) {
    this.birdsDownAnimation(() => {
      this.exercise = this.tutorialService.generateTutorialExercise(3, doubleQuantity, forceDoubleCorrect);
      this.setMagnifierInForceDoble(forceDoubleCorrect);
      this.birdsUpAnimation(0, () => this.tutorialService.setClicksOn(true));
    });
  }



  private setMagnifierInForceDoble(forceDouble?:boolean):void {
    if(forceDouble){
    const indexOfDouble = this.exercise.optionsBirds.findIndex(z => z.isDouble);
    console.log(indexOfDouble);
    switch (indexOfDouble) {
      case 0:
        this.magnifierIndex = 2;
        break;
        case 1:
          this.magnifierIndex = 4;
          break;
          case 2:
            this.magnifierIndex = 3;
            break;
            default:
             this.magnifierIndex = -1
    }
  }}
 
   


}
