import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-encheres',
  templateUrl: 'encheres.page.html',
  styleUrls: ['encheres.page.scss']
})
export class EncheresPage {

  bienUtilisateur = [];
  segmentModel = 'en_cours';
  url = 'http://localhost:3000';

  /**
   * Constructeur de la page
   */
  constructor(public http: HttpClient, private sanitizer: DomSanitizer) {}

  /**
   * A l'initialisation de la page on charge les biens pour lesquelles l'utilisateur a une enchère en cours
   */
  ngOnInit() {
    // Remplir le tableau des biens avec les données qui correspondent aux enchères en cours
  }

  /**
   * Evenement lors du changement d'onglet dans le segment
   * Charge les annonces qui correspond au segment
   * @param event
   */
  segmentChanged(event: any) {
    switch (this.segmentModel) {
      case 'livre':
        console.log('Le segment a changé : ' + this.segmentModel);
        this.viderTableau();
        // Appeler API
        break;
      case 'vendre':
        console.log('Le segment a changé : ' + this.segmentModel);
        this.viderTableau();
        this.getBiensVendus();
        console.log('les bien' + this.bienUtilisateur);
        console.log('couocu');
        break;
      default:
        console.log('Le segment a changé (default) : ' + this.segmentModel);
        this.viderTableau();
        // Appeler API
        break;
    }
  }


  /**
   * Récupère les biens vendus de l'utilisateur
   */
  private getBiensVendus() {
    this.readApi(this.url + '/utilisateur/' + 2 + '/bien')
      .subscribe((data) => {
        console.log(Object.values(data)[0]);
        this.bienUtilisateur = Object.values(data)[0];
        // Traitement de l'image base64 pour la convertir en image visualisable sur le front
        this.bienUtilisateur.forEach(bien => {
          bien.photoB = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + bien.photoB);
        });
      });
  }

  /**
   * Execute la requête API
   * @param url
   */
  readApi(url: string) {
    return this.http.get(url);
  }


  /**
   * Vide le tableau des biens de l'utilsateur
   * @private
   */
  private viderTableau() {
    this.bienUtilisateur.splice(0, this.bienUtilisateur.length);
  }

}
