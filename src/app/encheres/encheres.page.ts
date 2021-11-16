import { Component } from '@angular/core';

@Component({
  selector: 'app-encheres',
  templateUrl: 'encheres.page.html',
  styleUrls: ['encheres.page.scss']
})
export class EncheresPage {

  bienUtilisateur = [];
  segmentModel = 'en_cours';

  /**
   * Constructeur de la page
   */
  constructor() {}

  /**
   * A l'initialisation de la page
   */
  ngOnInit() {

  }

  /**
   * Evenement lors du changement d'onglet dans le segment
   * Charge les annonces qui correspond au segment
   * @param event
   */
  segmentChanged(event: any) {
    switch (this.segmentModel) {
      case 'en_cours':
        console.log('Le segment a changé : ' + this.segmentModel);
        break;
      case 'livre':
        console.log('Le segment a changé : ' + this.segmentModel);
        break;
      case 'vendu':
        console.log('Le segment a changé : ' + this.segmentModel);
        break;
      default:
        console.log('Le segment a changé : ' + this.segmentModel);
        break;
    }
  }


}
