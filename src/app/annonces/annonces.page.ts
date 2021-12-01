import {Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Router} from '@angular/router';
import {interval, Observable} from 'rxjs';
import {takeWhile} from 'rxjs/operators';

@Component({
  selector: 'app-annonces',
  templateUrl: 'annonces.page.html',
  styleUrls: ['annonces.page.scss']
})
export class AnnoncesPage implements OnInit {
  // Attributs génériques
  aBiens = [];
  aBiensBackup = [];

  // Minuteur
  nbMilliSecondsDansSeconde = 1000;
  nbMinutesDansHeure = 60;
  nbSecondsDansMinute  = 60;
  dureeVieAnnonceMin = 5;

  // URL
  url = 'http://localhost:3000';

  constructor(public http: HttpClient, private sanitizer: DomSanitizer, private router: Router) {}

  ngOnInit() {
    this.getBiens();
  }

  getBiens() {
    this.readApi(this.url + '/bien')
      .subscribe((data) => {
        this.aBiens = Object.values(data)[0];
        // Traitement de l'image base64 pour la convertir en image visualisable sur le front
        this.aBiens.forEach(bien => {
          bien.photoB = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
            + bien.photoB);

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
                bien.compteurMinute = Math.floor((dateDifference) / (this.nbMilliSecondsDansSeconde * this.nbMinutesDansHeure) %
                  this.nbSecondsDansMinute);
              }
            });
        });
        this.aBiensBackup = Object.values(data)[0];
      });
  }

  readApi(url: string) {
    return this.http.get(url);
  }

  filterList(evt) {
    this.aBiens = this.aBiensBackup;
    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.aBiens = this.aBiensBackup.filter(currentBien => {
      if (currentBien.nomB && searchTerm) {
        return (currentBien.nomB.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
      }
    });
  }

  afficherDetail(idBien) {
    this.router.navigate(['bien-detail/' + idBien]);
  }

  /**
   * Met à jour la couleur du compteur en fonction du temps restant
   *
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
