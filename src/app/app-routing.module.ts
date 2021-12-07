import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./connexion/connexion.module').then(m => m.ConnexionPageModule)
  },
  {
    path: 'connexion',
    loadChildren: () => import('./connexion/connexion.module').then( m => m.ConnexionPageModule)
  },
  {
    path: 'navigation',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
  },
  {
    path: 'inscription',
    loadChildren: () => import('./inscription/inscription.module').then( m => m.InscriptionPageModule)
  },
  {
    path: 'profil',
    loadChildren: () => import('./profil/profil.module').then( m => m.ProfilPageModule)
  },
  {
    path: 'profil/:idU',
    loadChildren: () => import('./profil/profil.module').then( m => m.ProfilPageModule)
  },

  {
    path: 'bien-detail',
    loadChildren: () => import('./bien-detail/bien-detail.module').then( m => m.BienDetailPageModule)
  },
  {
    path: 'bien-detail/:idB',
    loadChildren: () => import('./bien-detail/bien-detail.module').then( m => m.BienDetailPageModule)
  },
  {
    path: 'livraison',
    loadChildren: () => import('./livraison/livraison.module').then( m => m.LivraisonPageModule)
  },
  {
    path: 'livraison/:idB',
    loadChildren: () => import('./livraison/livraison.module').then( m => m.LivraisonPageModule)
  }


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
