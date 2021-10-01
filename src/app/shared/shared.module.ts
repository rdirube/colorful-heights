import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {NgoxPostMessageModule} from 'ngox-post-message';
import {FlexModule} from '@angular/flex-layout';
import {MicroLessonComponentsModule} from 'micro-lesson-components';
import {TypographyOxModule} from 'typography-ox';
// import {TranslocoModule} from '@ngneat/transloco';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgoxPostMessageModule,
    FlexModule,
    MicroLessonComponentsModule,
    TypographyOxModule,
    // TranslocoModule
  ],
  exports: [
    CommonModule,
    NgoxPostMessageModule,
    FlexModule,
    MicroLessonComponentsModule,
    TypographyOxModule,
    // TranslocoModule
  ],
})
export class SharedModule { }
