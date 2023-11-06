import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreatepostPageRoutingModule } from './createpost-routing.module';

import { CreatepostPage } from './createpost.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreatepostPageRoutingModule
  ],
  declarations: [CreatepostPage]
})
export class CreatepostPageModule {}
