import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarksPage } from './marks.page';

const routes: Routes = [
  {
    path: '',
    component: MarksPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarksPageRoutingModule {}
