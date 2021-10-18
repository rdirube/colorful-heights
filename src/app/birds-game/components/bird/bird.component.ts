import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import anime from 'animejs'
import {LoadedSvgComponent} from 'micro-lesson-components';

@Component({
  selector: 'app-bird',
  templateUrl: './bird.component.html',
  styleUrls: ['./bird.component.scss']
})
export class BirdComponent implements OnInit {

  @ViewChild(LoadedSvgComponent) loadedSvgComponet!: LoadedSvgComponent;
  @Input() bird!: string;


  constructor(private elementRef: ElementRef) {
  }

  ngOnInit(): void {
    console.log(this.bird);
  }



}

