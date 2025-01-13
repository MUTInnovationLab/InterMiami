import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeApplyPageRoutingModule } from './home-apply-routing.module';

import { HomeApplyPage } from './home-apply.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeApplyPageRoutingModule
  ],
  declarations: [HomeApplyPage]
})
export class HomeApplyPageModule {}
