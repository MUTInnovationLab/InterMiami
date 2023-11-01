import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApplicantLoginPageRoutingModule } from './applicant-login-routing.module';

import { ApplicantLoginPage } from './applicant-login.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApplicantLoginPageRoutingModule
  ],
  declarations: [ApplicantLoginPage]
})
export class ApplicantLoginPageModule {}
