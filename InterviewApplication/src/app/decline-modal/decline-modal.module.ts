import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeclineModalPageRoutingModule } from './decline-modal-routing.module';

import { DeclineModalPage } from './decline-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeclineModalPageRoutingModule
  ],
  declarations: [DeclineModalPage]
})
export class DeclineModalPageModule {}
