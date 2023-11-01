import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApplicantResgisterPage } from './applicant-resgister.page';

const routes: Routes = [
  {
    path: '',
    component: ApplicantResgisterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicantResgisterPageRoutingModule {}
