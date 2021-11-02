import {Component, Input, OnInit} from '@angular/core';
import {BirdInfo} from '../../../shared/models/types';

@Component({
  selector: 'app-nest-group',
  templateUrl: './nest-group.component.html',
  styleUrls: ['./nest-group.component.scss']
})
export class NestGroupComponent implements OnInit {

  @Input() nestGroupInfo: (BirdInfo | undefined)[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
