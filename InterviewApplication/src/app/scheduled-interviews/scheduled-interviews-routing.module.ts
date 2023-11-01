import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScheduledInterviewsPage } from './scheduled-interviews.page';

const routes: Routes = [
  {
    path: '',
    component: ScheduledInterviewsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduledInterviewsPageRoutingModule {}
