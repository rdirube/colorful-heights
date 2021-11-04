import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {timer} from 'rxjs';
import anime from 'animejs';
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

  public pieAnimation!: any;
  public borderAnimation!: any;
  bonusText!: string;
  @Input() sendFinishEvent: boolean = true;

  constructor(private challengeService: ColorfulHeightsChallengeService,
              private gameActions: GameActionsService<any>,
              private soundService: SoundOxService,
              private microLessonCommunication: MicroLessonCommunicationService<any>) {
    super();
  }

  ngOnInit(): void {
  }

  startTime(time: number) {
    this.duration = time;
    if (this.pieAnimation) {
      this.pauseTime();
      this.pieAnimation.seek(0);
      this.borderAnimation.seek(0);
      this.playTime();
      return;
    }

    const animationPieTimeLine = anime.timeline({
      targets: '.svg-inner-pie',
    });
    const animationBorderPie = anime.timeline({
      targets: '.timer',
    });
    this.pieAnimation = animationPieTimeLine.add({
      backgroundColor: "rgb(119, 198, 110)"
    })
      .add({
        duration: this.duration,
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'linear',
        keyframes: [{fill: 'rgb(253, 218, 13)', easing: 'linear'}, {fill: 'rgb(250, 0, 0)', easing: 'linear'}],
      });
    this.borderAnimation = animationBorderPie.add({
      targets: '.timer',
      backgroundColor: "rgb(119, 198, 110)"
    }).add({
      targets: '.timer',
      duration: this.duration,
      keyframes: [{borderColor: 'rgb(253, 218, 13)', easing: 'linear'}, {
        borderColor: 'rgb(250, 0, 0)',
        easing: 'linear'
      }],
    });
    if (this.sendFinishEvent) {
      animationPieTimeLine.finished.then(z => {
        timer(1000).subscribe(aa => {
          this.gameActions.microLessonCompleted.emit();
          timer(500).subscribe(zzz =>
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
    this.borderAnimation.pause();
  }

  public playTime() {
    this.isPaused = false;
    this.pieAnimation.play();
    this.borderAnimation.play();
  }

  // Bonus is in seconds
  public addTimeMethod(secondsToAdd: number) {
    const timeToAdd = secondsToAdd * 1000;
    const percentageToAdd = (timeToAdd * 100) / this.duration;
    this.pauseTime();
    this.textAnimation(secondsToAdd);
    this.goBackMethod(this.pieAnimation, percentageToAdd);
    this.goBackMethod(this.borderAnimation, percentageToAdd);
    this.playTime();
  }

  public goBackMethod(animation: any, bonus: number) {
    animation.seek(((Math.round(this.borderAnimation.progress) - bonus) * this.duration) / 100);
  }

}


