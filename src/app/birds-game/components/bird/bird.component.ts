import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import anime from 'animejs'
import { LoadedSvgComponent } from 'micro-lesson-components';
import { BirdsAux } from 'src/app/shared/models/types';
import { PreloaderOxService } from 'ox-core';
import { ColorfulHeightsChallengeService } from 'src/app/shared/services/colorful-heights-challenge.service';
import { SubscriberOxDirective } from 'micro-lesson-components';
import { interval, timer } from 'rxjs';
import { take } from 'rxjs/operators';


@Component({
  selector: 'app-bird',
  templateUrl: './bird.component.html',
  styleUrls: ['./bird.component.scss']
})


export class BirdComponent extends SubscriberOxDirective implements OnInit {

  @ViewChild(LoadedSvgComponent) loadedSvgComponent!: LoadedSvgComponent;
  @Input() bird!: BirdsAux;
  @Input() isAnswer!: boolean;
  @Input() i: number = 0;
  @Input() isDouble!: boolean;
  public wings!: string;
  public svgBird!: string;
  public happyBird!: boolean;

  constructor(private elementRef: ElementRef, private preloaderService: PreloaderOxService, private challengeService: ColorfulHeightsChallengeService) {
    super()

    this.addSubscription(this.challengeService.clickBirdEvent, x => {
      this.svgBird = this.bird.svgBirdHappy;
      interval(400).pipe(take(3)).subscribe(f=> {
        this.wingAnimationMethod();
      });
    })
  }



  ngOnInit(): void {
    this.wings = this.bird.svgWings;
    this.svgBird = this.bird.svgBird;
  }


  wingAnimationMethod():void {
    this.wings = this.bird.svgWings ? this.bird.svgBirdHappy : this.bird.svgWings;
  }


  clickBirdEmitMethod(): void {
    this.challengeService.clickBirdEvent.emit(this.bird.isDouble)
  }



}

