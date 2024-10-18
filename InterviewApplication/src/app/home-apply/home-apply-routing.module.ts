import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeApplyPage } from './home-apply.page';

const routes: Routes = [
  {
    path: '',
    component: HomeApplyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeApplyPageRoutingModule {}
