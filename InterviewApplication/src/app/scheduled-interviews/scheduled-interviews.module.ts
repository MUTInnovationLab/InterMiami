import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScheduledInterviewsPageRoutingModule } from './scheduled-interviews-routing.module';

import { ScheduledInterviewsPage } from './scheduled-interviews.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScheduledInterviewsPageRoutingModule
  ],
  declarations: [ScheduledInterviewsPage]
})
export class ScheduledInterviewsPageModule {}
