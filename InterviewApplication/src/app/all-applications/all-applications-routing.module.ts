import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AllApplicationsPage } from './all-applications.page';

const routes: Routes = [
  {
    path: '',
    component: AllApplicationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AllApplicationsPageRoutingModule {}
