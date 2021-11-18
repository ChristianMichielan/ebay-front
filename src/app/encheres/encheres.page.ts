import { Component } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-encheres',
  templateUrl: 'encheres.page.html',
  styleUrls: ['encheres.page.scss']
})
export class EncheresPage {

  bienUtilisateur = null;
  segmentModel = 'en_cours';
  segmentEnum = {
    EN_COURS: 'en_cours',
    VENDRE: 'vendre',
    LIVRER: 'livrer',
  };
  url = 'http://localhost:3000';
  etatBiensEnum = {
    EN_COURS: 'en_cours',
    VENDU: 'vendu',
    LIVRE: 'livre',
    NON_VENDU: 'non_vendu',
  };
  idUtilisateur = null;

  /**
   * Constructeur de la page
   */
  constructor(public http: HttpClient, private sanitizer: DomSanitizer) {}

  /**
   * A l'initialisation de la page on charge les biens pour lesquelles l'utilisateur a une enchère en cours
   */
  ngOnInit() {
    this.segmentModel = 'en_cours';
    this.idUtilisateur = localStorage.getItem('idU');
    this.viderTableau();
    this.getBiensEnCours();
  }

  /**
   * A la fermeture de la page on remet à zéro le tableau
   */
  ngOnDestroy() {
    this.viderTableau();
    this.bienUtilisateur = null;
  }

  /**
   * Evenement lors du changement d'onglet dans le segment
   * Charge les annonces qui correspond au segment
   * @param event
   */
  segmentChanged(event: any) {
    switch (this.segmentModel) {
      case 'livrer':
        console.log('Le segment a changé : ' + this.segmentModel);
        this.viderTableau();
        this.getBiensLivraisons();
        break;
      case 'vendre':
        console.log('Le segment a changé : ' + this.segmentModel);
        this.viderTableau();
        this.getBiensVendus();
        break;
      default:
        console.log('Le segment a changé (default) : ' + this.segmentModel);
        this.viderTableau();
        this.getBiensEnCours();
        break;
    }
  }

  /**
   * Récupère les biens vendus et proposé par l'utilisateur de l'utilisateur
   * @private
   */
  private getBiensVendus() {
    this.readApi(this.url + '/utilisateur/' + this.idUtilisateur + '/bien/avendre')
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
   * Récupère les biens sur lesquelles l'utilisateur a réalisé une enchère la plus haute pour un bien.
   * @private
   */
  private getBiensEnCours() {
    this.readApi(this.url + '/utilisateur/' + this.idUtilisateur + '/bien/encours')
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
   * Retourne les livraisons d'un utilisateur (biens achetés et biens reçu).
   * @private
   */
  private getBiensLivraisons() {
    this.readApi(this.url + '/utilisateur/' + this.idUtilisateur + '/bien/livraisons')
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
    if(this.bienUtilisateur !== null) {
      this.bienUtilisateur.splice(0, this.bienUtilisateur.length);
    }
  }

  /**
   * Formate l'affichage des biens vendus de l'utilisateur
   * @param etat
   * @private
   */
  private formaterEtatAffaireAVendre(etat) {
    switch (etat) {
      case this.etatBiensEnum.EN_COURS:
        return 'Vente en cours';
        break;
      case this.etatBiensEnum.VENDU:
        return 'Saisir livraison';
        break;
      case this.etatBiensEnum.LIVRE:
        return 'Livré';
        break;
      case this.etatBiensEnum.NON_VENDU:
        return 'Non vendu';
        break;
      default:
        console.log('Erreur : etat du bien inconnu.');
        break;
    }
  }

  /**
   * Affiche un message personnalisé à l'utilsiateur en fonction de la section dans laquelle il se trouve
   * @private
   */
  private messageAucunBien() {
    switch (this.segmentModel) {
      case this.segmentEnum.EN_COURS:
        return 'Aucune enchère en cours';
        break;
      case this.segmentEnum.LIVRER:
        return 'Aucune livraison passée ou à venir';
        break;
      case this.segmentEnum.VENDRE:
        return 'Aucun bien à vendre';
        break;
      default:
        console.log('erreur sur le segment');
        break;
    }
  }



}
