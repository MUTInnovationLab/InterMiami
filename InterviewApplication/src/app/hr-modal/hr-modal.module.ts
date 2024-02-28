import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HrModalPageRoutingModule } from './hr-modal-routing.module';

import { HrModalPage } from './hr-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HrModalPageRoutingModule
  ],
  declarations: [HrModalPage]
})
export class HrModalPageModule {}
