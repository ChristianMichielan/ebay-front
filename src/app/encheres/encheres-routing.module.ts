import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EncheresPage } from './encheres.page';

const routes: Routes = [
  {
    path: '',
    component: EncheresPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EncheresPageRoutingModule {}
