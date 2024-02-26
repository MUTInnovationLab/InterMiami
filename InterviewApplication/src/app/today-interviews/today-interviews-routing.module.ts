import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TodayInterviewsPage } from './today-interviews.page';

const routes: Routes = [
  {
    path: '',
    component: TodayInterviewsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TodayInterviewsPageRoutingModule {}
