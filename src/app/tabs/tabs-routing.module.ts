import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'annonces',
        loadChildren: () => import('../annonces/annonces.module').then(m => m.AnnoncesPageModule)
      },
      {
        path: 'vendre',
        loadChildren: () => import('../vendre/vendre.module').then(m => m.VendrePageModule)
      },
      {
        path: 'encheres',
        loadChildren: () => import('../encheres/encheres.module').then(m => m.EncheresPageModule)
      },
      {
        path: 'profil',
        loadChildren: () => import('../profil/profil.module').then(m => m.ProfilPageModule)
      },
      {
        path: '',
        redirectTo: '/navigation/annonces',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/navigation/annonces',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
