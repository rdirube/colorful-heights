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
  public progressAnimation!: number;
  public pieAnimation!: any[];


  public playPauseMethod() {
    this.isPaused ? this.playTime() : this.pauseTime();
  }


  public pauseTime() {
    this.isPaused = true;
    this.pieAnimation.forEach(z => {
      z.pause()
    });
  }

  public playTime() {
    this.isPaused = false;
    this.pieAnimation.forEach(z => {
      z.play()
    });
  }
  
  public addTimeMethod(bonus:number) {
    this.pauseTime()
    this.pieAnimation.forEach(z=> {
      z.seek(((this.progressAnimation - bonus) * this.duration) / 100);
    })
    this.playTime();
  }
  




  constructor(private challengeService:ColorfulHeightsChallengeService) {
    super()
    const animationPieTimeLine = anime.timeline({
      targets: '.svg-inner-pie',
      duration:this.duration+2500
    })
    this.addSubscription(this.challengeService.startTime, x=> {
      this.pieAnimation =[
      animationPieTimeLine.add({
        duration:2500,
        backgroundColor: "rgb(119, 198, 110)"
      })
      .add({
        duration: this.duration,
        strokeDashoffset: [anime.setDashoffset, 0],
        easing: 'linear',
        update: (anim) => {
          this.progressAnimation = Math.round(anim.progress)
        },
        keyframes: [{ fill: 'rgb(253, 218, 13)' , easing:'easeInOutQuad'}, { fill: 'rgb(250, 0, 0)' , easing:'easeInOutQuad'}],    
      }), anime({
        targets: '.timer',
        duration: this.duration,
        keyframes: [{ borderColor: 'rgb(253, 218, 13)' , easing:'easeInOutQuad'}, { borderColor: 'rgb(250, 0, 0)' , easing:'easeInOutQuad'}],   
      })] 
    })


    this.addSubscription(this.challengeService.bonusTime, x => {
      this.addTimeMethod(x);
    })
  }



  ngOnInit(): void {
    this.isTimeRunning = true;

  }


  ngAfterViewInit(): void {

    
      

    // this.animations = [
    //   anime({
    //     targets: '.pieSpinner',
    //     rotate: {
    //       value: 360,
    //       duration: this.duration,
    //       easing: 'linear'
    //     },
    //     zIndex: {
    //       value:  this.zIndexAdjustment(),
    //       delay: this.duration/2 - 1000,
    //     }
    //   }
    //   ),
    //   anime.timeline({
    //     duration: this.duration
    //   }).add({
    //     targets: '.timer-running',
    //     keyframes: [{ borderColor: 'rgb(253, 218, 13)' }, { borderColor: 'rgb(250, 0, 0)' }],
    //     easing: 'easeInOutQuad'
    //   }, 0).add({
    //     targets: '.mask',
    //     keyframes: [{ backgroundColor: 'rgb(253, 218, 13)' }, { backgroundColor: 'rgb(250, 0, 0)' }],
    //     easing: 'easeInOutQuad'
    //   }, 0),
    //   anime({
    //     targets: '.pieFiller',
    //     keyframes: [{ backgroundColor: 'rgb(253, 218, 13)', duration: this.duration / 2 }, {
    //       backgroundColor: "#FFF", duration: 1
    //     }, {
    //       backgroundColor: "#FFF", duration: this.duration / 2
    //     }],
    //     easing: 'easeInOutQuad',
    //     update: (anim) => {
    //       this.progressAnimation = Math.round(anim.progress)
    //     }
    //   })
    // ]
  }



  // playPauseMethod() {
  //   this.isPaused ? this.playTime() : this.pauseTime();
  // }


}


