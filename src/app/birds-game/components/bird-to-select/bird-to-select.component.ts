import { Component, OnInit, Input , ViewChild} from '@angular/core';
import { OxTextInfo } from 'ox-types';
import { Typographies, TextComponent } from 'typography-ox';
import { ColorfulHeightsChallengeService } from 'src/app/shared/services/colorful-heights-challenge.service';
import { SubscriberOxDirective } from 'micro-lesson-components';
import anime from 'animejs';
import { timer } from 'rxjs';
import { BirdInfo, BirdsAux } from 'src/app/shared/models/types';


@Component({
  selector: 'app-bird-to-select',
  templateUrl: './bird-to-select.component.html',
  styleUrls: ['./bird-to-select.component.scss']
})


export class BirdToSelectComponent extends SubscriberOxDirective implements OnInit {
  @Input() counterOriginalText!:number;
  @Input('birdToSelect') birdToSelect!: BirdInfo | undefined;
  public correctCountertext= new OxTextInfo;
  public isAnswer:boolean = false;
  @ViewChild('counterText') counterText!: TextComponent;



  constructor(private challegeService:ColorfulHeightsChallengeService) {
     super()
    this.addSubscription(this.challegeService.startTime, x => {
       this.birdToSelectAnimationAppearence();     
    })

    this.addSubscription(this.challegeService.activateCounter, x => {
      this.correctCountertext.originalText = x + "";
      this.counterText.setOriginalText = this.correctCountertext.originalText;
    })
   }



  ngOnInit(): void {
    this.correctCountertext.color = "white";
    this.correctCountertext.fontSize = "4vh";
    this.correctCountertext.originalText = this.counterOriginalText + "";
    this.correctCountertext.font = "dinnMedium";
  }


birdToSelectAnimationAppearence() {
  anime({
    targets:'.container-bird-to-select',
    duration:1000,
    top:'5vh',
    easing: 'easeOutElastic(1, .8)',
    delay:1300
  })
}



}
