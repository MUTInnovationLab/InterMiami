import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ValidateDocsPage } from './validate-docs.page';

const routes: Routes = [
  {
    path: '',
    component: ValidateDocsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidateDocsPageRoutingModule {}
