import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import anime from 'animejs'
import {LoadedSvgComponent} from 'micro-lesson-components';
import { BirdsAux } from 'src/app/shared/models/types';
import { PreloaderOxService } from 'ox-core';

@Component({
  selector: 'app-bird',
  templateUrl: './bird.component.html',
  styleUrls: ['./bird.component.scss']
})
export class BirdComponent implements OnInit {

  @ViewChild(LoadedSvgComponent) loadedSvgComponent!: LoadedSvgComponent;
  @Input() bird!: BirdsAux;
  @Input() isAnswer!:boolean;
  @Input() i:number = 0;
  @Input() isDouble!:boolean;

  constructor(private elementRef: ElementRef, private preloaderService: PreloaderOxService) {
  }

  
  loadedSvgBirdEmitter() {
    this.loadedSvgComponent.init.emit(this.elementRef)
  }


  ngOnInit(): void {
  }

  

}

