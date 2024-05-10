import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssignInterviewerPage } from './assign-interviewer.page';

const routes: Routes = [
  {
    path: '',
    component: AssignInterviewerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssignInterviewerPageRoutingModule {}
