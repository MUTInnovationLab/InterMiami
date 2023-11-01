import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InterviewHistoryPageRoutingModule } from './interview-history-routing.module';

import { InterviewHistoryPage } from './interview-history.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InterviewHistoryPageRoutingModule
  ],
  declarations: [InterviewHistoryPage]
})
export class InterviewHistoryPageModule {}
