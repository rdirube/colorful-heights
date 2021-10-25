import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BirdsAux , BirdsAndWings} from 'src/app/shared/models/types';
import { ColorfulHeightsChallengeService } from 'src/app/shared/services/colorful-heights-challenge.service';


@Component({
  selector: 'app-hole',
  templateUrl: './hole.component.html',
  styleUrls: ['./hole.component.scss']
})
export class HoleComponent implements OnInit {

  @Output() loadedBirdSvgParent = new EventEmitter();
  @Input() bird!: BirdsAux;
  public isAnswer: boolean = true;
  @Input() svgBird!: string;
  
  constructor(private challengeService:ColorfulHeightsChallengeService) {
  }


  ngOnInit(): void {
  }


  loadedBirdSvgParentMethod() {
    this.loadedBirdSvgParent.emit()
  }

  
 

}
