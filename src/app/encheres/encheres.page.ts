import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DomSanitizer} from "@angular/platform-browser";
import {interval, Observable} from 'rxjs';
import {takeWhile} from "rxjs/operators";


@Component({
  selector: 'app-encheres',
  templateUrl: 'encheres.page.html',
  styleUrls: ['encheres.page.scss']
})
export class EncheresPage implements OnInit, OnDestroy{

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
  nbMilliSecondsDansSeconde = 1000;
  nbMinutesDansHeure = 60;
  nbSecondsDansMinute  = 60;
  dureeVieAnnonceMin = 5;

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
        this.bienUtilisateur = Object.values(data)[0];
        // Traitement de l'image base64 pour la convertir en image visualisable sur le front
        this.bienUtilisateur.forEach(bien => {
          bien.photoB = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + bien.photoB);

          // Configuration du compteur
          bien.compteurMinute = new Observable();
          bien.compteurSeconde = new Observable();
          bien.compteurMinute = 5;
          bien.compteurSeconde = 0;

          // indicateur qui indique si la vente est terminé
          let terminee = false;

          // Transforme la date de publication du bien en un objet date
          const datePublication = new Date(bien.dateCreationB);

          // Ajoute 5 min à la date de publication (durée de vie de l'annonce)
          datePublication.setMinutes(datePublication.getMinutes() + this.dureeVieAnnonceMin);

          // Actualise la valeur toutes les secondes tant que la vente n'est pas terminée
          interval(1000)
            .pipe(takeWhile(() => !terminee))
            .subscribe(x => {
              if (bien.compteurSeconde === 0 && bien.compteurMinute === 0) {
                terminee = true;
              } else {
                // Calcul la différence
                const dateDifference = datePublication.getTime() - new  Date().getTime();
                bien.compteurSeconde = Math.floor((dateDifference) / (this.nbMilliSecondsDansSeconde) % this.nbSecondsDansMinute);
                bien.compteurMinute = Math.floor((dateDifference) / (this.nbMilliSecondsDansSeconde * this.nbMinutesDansHeure) % this.nbSecondsDansMinute);
              }
            });
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
   * Rafraichit l'écran à l'aide du refresher
   * @param event
   */
  doRefresh(event) {
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

    // Fin de l'animation de chargement
    event.target.complete();
  }

  /**
   * Vide le tableau des biens de l'utilsateur
   * @private
   */
  private viderTableau() {
    if(this.bienUtilisateur !== null) {
      this.bienUtilisateur = null;
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
      case this.etatBiensEnum.VENDU:
        return 'Saisir livraison';
      case this.etatBiensEnum.LIVRE:
        return 'Livré';
      case this.etatBiensEnum.NON_VENDU:
        return 'Non vendu';
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
      case this.segmentEnum.LIVRER:
        return 'Aucune livraison passée ou à venir';
      case this.segmentEnum.VENDRE:
        return 'Aucun bien à vendre';
      default:
        console.log('erreur sur le segment');
        break;
    }
  }

  /**
   * Affiche une icon personnalisé à l'utilisateur en fonction de la section dans laquelle il se trouve
   * @private
   */
  private messageAucunBienIcon() {
      switch (this.segmentModel) {
        case this.segmentEnum.EN_COURS:
          return 'basket';
        case this.segmentEnum.LIVRER:
          return 'mail-open';
        case this.segmentEnum.VENDRE:
          return 'cash';
        default:
          console.log('erreur sur le segment');
          break;
      }
  }

  /**
   * Met à jour la couleur du compteur en fonction du temps restant
   * @private
   */
  private couleurCompteur(minute) {
    if(minute > 3) {
      return 'green';
    }

    if (minute <= 3 && minute >= 1) {
      return 'orange';
    }

    if(minute < 1) {
      return 'red';
    }

    // Default
    return 'black';
  }

}
