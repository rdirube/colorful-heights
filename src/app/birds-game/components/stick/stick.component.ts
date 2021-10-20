import {Component, Input, OnInit} from '@angular/core';
import { BirdsAux } from 'src/app/shared/models/types';

@Component({
  selector: 'app-stick',
  templateUrl: './stick.component.html',
  styleUrls: ['./stick.component.scss']
})
export class StickComponent implements OnInit {

  @Input() stickSvg: string = '';
  @Input() bird!: BirdsAux;
  public isAnswer:boolean = true;
  


  constructor() {
  }

  ngOnInit(): void {
    this.stickSvg = 'colorful-heights/svg/Elementos fondo/' + this.stickSvg;
  }

}
