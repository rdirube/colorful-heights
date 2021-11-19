import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {interval, Subscription, timer} from 'rxjs';
import anime, {AnimeTimelineInstance} from 'animejs';
import {SubscriberOxDirective} from 'micro-lesson-components';
import {ColorfulHeightsChallengeService} from 'src/app/shared/services/colorful-heights-challenge.service';
import {GameActionsService, MicroLessonCommunicationService, SoundOxService} from 'micro-lesson-core';
import {GameAskForScreenChangeBridge, ScreenTypeOx} from 'ox-types';
import {TextComponent} from 'typography-ox';


@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent extends SubscriberOxDirective implements OnInit {


  @ViewChild(TextComponent) bonusTextComponent!: TextComponent;

  public duration!: number;
  public isPaused: boolean = false;
  public tutorialInterval!: Subscription;
  public pieAnimation!: AnimeTimelineInstance;
  // public borderAnimation!: AnimeTimelineInstance;
  bonusText!: string;
  @Input() sendFinishEvent: boolean = true;

  constructor(private challengeService: ColorfulHeightsChallengeService,
              private gameActions: GameActionsService<any>,
              private soundService: SoundOxService,
              private microLessonCommunication: MicroLessonCommunicationService<any>) {
    super();
    this.addSubscription(this.gameActions.microLessonCompleted, z => {
      this.destroyClockAnimations();
      // this.borderAnimation = undefined as any;
    });
  }


  public destroyClockAnimations() {
    this.bonusText = '';
    anime.remove('.svg-inner-pie');
    anime.remove('.timer');
    anime.remove(this.bonusTextComponent.textElement.nativeElement);
    this.pieAnimation = undefined as any;
    if (this.tutorialInterval) {
      this.tutorialInterval.unsubscribe();
    }
    this.tutorialInterval = undefined as any;
  }

  ngOnInit(): void {
  }


  startTime(time: number) {
    this.duration = time * 1000;
    if (this.pieAnimation) {
      this.pauseTime();
      this.pieAnimation.seek(0);
      // this.borderAnimation.seek(0);
      this.playTime();
      return;
    }

    const animationPieTimeLine = anime.timeline({
      targets: ['.svg-inner-pie', '.timer'],
    });
    // const animationBorderPie = anime.timeline({
    //   targets: '.timer',
    // });
    this.pieAnimation = animationPieTimeLine.add({
      backgroundColor: "rgb(119, 198, 110)"
    })
      .add({
        duration: this.duration,
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'linear',
        keyframes: [
          {fill: 'rgb(119, 198, 110)', duration: 0, borderColor: 'rgb(119, 198, 110)'},
          {fill: 'rgb(253, 218, 13)', easing: 'linear', borderColor: 'rgb(253, 218, 13)'},
          {fill: 'rgb(250, 0, 0)', easing: 'linear', borderColor: 'rgb(250, 0, 0)'}],
      });
    // this.borderAnimation = animationBorderPie.add({
    //   targets: '.timer',
    //   backgroundColor: "rgb(119, 198, 110)"
    // }).add({
    //   targets: '.timer',
    //   duration: this.duration,
    //   keyframes: [{borderColor: 'rgb(253, 218, 13)', easing: 'linear'}, {
    //     borderColor: 'rgb(250, 0, 0)',
    //     easing: 'linear'
    //   }],
    // });
    if (this.sendFinishEvent) {
      animationPieTimeLine.finished.then(z => {
        console.log('Clock finish.');
        timer(100).subscribe(aa => {
          this.gameActions.microLessonCompleted.emit();
          timer(100).subscribe(zzz =>
            this.microLessonCommunication.sendMessageMLToManager(GameAskForScreenChangeBridge, ScreenTypeOx.GameComplete));
        });
      });
    }
  }


  textAnimation(secondsAdded: number) {
    this.bonusText = '+' + secondsAdded;
    anime.remove(this.bonusTextComponent.textElement.nativeElement);
    this.soundService.playSoundEffect('colorful-heights/sounds/bonus.mp3', ScreenTypeOx.Game);
    anime({
      targets: this.bonusTextComponent.textElement.nativeElement,
      duration: 1300,
      scale: [0.25, 1],
      translateX: ['-120%', '0'],
      translateY: ['-130%', '0'],
      endDelay: 1000,
      complete: () => {
        anime({
          targets: this.bonusTextComponent.textElement.nativeElement,
          scale: 0,
          duration: 0
        });
      }
    });
  }


  public pauseTime() {
    this.isPaused = true;
    this.pieAnimation.pause();
    // this.borderAnimation.pause();
  }


  public playTime() {
    this.isPaused = false;
    this.pieAnimation.play();
    // this.borderAnimation.play();
  }


  // Bonus is in seconds
  public addTimeMethod(secondsToAdd: number) {
    const timeToAdd = secondsToAdd * 1000;
    const percentageToAdd = (timeToAdd * 100) / this.duration;
    this.textAnimation(secondsToAdd);
    this.pauseTime();
    this.goBackMethod(this.pieAnimation, percentageToAdd);
    // this.goBackMethod(this.borderAnimation, percentageToAdd);
    this.playTime();
  }


  public goBackMethod(animation: any, bonus: number) {
    animation.seek(((Math.round(this.pieAnimation.progress) - bonus) * this.duration) / 100);
  }


  public tutorialClockMethod(moveFowardPercentage: number, secondsToAdd: number, intervalTime: number) {
    this.pauseTime();
    this.destroyClockAnimations();
    this.startTime(10);
    this.tutorialInterval = interval(3000).subscribe( z => {
      this.addTimeMethod(2);
    });
    // this.goBackMethod(this.pieAnimation, moveFowardPercentage);
    // this.goBackMethod(this.borderAnimation, moveFowardPercentage);
    // this.playTime();
    // timer(500).subscribe(z => {
    //   this.addTimeMethod(secondsToAdd);
    // });
    // this.tutorialInterval = setInterval(
    //   () => this.addTimeMethod(secondsToAdd)
    //   , intervalTime);
  }


  seekAnimation(number: number) {
    if (this.animationsInstanciated()) {
      this.pieAnimation.seek(number);
      // this.borderAnimation.seek(number);
    }
  }

  public animationsInstanciated(): boolean {
    return this.pieAnimation !== undefined;
  }
}


