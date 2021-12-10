import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastController } from '@ionic/angular';

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
  utilisateurIdU;

  // URLs
  url = 'http://localhost:3000';

  /**
   * Constructeur
   * @param http
   * @param sanitizer
   * @param activatedRoute
   * @param toastController
   */
  constructor(public http: HttpClient, private sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute, public toastController: ToastController) { }

  /**
   * Initialisation de la page
   */
  ngOnInit() {
    this.obtenirDetailBien();
    this.idU = localStorage.getItem('idU');
  }

  /**
   * Interroge l'API
   * @param url
   */
  readApi(url: string) {
    return this.http.get(url);
  }

  /**
   * Permet d'obtenir toutes les informations d'un bien spécifique
   */
  obtenirDetailBien() {
    this.idB = this.activatedRoute.snapshot.paramMap.get('idB');
    this.readApi(this.url + '/bien/' + this.idB)
      .subscribe((data) => {
        this.aBiens = Object.values(data);
        this.nomB = this.aBiens[0][0].nomB;
        this.descriptionB = this.aBiens[0][0].descriptionB;
        this.utilisateurIdU = this.aBiens[0][0].UTILISATEURidU;
        this.prixEnchereCourante = this.aBiens[0][0].prixEnchereCourante;
        this.prixPlancherB = this.aBiens[0][0].prixPlancherB;
        // Traitement de l'image base64 pour la convertir en image visualisable sur le front
        this.aBiens[0].forEach(bien => {
          this.photoB = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
            + bien.photoB);
        });
      });

    console.log('id utilisateur bien recupéré : ' + this.utilisateurIdU);
    console.log('id user log : ' + this.idU);
  }

  /**
   * Permet à un utilisateur de proposer un prix (une enchère) sur un bien
   */
  async encherir() {
    // On peut enchérir uniquement si le prix du bien est supérieur à celui proposé
    if (this.prixProposeEnchere > this.prixEnchereCourante) {
      this.idB = this.activatedRoute.snapshot.paramMap.get('idB');
      this.http.post(this.url + '/utilisateur/' + this.idU + '/enchere',
        {idB: this.idB, prix: this.prixProposeEnchere}).subscribe(data => {
        location.reload();
      });
      const toast = await this.toastController.create({
        message: '<ion-icon name="checkbox-outline"></ion-icon> Enchère enregistrée !',
        color: 'success',
        duration: 3000,
      });
      toast.present();
    } else {
      const toast = await this.toastController.create({
        message: '<ion-icon name="warning-outline"></ion-icon> Montant de l\'enchère insuffisant',
        color: 'warning',
        duration: 3000,
      });
      toast.present();
    }
  }
}
