import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllApplicantsPageRoutingModule } from './all-applicants-routing.module';

import { AllApplicantsPage } from './all-applicants.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AllApplicantsPageRoutingModule
  ],
  declarations: [AllApplicantsPage]
})
export class AllApplicantsPageModule {}
