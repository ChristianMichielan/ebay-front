import {Component, OnInit} from '@angular/core';
import {Camera, CameraResultType, CameraSource, Photo} from '@capacitor/camera';
import {Filesystem, Directory} from '@capacitor/filesystem';
import { Platform, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { Geolocation } from '@ionic-native/geolocation/ngx';

interface LocalFile {
  name: string;
  path: string;
  data: string;
}

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.page.html',
  styleUrls: ['./inscription.page.scss'],
})
export class InscriptionPage implements OnInit {
  // Attributs techniques
  images: LocalFile[] = [];
  imageDir = 'stored-images';
  geoLocAdressData = [];

  // Attributs utilisateur
  pseudo;
  nom;
  prenom;
  motDePasse;
  email;
  geoLocLat;
  geoLocLong;
  adresse;
  base64;

  // URLs
  url = 'http://localhost:3000';
  urlApiExterne = 'http://api.positionstack.com/v1/reverse';

  constructor(private platform: Platform, private loadingCtrl: LoadingController,
              private http: HttpClient, private geolocation: Geolocation) { }

  ngOnInit() {
    this.obtenirLocalisationActuelle();
  }

  /***** Gestion envoi des données pour la création du compte  *****/

  async creerUnCompte() {
      this.http.post(this.url + '/utilisateur', {pseudoU: this.pseudo, nomU: this.nom,
        prenomU: this.prenom, motDePasseU: this.motDePasse, mailU: this.email, geolocalisationLatU: this.geoLocLat,
        geolocalisationLongU: this.geoLocLong, adresseU: this.adresse
      }).subscribe(data => {
        if (data !== undefined) {
          const resultat = Object.values(data);
          // On récupère l'id de l'utilisateur qui vient d'être inséré avec la requête post pour pouvoir lui ajouter sa photo
          const idUtilisateur = resultat[0];
          if (this.images[this.images.length - 1] !== undefined) {
            // Upload de l'image de profil pour l'utilisateur qui a été ajouté
            this.startUpload(idUtilisateur).then( result2 => {
              window.location.replace('/navigation');
            });
          } else {
            window.location.replace('/navigation');
          }
        }
      });
  }

  /*****  Gestion geolocalisation *****/

  /* Permet d'obtenir la localisation (latitude, longitude) de l'utilisateur */
  obtenirLocalisationActuelle() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.geoLocLat = resp.coords.latitude;
      this.geoLocLong = resp.coords.longitude;
      this.obtenirAdresseParGeolocalisation();
    }).catch((error) => {
      console.log('Impossible de récupérer la géolocalisation', error);
    });
  }

  /* Permet d'obtenir une adresse pour l'utilisateur suivant sa géolocalisation */
  async obtenirAdresseParGeolocalisation() {
    // Appel de l'API externe Position Track
    await this.http.get(this.urlApiExterne + '?access_key=3138b74b848c3b260600f3aba67e62be&query='
      + this.geoLocLat + ',' + this.geoLocLong + '&limit=1',{}).toPromise().then(data => {
        console.log(data);
      if (data !== undefined) {
        this.geoLocAdressData = Object.values(data);
        this.adresse = this.geoLocAdressData[0][0].label;
      }
    });
  }

  /***** Gestion IMAGE *****/

  /* Ouvre la gallerie du téléphone pour choisir une photo */
  async selectionnerImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Photos
    });
    if (image) {
      this.saveImage(image);
    }
  }

  /* Enregistre l'image en cache */
  async saveImage(photo: Photo) {
    const base64Data = await this.readAsBase64(photo);
    this.base64 = base64Data;
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      directory: Directory.Data,
      path: `${this.imageDir}/${fileName}`,
      data: base64Data
    });
    this.loadFiles();
  }

  /* Conversion de l'image en Blob */
  async readAsBase64(photo: Photo) {
    if (this.platform.is('hybrid')) {
       const file = await Filesystem.readFile({
         path:photo.path
       });
       return file.data;
    } else {
      const response = await fetch(photo.webPath);
      const blob = await response.blob();

      return await this.convertBlobToBase64(blob) as string;
    }
  }

  /* Conversion de d'un blob en base64 */
  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  /* Lancer l'upload de l'image vers le back-end */
  async startUpload(idUtilisateur) {
    // On ne prend que la dernière image avatar enregistrée dans le cache
    const file = this.images[this.images.length - 1];
    const response = await fetch(file.data);
    // Conversion en blob et en fichier blob
    const blob = await response.blob();
    const formData = new FormData();
    formData.append('avatar', blob, file.name);
    await this.uploadData(formData, idUtilisateur);
  }

  /* Contact de l'API back-end */
  async uploadData(formData: FormData, idUtilisateur) {
    const loading = await this.loadingCtrl.create({
      message: 'Upload en cours...',
    });
    await loading.present();
    const url = 'http://localhost:3000/utilisateur/' + idUtilisateur + '/photo';

    this.http.post(url, formData).pipe(
      finalize(() => {
        loading.dismiss();
      })
    ).subscribe(res => {
      console.log(res);
    });
  }

  /* Chargement les images en cache */
  async loadFiles() {
    this.images = [];

    const loading = await this.loadingCtrl.create({
      message: 'Chargement...',
    });
    await loading.present();

    Filesystem.readdir({
      directory: Directory.Data,
      path: this.imageDir
    }).then(result => {
      this.loadFileData(result.files);
    }, async err => {
      await Filesystem.mkdir({
        directory: Directory.Data,
        path: this.imageDir
      });
    }).then(_ => {
      loading.dismiss();
    });
  }

  /* Charge la dernière image mise en cache pour l'afficher sur la page*/
  async loadFileData(fileNames: string[]) {
    let i = 0;
    for (const f of fileNames) {
      i++;
      const filePath = `${this.imageDir}/${f}`;
      const readFile = await Filesystem.readFile({
        directory: Directory.Data,
        path: filePath
      });
      // Affiche la dernière image stockée en cache
      if (i === fileNames.length) {
        this.images.push({
          name: f,
          path: filePath,
          data: `data:image/jpeg;base64,${readFile.data}`
        });
      }
    }
  }
}
