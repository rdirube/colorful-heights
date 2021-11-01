import {Component, Input, OnInit} from '@angular/core';
import { BirdInfo, BirdsAux , Replaces} from 'src/app/shared/models/types';
import { SubscriberOxDirective } from 'micro-lesson-components';
import { ColorfulHeightsChallengeService } from 'src/app/shared/services/colorful-heights-challenge.service';
import anime from 'animejs'
import { timer } from 'rxjs';


@Component({
  selector: 'app-stick',
  templateUrl: './stick.component.html',
  styleUrls: ['./stick.component.scss']
})
export class StickComponent extends SubscriberOxDirective implements OnInit {

  @Input() stickSvg: string = '';
  @Input() bird!: BirdInfo
  public isAnswer:boolean = true;
  @Input() wings!:string;
  @Input() svgBird!: string;  
  @Input() pathWithReplaces!:Replaces;
   
  constructor(private challengeService:ColorfulHeightsChallengeService) {
    super();
  }


  ngOnInit(): void {
    this.stickSvg = 'colorful-heights/svg/Elementos fondo/' + this.stickSvg;
  }



}
