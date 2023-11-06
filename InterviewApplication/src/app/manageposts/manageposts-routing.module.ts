import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagepostsPage } from './manageposts.page';

const routes: Routes = [
  {
    path: '',
    component: ManagepostsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagepostsPageRoutingModule {}
