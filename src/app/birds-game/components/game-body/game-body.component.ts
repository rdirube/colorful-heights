import {Component, HostListener, OnInit} from '@angular/core';
import anime from 'animejs';
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
    if ($event.key === 't') {
      this.treeClass = 'tree-show';
      this.baseClass = 'base-hide';
    }
    if ($event.key === 'b') {
      this.treeClass = 'tree-hide';
      this.baseClass = 'base-show';
    }
    if ($event.key === 'p') {
      anime({
        targets: '.birdImage',
        translateY: '100%',
        easing: 'linear',
        duration: 250,
      });
    }
    if ($event.key === 'o') {
      anime({
        targets: '.birdImage',
        translateY: ['65%', '0'],
        duration: 750,
        easing: 'easeInOutElastic'
      });
    }
  }
}
