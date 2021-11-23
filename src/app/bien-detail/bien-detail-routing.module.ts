import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BienDetailPage } from './bien-detail.page';

const routes: Routes = [
  {
    path: '',
    component: BienDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BienDetailPageRoutingModule {}
