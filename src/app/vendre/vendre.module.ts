import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VendrePage } from './vendre.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { VendrePageRoutingModule } from './vendre-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    VendrePageRoutingModule
  ],
  declarations: [VendrePage]
})
export class VendrePageModule {}
