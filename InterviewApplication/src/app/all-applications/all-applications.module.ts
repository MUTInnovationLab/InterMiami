import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllApplicationsPageRoutingModule } from './all-applications-routing.module';

import { AllApplicationsPage } from './all-applications.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllApplicationsPageRoutingModule
  ],
  declarations: [AllApplicationsPage]
})
export class AllApplicationsPageModule {}
