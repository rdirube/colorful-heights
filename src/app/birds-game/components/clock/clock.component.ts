import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { timer } from 'rxjs';
import anime from 'animejs';
import { listenOrNotOperator } from '@ngneat/transloco/lib/shared';
import { SubscriberOxDirective } from 'micro-lesson-components';
import { ColorfulHeightsChallengeService } from 'src/app/shared/services/colorful-heights-challenge.service';


@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent extends SubscriberOxDirective implements OnInit, AfterViewInit {


  public isTimeRunning: boolean = false;
  public duration:number = 20000;
  public currentMsSecond: number = 0;
  public animations: any[] = []
  public isPaused: boolean = false;
  public progressAnimationPie!: number;
  public progressAnimationBorder!: number;

  public pieAnimation!: any;
  public borderAnimation!:any;


  public playPauseMethod() {
    this.isPaused ? this.playTime() : this.pauseTime();
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
  
  public addTimeMethod(bonus:number) {
    this.pauseTime()
    this.goBackMethod(this.pieAnimation,bonus)
    this.goBackMethod(this.borderAnimation,bonus)
    this.playTime();
  }
  

  public goBackMethod(animation:any, bonus:number) {
    animation.seek(((this.progressAnimationBorder - bonus) * this.duration) / 100);
  }




  constructor(private challengeService:ColorfulHeightsChallengeService) {
    super()
    const animationPieTimeLine = anime.timeline({
      targets: '.svg-inner-pie',
      duration:this.duration+2500
    })
    const animationBorderPie = anime.timeline({
      targets: '.timer',
      duration:this.duration+2500
    })       
    this.addSubscription(this.challengeService.startTime, x=> {
      this.pieAnimation =
      animationPieTimeLine.add({
        duration:2500,
        backgroundColor: "rgb(119, 198, 110)"
      })
      .add({
        duration: this.duration,
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'linear',
        update: (anim) => {
          this.progressAnimationPie = Math.round(anim.progress)
        },
        keyframes: [{ fill: 'rgb(253, 218, 13)' , easing:'linear'}, { fill: 'rgb(250, 0, 0)' , easing:'linear'}],    
      })

      this.borderAnimation = animationBorderPie.add({
        targets: '.timer',
        duration:2500,
        backgroundColor: "rgb(119, 198, 110)"
      }).add({
        targets: '.timer',
        duration: this.duration,
        update: (anim) => {
          this.progressAnimationBorder = Math.round(anim.progress)
        },
        keyframes: [{ borderColor: 'rgb(253, 218, 13)' , easing:'linear'}, { borderColor: 'rgb(250, 0, 0)' , easing:'linear'}],  
      })   
    })

    

    this.addSubscription(this.challengeService.bonusTime, x => {
      this.addTimeMethod(x);
    })
  }



  ngOnInit(): void {
    this.isTimeRunning = true;

  }


  ngAfterViewInit(): void {

    
      

  }





}


