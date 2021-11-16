import {Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-annonces',
  templateUrl: 'annonces.page.html',
  styleUrls: ['annonces.page.scss']
})
export class AnnoncesPage implements OnInit {
  aBiens = [];
  url = 'http://localhost:3000';

  constructor(public http: HttpClient, private sanitizer: DomSanitizer) {}

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
        });
      });
  }

  readApi(url: string) {
    return this.http.get(url);
  }
}
