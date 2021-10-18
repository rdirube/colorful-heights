import { Component, OnInit , Input} from '@angular/core';

@Component({
  selector: 'app-hole',
  templateUrl: './hole.component.html',
  styleUrls: ['./hole.component.scss']
})
export class HoleComponent implements OnInit {


  @Input() bird!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
