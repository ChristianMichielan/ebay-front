import { Component } from '@angular/core';
import {Camera, CameraResultType, CameraSource, Photo} from '@capacitor/camera';
import {Filesystem, Directory} from '@capacitor/filesystem';
import { Platform, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import {Geolocation} from '@ionic-native/geolocation/ngx';

interface LocalFile {
  name: string;
  path: string;
  data: string;
}

@Component({
  selector: 'app-vendre',
  templateUrl: 'vendre.page.html',
  styleUrls: ['vendrepage.scss']
})
export class VendrePage {
  // Attributs techniques
  images: LocalFile[] = [];
  imageDir = 'stored-images';

  // Attributs bien
  nom;
  description;
  prixPlanche;
  base64;
  idUtilisateur;

  // URLs
  url = 'http://localhost:3000';

  constructor(private platform: Platform, private loadingCtrl: LoadingController,
              private http: HttpClient) {
    this.idUtilisateur = localStorage.getItem('idU');
  }

  /***** Gestion envoi des données pour la création du compte  *****/

  async creerUnBien() {
    this.http.post(this.url + '/utilisateur/' + this.idUtilisateur + '/bien', {nomB: this.nom, descriptionB: this.description,
      prixPlancherB: this.prixPlanche
      }).subscribe(data => {
      if (data !== undefined) {
        const resultat = Object.values(data);
        // On récupère l'id du bien qui vient d'être inséré avec la requête post pour pouvoir lui ajouter sa photo
        const idBien = resultat[0].idB;
        // Upload de l'image du bien
        this.startUpload(idBien).then( result2 => {
          window.location.replace('/navigation');
        });
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
  async startUpload(idBien) {
    // On ne prend que la dernière imag du bien enregistrée dans le cache
    const file = this.images[this.images.length - 1];
    const response = await fetch(file.data);
    // Conversion en blob et en fichier blob
    const blob = await response.blob();
    const formData = new FormData();
    formData.append('bien', blob, file.name);
    await this.uploadData(formData, idBien);
  }

  /* Contact de l'API back-end */
  async uploadData(formData: FormData, idBien) {
    const loading = await this.loadingCtrl.create({
      message: 'Publication de l\'annonce en cours...',
    });
    await loading.present();
    const url = 'http://localhost:3000/bien/' + idBien + '/photobien';

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
