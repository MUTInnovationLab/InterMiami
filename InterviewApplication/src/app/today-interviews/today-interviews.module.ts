import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TodayInterviewsPageRoutingModule } from './today-interviews-routing.module';

import { TodayInterviewsPage } from './today-interviews.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TodayInterviewsPageRoutingModule
  ],
  declarations: [TodayInterviewsPage]
})
export class TodayInterviewsPageModule {}
