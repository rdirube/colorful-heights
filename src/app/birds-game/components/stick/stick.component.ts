import {Component, Input, OnInit} from '@angular/core';
import { BirdsAux , BirdsAndWings} from 'src/app/shared/models/types';
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
  @Input() bird!: BirdsAux;
  public isAnswer:boolean = true;
  @Input() wings!:string;
  @Input() svgBird!: string;  

  constructor(private challengeService:ColorfulHeightsChallengeService) {
    super();
  }
  

  ngOnInit(): void {
    this.stickSvg = 'colorful-heights/svg/Elementos fondo/' + this.stickSvg;
  }



}
