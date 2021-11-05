import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ButtonPosition, MagnifierPosition} from '../../../shared/models/types';
import {okButtonPosition} from '../../../shared/models/functions'

@Component({
  selector: 'app-magnifier-glass',
  templateUrl: './magnifier-glass.component.html',
  styleUrls: ['./magnifier-glass.component.scss']
})
export class MagnifierGlassComponent implements OnInit {
  public currentMagnifierPosition!: MagnifierPosition;
  public currentButtonPosition!: ButtonPosition | undefined;

  @Input('magnifierPosition')
  set setMagnifierPosition(mPos: MagnifierPosition) {
    this.currentMagnifierPosition = mPos;
    this.currentButtonPosition = this.currentMagnifierPosition.buttonInfo ?
    okButtonPosition(this.currentMagnifierPosition.buttonInfo, this.currentMagnifierPosition.width, this.currentMagnifierPosition.height)
      : undefined;
      console.log(okButtonPosition(this.currentMagnifierPosition.buttonInfo as any, this.currentMagnifierPosition.width, this.currentMagnifierPosition.height));
  }

  @Output() okButtonClicked = new EventEmitter();
  @Input() boxOn!: boolean;
  @Input() buttonOkActivate!:boolean;

  constructor(private element: ElementRef) {
    this.element.nativeElement.className = 'myAbsolute full-size';
    this.element.nativeElement.style.zIndex = '2';
  }

  ngOnInit(): void {
  }

  onClickOk(): void {
    this.okButtonClicked.emit();
  }


}
