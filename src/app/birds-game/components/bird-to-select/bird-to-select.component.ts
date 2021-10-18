import { Component, OnInit, Input , ViewChild} from '@angular/core';
import { OxTextInfo } from 'ox-types';
import { Typographies, TextComponent } from 'typography-ox';
import { ColorfulHeightsChallengeService } from 'src/app/shared/services/colorful-heights-challenge.service';
import { SubscriberOxDirective } from 'micro-lesson-components';

@Component({
  selector: 'app-bird-to-select',
  templateUrl: './bird-to-select.component.html',
  styleUrls: ['./bird-to-select.component.scss']
})
export class BirdToSelectComponent extends SubscriberOxDirective implements OnInit {

  @Input() counterOriginalText!:number;
  @Input('BirdToSelect') BirdToSelect!: string;
  public correctCountertext = new OxTextInfo;
  @ViewChild('counterText') counterText!: TextComponent;



  constructor(private challegeService:ColorfulHeightsChallengeService) {
     super()
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

}
