import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllApplicantsPage } from './all-applicants.page';

const routes: Routes = [
  {
    path: '',
    component: AllApplicantsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllApplicantsPageRoutingModule {}
