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

  // Attributs utilisateur
  pseudo;
  nom;
  prenom;
  motDePasse;
  email;
  geoLocLat;
  geoLocLong;
  url = 'http://localhost:3000';

  constructor(private platform: Platform, private loadingCtrl: LoadingController,
              private http: HttpClient, private geolocation: Geolocation) { }

  ngOnInit() {
    this.loadFiles();
  }


  /***** Gestion envoi des données  ***/

  creerUnCompte() {
    this.obtenirLocalisationActuelle();
    this.http.post(this.url + '/utilisateur', {pseudoU: this.pseudo, nomU: this.nom,
      prenomU: this.prenom, motDePasseU: this.motDePasse, emailU: this.email, geolocalisationLatU: this.geoLocLat,
      geolocalisationLongU: this.geoLocLong
    }).subscribe(data => {
      if (data !== undefined) {
        window.location.replace('/tabs');
      }
    });
  }

  /***  Gestion geolocalisation ***/
  obtenirLocalisationActuelle() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.geoLocLat = resp.coords.latitude;
      this.geoLocLong = resp.coords.longitude;
    }).catch((error) => {
      console.log('Impossible de récupérer la géolocalisation', error);
    });
  }

  /**** Gestion IMAGE *****/

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
  async saveImage(photo: Photo) {
    const base64Data = await this.readAsBase64(photo);
    console.log(base64Data);
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      directory: Directory.Data,
      path: `${this.imageDir}/${fileName}`,
      data: base64Data
    });
    this.loadFiles();
  }

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

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });

  async startUpload() {
    const file = this.images[this.images.length - 1];
    const response = await fetch(file.data);
    const blob = await response.blob();
    const formData = new FormData();
    formData.append('file', blob, file.name);
    this.uploadData(formData);
  }

  async uploadData(formData: FormData) {
    const loading = await this.loadingCtrl.create({
      message: 'Upload en cours...',
    });
    await loading.present();
    const url = 'http://localhost:8888/images/upload.php';

    this.http.post(url, formData).pipe(
      finalize(() => {
        loading.dismiss();
      })
    ).subscribe(res => {
      console.log(res);
    });
  }

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
