import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeclineModalPage } from './decline-modal.page';

const routes: Routes = [
  {
    path: '',
    component: DeclineModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeclineModalPageRoutingModule {}
