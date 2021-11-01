import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import anime, {random} from 'animejs';
import {LoadedSvgComponent} from 'micro-lesson-components';
import {BirdsAux, BirdType, Replaces, BirdState, BirdInfo} from 'src/app/shared/models/types';
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

  @Input('birdInfo') 
  set setBirdInfo(b: BirdInfo) {
    this.bird = b;
    this.updatePathAndReplaces();
  }
  bird!: BirdInfo;
  @Input() isAnswer!: boolean;
  @Input() wings!: string;
  @Input() svgBird!: string;
  public isDoubleCounter: number = 0;
  public isHappy: number = 0;
  public wingsUpActivate: boolean = false;
  private readonly ruteBirdAsset: string = "colorful-heights/svg/Pajaritos/";
  public birdState:BirdState = "";



  public bodyPathWithReplaces!: Replaces;
  public wings1PathWithReplaces!: Replaces;
  public wings2PathWithReplaces!: Replaces;

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
      this.birdState = "happy";
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


  birdSelectMethod() {
    // if (isDouble) {
    //   this.isDoubleCounter++;
    //   if (this.isDoubleCounter === 2) {
    //     this.isDoubleCounter = 0;
    //     this.challengeService.clickBirdEvent.emit();
    //   }
    // } else {
      this.challengeService.clickBirdEvent.emit();
    
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

  colorsParseMethod(color: string): string {
    let birdColorParsed!: string;
    switch (color) {
      case 'azul':
        birdColorParsed = "#406faf";
        break;
      case 'rojo':
        birdColorParsed = "#e81e25";
        break;
      case 'amarillo':
        birdColorParsed = "#ffc807";
        break;
      case 'violeta':
        birdColorParsed = "#8b2c90";
        break;
      default:
        birdColorParsed = "#73be44";
    }
    return birdColorParsed;
  }

  private assignPathAndReplaceTo(state: string, replaces: Map<string, string>): Replaces {
    return {
      path: this.svgBirdGenerator(this.bird.type, state),
      replaces
    }
  }

  updatePathAndReplaces() {
    const replaces = this.getReplaces();
    this.bodyPathWithReplaces = this.assignPathAndReplaceTo(this.birdState, replaces);
    this.wings1PathWithReplaces = this.assignPathAndReplaceTo('alas 1', replaces);
    this.wings2PathWithReplaces = this.assignPathAndReplaceTo('alas 2', replaces);
  }


  getReplaces(): Map<string, string> {
    const replaces = new Map<string, string>();
    replaces.set("#406faf",this.colorsParseMethod(this.bird.color))
    return replaces;
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
