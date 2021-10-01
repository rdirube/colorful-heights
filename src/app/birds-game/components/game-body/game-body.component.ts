import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-game-body',
  templateUrl: './game-body.component.html',
  styleUrls: ['./game-body.component.scss']
})
export class GameBodyComponent implements OnInit {

  showCountDown: boolean | undefined;

  constructor() {
  }

  ngOnInit(): void {
  }

  startGame(): void {
    this.showCountDown = false;
    console.log(' Start game');
    // this.playSequence();
  }
}
