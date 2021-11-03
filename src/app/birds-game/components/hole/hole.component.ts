import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BirdInfo, BirdsAux , Replaces} from 'src/app/shared/models/types';
import { ColorfulHeightsChallengeService } from 'src/app/shared/services/colorful-heights-challenge.service';
import {NestDirective} from '../../directives/nest.directive';
import {TutorialService} from '../../services/tutorial.service';


@Component({
  selector: 'app-hole',
  templateUrl: './hole.component.html',
  styleUrls: ['./hole.component.scss']
})
export class HoleComponent extends NestDirective implements OnInit {

  constructor(tutorialService: TutorialService) {
    super(tutorialService);
  }

  ngOnInit(): void {
  }

}
