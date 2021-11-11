import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.page.html',
  styleUrls: ['./connexion.page.scss'],
})
export class ConnexionPage implements OnInit {

  pseudo;
  motDePasse;
  url = 'localhost:3000/api/v1/';
  reponse;

  constructor(public http: HttpClient) { }

  ngOnInit() {
  }

  connecter() {
    this.http.post(this.url + '/token', {pseudo: this.pseudo, motDePasse: this.motDePasse}).subscribe(data => {
      this.reponse = data;
      console.log(data);
    });
    console.log(this.reponse);
    //window.location.replace('/tabs');
  }

}
