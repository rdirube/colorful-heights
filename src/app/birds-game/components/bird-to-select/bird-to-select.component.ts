import {Component, OnInit, Input, ViewChild} from '@angular/core';
import { TextComponent} from 'typography-ox';
import {SubscriberOxDirective} from 'micro-lesson-components';
import anime from 'animejs';
import {BirdInfo} from 'src/app/shared/models/types';

@Component({
  selector: 'app-bird-to-select',
  templateUrl: './bird-to-select.component.html',
  styleUrls: ['./bird-to-select.component.scss']
})

export class BirdToSelectComponent extends SubscriberOxDirective implements OnInit {

  @Input() counterOriginalText!: number;
  @Input('birdToSelect') birdToSelect!: BirdInfo | undefined;
  public isAnswer: boolean = false;
  @ViewChild('counterText') counterText!: TextComponent;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  birdToSelectAnimationAppearence(): void {
    anime({
      targets: '.container-bird-to-select',
      duration: 1000,
      top: '5vh',
      easing: 'easeOutElastic(1, .8)',
      delay: 1300
    });
  }

}
