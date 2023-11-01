import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScheduleInterviewPage } from './schedule-interview.page';

const routes: Routes = [
  {
    path: '',
    component: ScheduleInterviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleInterviewPageRoutingModule {}
