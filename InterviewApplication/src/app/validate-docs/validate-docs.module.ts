import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ValidateDocsPageRoutingModule } from './validate-docs-routing.module';

import { ValidateDocsPage } from './validate-docs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ValidateDocsPageRoutingModule
  ],
  declarations: [ValidateDocsPage]
})
export class ValidateDocsPageModule {}
