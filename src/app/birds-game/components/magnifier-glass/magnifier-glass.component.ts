import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {MagnifierPosition} from '../../../shared/models/types';

@Component({
  selector: 'app-magnifier-glass',
  templateUrl: './magnifier-glass.component.html',
  styleUrls: ['./magnifier-glass.component.scss']
})
export class MagnifierGlassComponent implements OnInit {

  @Input() magnifierPosition!: MagnifierPosition;
  boxOn = true;

  constructor(private element: ElementRef) {
    this.element.nativeElement.className = 'myAbsolute full-size';
    this.element.nativeElement.style.zIndex = '2';
  }

  ngOnInit(): void {
  }




}
