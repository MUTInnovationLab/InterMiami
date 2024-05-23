import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InterviewListPageRoutingModule } from './interview-list-routing.module';

import { InterviewListPage } from './interview-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InterviewListPageRoutingModule
  ],
  declarations: [InterviewListPage]
})
export class InterviewListPageModule {}
