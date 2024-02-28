import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HrModalPage } from './hr-modal.page';

const routes: Routes = [
  {
    path: '',
    component: HrModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HrModalPageRoutingModule {}
