import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TrackApplicationsPage } from './track-applications.page';

const routes: Routes = [
  {
    path: '',
    component: TrackApplicationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrackApplicationsPageRoutingModule {}
