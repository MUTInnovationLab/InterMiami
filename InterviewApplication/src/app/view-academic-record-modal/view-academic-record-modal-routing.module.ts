import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewAcademicRecordModalPage } from './view-academic-record-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ViewAcademicRecordModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewAcademicRecordModalPageRoutingModule {}
