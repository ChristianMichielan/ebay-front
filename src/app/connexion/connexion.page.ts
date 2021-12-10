import { Component, OnInit } from '@angular/core';
import { HttpClient,HttpErrorResponse } from '@angular/common/http';

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

  constructor(public http: HttpClient) { }

  ngOnInit() {
  }

  validate(){
    return true;
  }

  connecter() {
    
      this.http.post(this.url + '/token', {pseudoU: this.pseudo, motDePasseU: this.motDePasse}).subscribe(data => {
        this.reponse = data as {idU: string, pseudoU: string, token: string};

        localStorage.setItem('idU', this.reponse.idU)
        localStorage.setItem('pseudoU', this.reponse.pseudoU)
        localStorage.setItem('token', this.reponse.token)

        // if (data !== undefined) {
        //   let utilisateur = [];
        //   utilisateur = Object.values(data);
        //   localStorage.setItem('idU', utilisateur[0]);
        window.location.replace('/navigation');
        // }
      },
      (error: HttpErrorResponse) =>{
        console.log(error.error)
      })
  }
}
