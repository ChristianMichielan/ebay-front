import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.page.html',
  styleUrls: ['./connexion.page.scss'],
})
export class ConnexionPage implements OnInit {

  pseudo;
  motDePasse;
  url = 'http://localhost:3000';
  reponse;

  /**
   * Constructeur de la page
   * @param http
   * @param toastController
   */
  constructor(public http: HttpClient, public toastController: ToastController) { }

  /**
   * A l'initialisation de la page
   */
  ngOnInit() {
  }

  /**
   * Permet à l'utilisateur de se connecter au système
   */
  connecter() {
    this.http.post(this.url + '/token', {pseudoU: this.pseudo, motDePasseU: this.motDePasse})
      .subscribe(data => {
            this.reponse = data;
            if (data !== undefined) {
              let utilisateur = [];
              utilisateur = Object.values(data);
              localStorage.setItem('idU', utilisateur[0]);
              window.location.replace('/navigation');
            }
          },
        async error => {
          const toast = await this.toastController.create({
            message: '<ion-icon name="alert-circle-outline"></ion-icon> Connexion impossible !',
            color: 'danger',
            duration: 3000,
          });
          toast.present();
        }
        );
  }

}
