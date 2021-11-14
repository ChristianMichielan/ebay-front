import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VendrePage } from './vendre.page';

const routes: Routes = [
  {
    path: '',
    component: VendrePage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VendrePageRoutingModule {}
