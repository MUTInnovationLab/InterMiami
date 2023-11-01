import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScheduleInterviewPageRoutingModule } from './schedule-interview-routing.module';

import { ScheduleInterviewPage } from './schedule-interview.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScheduleInterviewPageRoutingModule
  ],
  declarations: [ScheduleInterviewPage]
})
export class ScheduleInterviewPageModule {}
