import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssignInterviewerPageRoutingModule } from './assign-interviewer-routing.module';

import { AssignInterviewerPage } from './assign-interviewer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssignInterviewerPageRoutingModule
  ],
  declarations: [AssignInterviewerPage]
})
export class AssignInterviewerPageModule {}
