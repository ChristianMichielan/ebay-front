import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
  profil = [];
  url = 'http://localhost:3000';
  nomU;
  prenomU;
  mailU;
  adresseU;
  pseudoU;
  photoU;
  idU;
  constructor(public alertController: AlertController,private router: Router,
              private httpClient: HttpClient , private sanitizer: DomSanitizer, private activatedRoute: ActivatedRoute ) {
  }

  ngOnInit() {
    this.getInfoUser();
  }

  getInfoUser(){
    //this.idU = this.activatedRoute.snapshot.paramMap.get('idU');
    this.idU = localStorage.getItem('idU');
    this.readApi(this.url + '/utilisateur/'+ this.idU)
      .subscribe(data => {
        this.profil = Object.values(data)[0];
        console.log(this.profil);
        this.prenomU =this.profil[0].prenomU;
        this.nomU = this.profil[0].nomU;
        this.mailU = this.profil[0].mailU;
        this.pseudoU = this.profil[0].pseudoU;
        this.adresseU = this.profil[0].adresseU;
        this.pseudoU = this.profil[0].pseudoU;
        // Traitement de l'image base64 pour la convertir en image visualisable sur le front
        this.photoU = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
            + this.profil[0].photoU);
      });
  }

  readApi(url: string) {
    return this.httpClient.get(url);
  }

  async logout() {
    const alert = await this.alertController.create({
      header : 'Deconnexion',
      message : 'Souhaitez-vous vous déconnecter?',
      buttons: [
        {text :'Annuler',
         role : 'Cancel',
         cssClass: 'secondary',
         handler: () => {
           console.log('Confirmer Annulation');
         }
        },
         {text :'Déconnexion',
          handler: ()=> {
            console.log('OK');
            localStorage.clear();
            this.router.navigateByUrl('/' );
          }
         }]
    });
    await alert.present();
    const result =  await alert.onDidDismiss();
    console.log(result);
  }
}
