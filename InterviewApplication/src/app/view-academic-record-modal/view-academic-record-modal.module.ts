import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViewAcademicRecordModalPageRoutingModule } from './view-academic-record-modal-routing.module';

import { ViewAcademicRecordModalPage } from './view-academic-record-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewAcademicRecordModalPageRoutingModule
  ],
  declarations: [ViewAcademicRecordModalPage]
})
export class ViewAcademicRecordModalPageModule {}
