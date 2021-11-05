import {Component, Input, OnInit, ViewChildren} from '@angular/core';
import {BirdInfo} from '../../../shared/models/types';
import {NestDirective} from '../../directives/nest.directive';

@Component({
  selector: 'app-nest-group',
  templateUrl: './nest-group.component.html',
  styleUrls: ['./nest-group.component.scss']
})
export class NestGroupComponent implements OnInit {

  @ViewChildren(NestDirective) nests: any;
  @Input() nestGroupInfo: (BirdInfo | undefined)[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

}
