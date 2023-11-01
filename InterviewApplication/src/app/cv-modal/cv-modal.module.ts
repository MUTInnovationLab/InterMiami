import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CvModalPageRoutingModule } from './cv-modal-routing.module';

import { CvModalPage } from './cv-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CvModalPageRoutingModule
  ],
  declarations: [CvModalPage]
})
export class CvModalPageModule {}
