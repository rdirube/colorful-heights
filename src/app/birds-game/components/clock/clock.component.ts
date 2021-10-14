import { Component, OnInit, AfterViewInit } from '@angular/core';
import { timer } from 'rxjs';
import anime from 'animejs';
import { listenOrNotOperator } from '@ngneat/transloco/lib/shared';


@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent implements OnInit, AfterViewInit {


  public isTimeRunning: boolean = false;
  public duration: number = 14000;
  public currentMsSecond: number = 0;
  public animations: any[] = []
  public isPaused: boolean = false;
  public progressAnimation!: number;
  public pieAnimation: any;
  public playPauseMethod() {
    this.isPaused ? this.playTime() : this.pauseTime();
  }
  public pauseTime() {
    this.isPaused = true;
    this.pieAnimation.pause()
  }
  public playTime() {
    this.isPaused = false;
    this.pieAnimation.play();
  }
  
  public  addTimeMethod() {
    this.pauseTime()
    this.pieAnimation.seek(((this.progressAnimation - 20) * this.duration) / 100);
    this.playTime();

  }
  




  constructor() {
  }



  ngOnInit(): void {
    this.isTimeRunning = true;

  }


  ngAfterViewInit(): void {

    this.pieAnimation = 
      anime({
        targets: '.svg-inner-pie',
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
      })
      

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