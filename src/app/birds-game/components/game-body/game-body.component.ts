import {Component, HostListener, OnInit} from '@angular/core';

@Component({
  selector: 'app-game-body',
  templateUrl: './game-body.component.html',
  styleUrls: ['./game-body.component.scss']
})
export class GameBodyComponent implements OnInit {

  showCountDown: boolean | undefined;
  treeClass: string = 'tree-hide';
  baseClass: string = 'base-show';

  constructor() {
  }

  ngOnInit(): void {
  }

  startGame(): void {
    this.showCountDown = false;
    console.log(' Start game');
    // this.playSequence();
  }

  @HostListener('document:keydown', ['$event'])
  asdsad($event: KeyboardEvent) {
    console.log('keke ')
    if ($event.key === 't') {
      this.treeClass = 'tree-show';
      this.baseClass = 'base-hide';
    }
    if ($event.key === 'b') {
      this.treeClass = 'tree-hide';
      this.baseClass = 'base-show';
    }
  }
}
