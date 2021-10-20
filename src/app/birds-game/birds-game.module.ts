import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameBodyComponent } from './components/game-body/game-body.component';
import {SharedModule} from '../shared/shared.module';
import { BirdComponent } from './components/bird/bird.component';
import { StickComponent } from './components/stick/stick.component';
import { HoleComponent } from './components/hole/hole.component';
import { ClockComponent } from './components/clock/clock.component';
import { BirdToSelectComponent } from './components/bird-to-select/bird-to-select.component';



@NgModule({
  declarations: [
    GameBodyComponent,
    BirdComponent,
    StickComponent,
    HoleComponent,
    ClockComponent,
    BirdToSelectComponent
  ],
  exports: [
    GameBodyComponent,
    ClockComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ], providers:[
    StickComponent
  ]
})
export class BirdsGameModule { }
