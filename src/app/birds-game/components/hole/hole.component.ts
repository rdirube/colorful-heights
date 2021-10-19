import { Component, OnInit , Input} from '@angular/core';
import { BirdsAux } from 'src/app/shared/models/types';

@Component({
  selector: 'app-hole',
  templateUrl: './hole.component.html',
  styleUrls: ['./hole.component.scss']
})
export class HoleComponent implements OnInit {


  @Input() bird!: BirdsAux;
  public isAnswer:boolean = true;
  
  constructor() { }

  ngOnInit(): void {
  }

}
