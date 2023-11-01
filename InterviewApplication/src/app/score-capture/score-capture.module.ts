import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScoreCapturePageRoutingModule } from './score-capture-routing.module';

import { ScoreCapturePage } from './score-capture.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScoreCapturePageRoutingModule
  ],
  declarations: [ScoreCapturePage]
})
export class ScoreCapturePageModule {}
