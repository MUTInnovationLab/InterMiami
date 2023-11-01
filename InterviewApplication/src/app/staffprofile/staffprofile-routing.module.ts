import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StaffprofilePage } from './staffprofile.page';

const routes: Routes = [
  {
    path: '',
    component: StaffprofilePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StaffprofilePageRoutingModule {}
