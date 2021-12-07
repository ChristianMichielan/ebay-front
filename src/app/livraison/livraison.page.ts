import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-livraison',
  templateUrl: './livraison.page.html',
  styleUrls: ['./livraison.page.scss'],
})
export class LivraisonPage implements OnInit {
  // Attributs biens
  idB;
  aBiens;
  nomB;
  descriptionB;
  prixEnchereCourante;
  prixPlancherB;
  photoB;
  etatB;
  idEncherisseur;

  // Attributs utilisateur
  aUtilisateurs;
  nomU;
  prenomU;
  adresseU;

  // Attributs model
  dateL;

  // URL
  url = 'http://localhost:3000';

  constructor(public http: HttpClient, private sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.obtenirDetailBienPretLivraison();
  }

  readApi(url: string) {
    return this.http.get(url);
  }

  /* Permet d'obtenir toutes les informations d'un bien spécifique pret pour une livraison */
  obtenirDetailBienPretLivraison() {
    this.idB = this.activatedRoute.snapshot.paramMap.get('idB');
    this.readApi(this.url + '/bien/' + this.idB)
      .subscribe((data) => {
        this.aBiens = Object.values(data);
        this.nomB = this.aBiens[0][0].nomB;
        this.descriptionB = this.aBiens[0][0].descriptionB;
        this.prixEnchereCourante = this.aBiens[0][0].prixEnchereCourante;
        this.prixPlancherB = this.aBiens[0][0].prixPlancherB;
        this.idEncherisseur = this.aBiens[0][0].idDernierEncherisseur;
        this.etatB = this.aBiens[0][0].etatB;
        // Traitement de l'image base64 pour la convertir en image visualisable sur le front
        this.aBiens[0].forEach(bien => {
          this.photoB = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
            + bien.photoB);
        });
        // On récupère les informations de l'utilisateur qui est le dernier à avoir fait une enchère (remporte l'enchère)
        this.readApi(this.url + '/utilisateur/' + this.idEncherisseur)
          .subscribe((dataU) => {
            this.aUtilisateurs = Object.values(dataU);
            this.nomU = this.aUtilisateurs[0][0].nomU;
            this.prenomU = this.aUtilisateurs[0][0].prenomU;
            this.adresseU = this.aUtilisateurs[0][0].adresseU;
          });
      });
  }

  fixerLivraison() {
    this.http.post(this.url + '/utilisateur/' + this.idEncherisseur + '/livraison',
      { idB: this.idB, dateL: this.dateL}).subscribe(data => {
      if (data !== undefined) {
        window.location.replace('/navigation/encheres');
      }
    });
  }

}
