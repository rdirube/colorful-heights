import {AfterViewInit, Component, OnInit} from '@angular/core';
import {BaseBodyDirective} from '../../directives/base-body.directive';
import {BirdInfo} from '../../../shared/models/types';
import {OxTextInfo} from 'ox-types';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss']
})
export class TutorialComponent extends BaseBodyDirective implements OnInit, AfterViewInit {

  targetBird: BirdInfo = {
    color: 'azul',
    type: 'lechuza'
  };
  optionsBirds: BirdInfo[] = [
    {
      color: 'azul',
      type: 'pelado'
    }, {
      color: 'rojo',
      type: 'cóndor'
    }, {
      color: 'amarillo',
      type: 'cotorra'
    },
  ];
  public gnomesTutorialText = new OxTextInfo();

  constructor() {
    super();
    this.replaceBirds3and4(this.optionsBirds);
    this.treeClass = 'tree-show no-transition';
    this.baseClass = 'base-hide no-transition';
  }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.birdsUpAnimation(400);
    this.birdToSelectComponent.birdToSelectAnimationAppearence();
  }
}
