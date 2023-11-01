import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InterviewHistoryPage } from './interview-history.page';

const routes: Routes = [
  {
    path: '',
    component: InterviewHistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InterviewHistoryPageRoutingModule {}
