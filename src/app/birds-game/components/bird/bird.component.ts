import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import anime from 'animejs'
import {LoadedSvgComponent} from 'micro-lesson-components';
import { BirdsAux } from 'src/app/shared/models/types';

@Component({
  selector: 'app-bird',
  templateUrl: './bird.component.html',
  styleUrls: ['./bird.component.scss']
})
export class BirdComponent implements OnInit {

  @ViewChild(LoadedSvgComponent) loadedSvgComponet!: LoadedSvgComponent;
  @Input() bird!: BirdsAux;
  @Input() isAnswer!:boolean;
  @Input() i:number = 0;

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit(): void {
  }



}

