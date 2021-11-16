import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EncheresPage } from './encheres.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { EncheresPageRoutingModule } from './encheres-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    RouterModule.forChild([{ path: '', component: EncheresPage }]),
    EncheresPageRoutingModule,
  ],
  declarations: [EncheresPage]
})
export class EncheresPageModule {}
