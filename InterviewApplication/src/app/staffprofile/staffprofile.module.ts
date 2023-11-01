import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StaffprofilePageRoutingModule } from './staffprofile-routing.module';

import { StaffprofilePage } from './staffprofile.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StaffprofilePageRoutingModule
  ],
  declarations: [StaffprofilePage]
})
export class StaffprofilePageModule {}
