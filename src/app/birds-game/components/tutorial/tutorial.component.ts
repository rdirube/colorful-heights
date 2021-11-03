import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {BaseBodyDirective} from '../../directives/base-body.directive';
import {BirdInfo, TutorialStep} from '../../../shared/models/types';
import {OxTextInfo} from 'ox-types';
import {Observable, Subscription, timer} from 'rxjs';
import anime from 'animejs';
import {TextComponent} from 'typography-ox';
import {NestGroupComponent} from '../nest-group/nest-group.component';
import {BirdComponent} from '../bird/bird.component';
import {TutorialService} from '../../services/tutorial.service';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})
export class TutorialComponent extends BaseBodyDirective implements OnInit, AfterViewInit {

  @ViewChild('tutorialText') tutorialText!: TextComponent;
  @ViewChild(NestGroupComponent) nestGroup!: NestGroupComponent;

  targetBird: BirdInfo = {
    color: 'azul',
    type: 'lechuza'
  };
  optionsBirds: BirdInfo[] = [
    {
      color: 'azul',
      type: 'pelado'
    }, {
      color: 'rojo',
      type: 'cóndor'
    }, {
      color: 'amarillo',
      type: 'cotorra'
    },
  ];

  private currentStep = 0;

  text: string = '';
  private steps: TutorialStep[] = [];
  private clicksOn: boolean = false;

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
    this.replaceBirds3and4(this.optionsBirds);
    this.treeClass = 'tree-show no-transition';
    this.baseClass = 'base-hide no-transition';
  }

  ngOnInit(): void {
  }

  tutorialBirdClick(bird: BirdComponent) {
    if (!bird.isOption || this.clicksOn) return;
    if (bird.bird.isDouble && bird.isDoubleCounter < 1) {
      bird.isDoubleCounter++;
    } else {
      console.log('I have been clicked', bird);
      this.setNewExercise();
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
    console.log(this.nestGroup);
  }

  private addStep(text: string, actions: () => void, completedSub: Observable<any>) {
    this.steps.push({text, actions, completedSub});
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
      console.log('this is an action method');
    }, timer(4000));
    this.addStep('Bienvenidos 222222222', () => {
      console.log('this is an action method');
    }, timer(4000));
    this.addStep('3333333 222222222', () => {
      console.log('this is an action method');
    }, timer(4000));
  }

  private setNewExercise() {
    this.birdsDownAnimation(() => {
      const exercise = this.tutorialService.generateTutorialExercise(3, 1);
      this.targetBird = exercise.targetBird;
      this.optionsBirds = exercise.optionsBirds;
      this.birdsUpAnimation(0, () => this.clicksOn = true);
    });
  }
}
