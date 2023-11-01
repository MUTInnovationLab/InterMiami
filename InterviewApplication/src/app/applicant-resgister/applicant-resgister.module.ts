import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApplicantResgisterPageRoutingModule } from './applicant-resgister-routing.module';

import { ApplicantResgisterPage } from './applicant-resgister.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApplicantResgisterPageRoutingModule
  ],
  declarations: [ApplicantResgisterPage]
})
export class ApplicantResgisterPageModule {}
