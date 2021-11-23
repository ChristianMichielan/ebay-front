import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-bien-detail',
  templateUrl: './bien-detail.page.html',
  styleUrls: ['./bien-detail.page.scss'],
})
export class BienDetailPage implements OnInit {

  // Attributs
  aBiens;
  idB;
  idU;
  nomB;
  descriptionB;
  photoB;
  prixPlancherB;
  prixEnchereCourante;
  prixProposeEnchere;

  // URLs
  url = 'http://localhost:3000';

  constructor(public http: HttpClient, private sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.obtenirDetailBien();
  }

  readApi(url: string) {
    return this.http.get(url);
  }

  /* Permet d'obtenir toutes les informations d'un bien spécifique */
  obtenirDetailBien() {
    this.idB = this.activatedRoute.snapshot.paramMap.get('idB');
    this.readApi('http://localhost:3000/bien/' + this.idB)
      .subscribe((data) => {
        this.aBiens = Object.values(data);
        this.nomB = this.aBiens[0][0].nomB;
        this.descriptionB = this.aBiens[0][0].descriptionB;
        this.prixEnchereCourante = this.aBiens[0][0].prixEnchereCourante;
        this.prixPlancherB = this.aBiens[0][0].prixPlancherB;
        // Traitement de l'image base64 pour la convertir en image visualisable sur le front
        this.aBiens[0].forEach(bien => {
          this.photoB = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
            + bien.photoB);
        });
      });
  }

  /* Permet à un utilisateur de proposer un prix (une enchère) sur un bien */
  encherir() {
    this.idB = this.activatedRoute.snapshot.paramMap.get('idB');
    this.idU = localStorage.getItem('idU');
    this.http.post(this.url + '/utilisateur/' + this.idU + '/enchere',
      {idB: this.idB, prix: this.prixProposeEnchere}).subscribe(data => {
      location.reload();
    });
  }

}
