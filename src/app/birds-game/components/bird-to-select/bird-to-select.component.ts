import {Component, OnInit, Input, ViewChild} from '@angular/core';
import { TextComponent} from 'typography-ox';
import {SubscriberOxDirective} from 'micro-lesson-components';
import anime from 'animejs';
import {BirdInfo} from 'src/app/shared/models/types';
import {BirdComponent} from '../bird/bird.component';

@Component({
  selector: 'app-bird-to-select',
  templateUrl: './bird-to-select.component.html',
  styleUrls: ['./bird-to-select.component.scss']
})

export class BirdToSelectComponent extends SubscriberOxDirective implements OnInit {

  @Input() counterOriginalText!: number;
  @Input('birdToSelect') birdToSelect!: BirdInfo | undefined;
  @ViewChild('counterText') counterText!: TextComponent;
  @ViewChild(BirdComponent) birdComponent!: BirdComponent;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  birdToSelectAnimationAppearence(): void {
    anime({
      targets: '.container-bird-to-select',
      duration: 1000,
      top: ['-40vh', '5vh'],
      easing: 'easeOutElastic(1, .8)',
      delay: 1300
    });
  }
  birdToSelectOut(): void {
    anime({
      targets: '.container-bird-to-select',
      duration: 0,
      top: '-40vh',
      easing: 'easeOutElastic(1, .8)',
      delay: 0
    });
  }

}
