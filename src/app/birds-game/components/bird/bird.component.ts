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
  @Input('testInput')
  set asdasdas(b: string) {
    console.log('scv has changed.')
    console.log(this.svgBird, b);
  }
  @Input() bird!: BirdsAux;
  @Input() isAnswer!: boolean;
  @Input() wings!: string;
  @Input() svgBird!: string;
  public isDoubleCounter: number = 0;
  public pathWithReplaces!:{path: string;
    replaces: Map<string, string>;} 


  constructor(private elementRef: ElementRef, private preloaderService: PreloaderOxService, private challengeService: ColorfulHeightsChallengeService) {
    super()
    this.addSubscription(this.challengeService.clickBirdEvent, x => {
      this.svgBird = this.bird.svgBirdHappy;
      interval(200).pipe(take(5)).subscribe(w => {
        this.wingAnimationMethod()
      })
      timer(1550).subscribe(z=> {
        this.svgBird = this.bird.svgBird;
        this.wings = this.bird.svgWings;
      })
    })
  }

  


  ngOnInit(): void {
    this.wings = this.bird.svgWings;
    this.svgBird = this.bird.svgBird;
  }


  wingAnimationMethod(): void {
    this.wings = (this.wings === this.bird.svgWings) ? this.bird.svgWingsUp : this.bird.svgWings;
  }



  birdSelectMethod(isDouble: boolean) {
    if (isDouble) {
      this.isDoubleCounter++
      if (this.isDoubleCounter === 2) {
        this.isDoubleCounter = 0;
        this.challengeService.clickBirdEvent.emit()
      }
    } else {
      this.challengeService.clickBirdEvent.emit()
      this.replacePath();
    }
  }


  replacePath():void {
    this.pathWithReplaces.path = "path";
    this.pathWithReplaces.replaces.set("#406faf", "#e81e25");
  }


  // @HostListener('document:keydown', ['$event'])
  // wingsAnimation($event: KeyboardEvent) {
  //   if ($event.key === 'q') {


  //     interval(400).pipe(take(5)).subscribe(w =>
  //       this.wingAnimationMethod()
  //     )
  //   }
  // }



}