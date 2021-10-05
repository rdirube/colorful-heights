import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-stick',
  templateUrl: './stick.component.html',
  styleUrls: ['./stick.component.scss']
})
export class StickComponent implements OnInit {

  @Input() stickSvg: string = '';

  constructor() {
  }

  ngOnInit(): void {
    this.stickSvg = 'colorful-heights/svg/Elementos fondo/' + this.stickSvg;
  }

}
