import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnnoncesPage } from './annonces.page';

const routes: Routes = [
  {
    path: '',
    component: AnnoncesPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnnoncesPageRoutingModule {}
