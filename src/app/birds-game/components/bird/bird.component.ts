import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import anime, {random} from 'animejs';
import {LoadedSvgComponent} from 'micro-lesson-components';
import {BirdsAux, BirdType} from 'src/app/shared/models/types';
import {anyElement, PreloaderOxService} from 'ox-core';
import {ColorfulHeightsChallengeService} from 'src/app/shared/services/colorful-heights-challenge.service';
import {SubscriberOxDirective} from 'micro-lesson-components';
import {interval, timer} from 'rxjs';
import {take} from 'rxjs/operators';


@Component({
  selector: 'app-bird',
  templateUrl: './bird.component.html',
  styleUrls: ['./bird.component.scss']
})


export class BirdComponent extends SubscriberOxDirective implements OnInit {

  @ViewChild(LoadedSvgComponent) loadedSvgComponent!: LoadedSvgComponent;

  @Input() bird!: BirdsAux;
  @Input() isAnswer!: boolean;
  @Input() wings!: string;
  @Input() svgBird!: string;
  public isDoubleCounter: number = 0;
  public isHappy: number = 0;
  public wingsUpActivate: boolean = false;
  private readonly ruteBirdAsset: string = "colorful-heights/svg/Pajaritos/";


//   type: 'lechuza',
//   svgBird: "colorful-heights/svg/Pajaritos/lechuza.svg",
//   svgBirdHappy: "colorful-heights/svg/Pajaritos/lechuza_happy.svg",
//   svgBirdSad: "colorful-heights/svg/Pajaritos/lechuza_sad.svg",
//   svgWings: 'colorful-heights/svg/Pajaritos/lechuza_alas_1.svg',
//   svgWingsUp: "colorful-heights/svg/Pajaritos/lechuza_alas_2.svg",
//   isDouble: false,
//   pathWithReplaces: undefined as any
// },


  constructor(private elementRef: ElementRef, private preloaderService: PreloaderOxService, private challengeService: ColorfulHeightsChallengeService) {
    super();
    this.addSubscription(this.challengeService.clickBirdEvent, x => {
      this.isHappy = 1;
      interval(200).pipe(take(4)).subscribe(w => {
        this.wingAnimationMethod();
      });
      timer(1550).subscribe(z => {
        this.isHappy = 0;
      });
    });
  }


  ngOnInit(): void {
  }


  wingAnimationMethod(): void {
    this.wingsUpActivate = !this.wingsUpActivate;
  }


  birdSelectMethod(isDouble: boolean) {
    if (isDouble) {
      this.isDoubleCounter++;
      if (this.isDoubleCounter === 2) {
        this.isDoubleCounter = 0;
        this.challengeService.clickBirdEvent.emit();
      }
    } else {
      this.challengeService.clickBirdEvent.emit();
    }
  }


  svgBirdGeneratorSanti(bird: BirdType, extraWords: string[] = []): string {
    return "colorful-heights/svg/Pajaritos/" + [bird as string].concat(extraWords).join('_') + ".svg";
    // return "colorful-heights/svg/Pajaritos/" + [bird as string].concat(extraWords).join('_') + ".svg";
  }

  svgBirdGenerator(bird: BirdType, svgType: string = ''): string {
    if (svgType === "happy" || svgType === "sad") {
      svgType = "_" + svgType;
    } else if (svgType.length > 0) {
      const wingTypeSolution = svgType.split(" ");
      svgType = "_" + wingTypeSolution[0] + "_" + wingTypeSolution[1];
    }
    return "colorful-heights/svg/Pajaritos/" + bird + svgType + ".svg";
  }

  // replacePathBirds(): void {
  //   this.pathWithReplaces = [{
  //     path: this.bird.svgBird,
  //     replaces: new Map<string, string>()
  //   }, { path: this.bird.svgBirdHappy, replaces: new Map<string, string>() },
  //   { path: this.bird.svgWings, replaces: new Map<string, string>() },
  //   { path: this.bird.svgWingsUp, replaces: new Map<string, string>() }]
  //   const colorSelected = anyElement(this.colorsAvaiable);
  //   this.pathWithReplaces.forEach(o =>
  //     o.replaces.set("#406faf", colorSelected)
  //   )
  // }


  // @HostListener('document:keydown', ['$event'])
  // wingsAnimation($event: KeyboardEvent) {
  //   if ($event.key === 'q') {


  //     interval(400).pipe(take(5)).subscribe(w =>
  //       this.wingAnimationMethod()
  //     )
  //   }
  // }


}
