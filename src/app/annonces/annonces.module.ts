import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnnoncesPage } from './annonces.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { AnnoncesPageRoutingModule } from './annonces-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    AnnoncesPageRoutingModule
  ],
  declarations: [AnnoncesPage]
})
export class AnnoncesPageModule {}
