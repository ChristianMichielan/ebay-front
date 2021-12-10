import {Component, OnInit} from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { Router} from '@angular/router';

@Component({
  selector: 'app-annonces',
  templateUrl: 'annonces.page.html',
  styleUrls: ['annonces.page.scss']
})
export class AnnoncesPage implements OnInit {
  aBiens = [];
  aBiensBackup = [];
  url = 'http://localhost:3000';

  constructor(public http: HttpClient, private sanitizer: DomSanitizer, private router: Router) {}


  ngOnInit() {
    this.getBiens();
  }
  //recuperer token pour envoyer avec la request
  getHeaders(){
    const token = localStorage.getItem('token');
    return token? new HttpHeaders().set('Authorization', 'Bearer ' + token) :null
  }

  getBiens() {
    this.readApi(this.url + '/bien')
      .subscribe((data) => {
        this.aBiens = Object.values(data)[0];
        // Traitement de l'image base64 pour la convertir en image visualisable sur le front
        this.aBiens.forEach(bien => {
          bien.photoB = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
            + bien.photoB);
        });
        this.aBiensBackup = Object.values(data)[0];
      },
      (error: HttpErrorResponse) =>{
        window.location.replace('/');
      }
      );
  }

  readApi(url: string) {
    let headers =this.getHeaders();
    if(headers instanceof HttpHeaders)
      return this.http.get(url, {headers :headers})
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
}
