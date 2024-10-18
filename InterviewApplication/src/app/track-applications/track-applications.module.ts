import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrackApplicationsPageRoutingModule } from './track-applications-routing.module';

import { TrackApplicationsPage } from './track-applications.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrackApplicationsPageRoutingModule
  ],
  declarations: [TrackApplicationsPage]
})
export class TrackApplicationsPageModule {}
