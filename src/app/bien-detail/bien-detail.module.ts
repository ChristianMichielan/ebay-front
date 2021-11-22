import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BienDetailPageRoutingModule } from './bien-detail-routing.module';

import { BienDetailPage } from './bien-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BienDetailPageRoutingModule
  ],
  declarations: [BienDetailPage]
})
export class BienDetailPageModule {}
