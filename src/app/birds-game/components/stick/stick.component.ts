import {Component, Input, OnInit} from '@angular/core';
import { BirdInfo, BirdsAux , Replaces} from 'src/app/shared/models/types';
import { SubscriberOxDirective } from 'micro-lesson-components';
import { ColorfulHeightsChallengeService } from 'src/app/shared/services/colorful-heights-challenge.service';
import anime from 'animejs'
import { timer } from 'rxjs';
import {NestDirective} from '../../directives/nest.directive';
import {TutorialService} from '../../services/tutorial.service';


@Component({
  selector: 'app-stick',
  templateUrl: './stick.component.html',
  styleUrls: ['./stick.component.scss']
})
export class StickComponent extends NestDirective implements OnInit {

  @Input() stickSvg: string = '';

  constructor(tutorialService: TutorialService) {
    super(tutorialService);
  }

  ngOnInit(): void {
    this.stickSvg = 'colorful-heights/svg/Elementos fondo/' + this.stickSvg;
  }
}
