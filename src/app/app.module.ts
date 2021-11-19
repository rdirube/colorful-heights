import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {HttpClientModule} from '@angular/common/http';
import {SharedModule} from './shared/shared.module';
import { TranslocoRootModule } from './transloco-root.module';
import {BirdsGameModule} from './birds-game/birds-game.module';
import {ChallengeService, ScoreStarsService} from 'micro-lesson-core';
import {ColorfulHeightsChallengeService} from './shared/services/colorful-heights-challenge.service';
import {ColorfulHeightsScoreService} from './shared/services/colorful-heights-score.service';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FlexLayoutModule,
    BirdsGameModule,
    BrowserAnimationsModule,
    SharedModule,
    TranslocoRootModule
  ],
  providers: [
    {
      provide: ChallengeService,
      useExisting: ColorfulHeightsChallengeService
    },

    {
      provide: ScoreStarsService,
      useExisting: ColorfulHeightsScoreService
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
