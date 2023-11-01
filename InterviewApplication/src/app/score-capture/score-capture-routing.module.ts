import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScoreCapturePage } from './score-capture.page';

const routes: Routes = [
  {
    path: '',
    component: ScoreCapturePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScoreCapturePageRoutingModule {}
