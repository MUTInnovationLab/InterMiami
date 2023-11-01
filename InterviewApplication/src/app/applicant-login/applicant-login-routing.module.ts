import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApplicantLoginPage } from './applicant-login.page';

const routes: Routes = [
  {
    path: '',
    component: ApplicantLoginPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicantLoginPageRoutingModule {}
