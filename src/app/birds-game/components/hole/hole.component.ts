import { Component, OnInit , Input, Output, EventEmitter} from '@angular/core';
import { BirdsAux } from 'src/app/shared/models/types';



@Component({
  selector: 'app-hole',
  templateUrl: './hole.component.html',
  styleUrls: ['./hole.component.scss']
})
export class HoleComponent implements OnInit {

  @Output() loadedBirdSvgParent = new EventEmitter();
  @Input() bird!: BirdsAux;
  public isAnswer:boolean = true;
  
  constructor() { }

  ngOnInit(): void {
  }

   loadedBirdSvgParentMethod() {
     this.loadedBirdSvgParent.emit("hola")
   }

}
