import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BirdInfo, BirdsAux , Replaces} from 'src/app/shared/models/types';
import { ColorfulHeightsChallengeService } from 'src/app/shared/services/colorful-heights-challenge.service';


@Component({
  selector: 'app-hole',
  templateUrl: './hole.component.html',
  styleUrls: ['./hole.component.scss']
})
export class HoleComponent implements OnInit {

  @Output() loadedBirdSvgParent = new EventEmitter();
  @Input() bird!: BirdInfo;
  public isAnswer: boolean = true;
  @Input () hintInput!:boolean;




  constructor(private challengeService:ColorfulHeightsChallengeService) {
  }


  ngOnInit(): void {
  }


  loadedBirdSvgParentMethod() {
    this.loadedBirdSvgParent.emit()
  }



  
 

}
