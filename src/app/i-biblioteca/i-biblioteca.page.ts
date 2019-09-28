import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

//Class or Models
import { Libros } from '../class/libros';

//Services
import { LibrosService } from '../services/libros.service';

import { HTTP } from '@ionic-native/http/ngx';
import { HttpClient } from '@angular/common/http';
import { Platform, LoadingController } from '@ionic/angular';
import { from } from 'rxjs';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-i-biblioteca',
  templateUrl: './i-biblioteca.page.html',
  styleUrls: ['./i-biblioteca.page.scss'],
})
export class IBibliotecaPage implements OnInit {
  data = [];
  arrayBiblio = [];
  public list;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _librosService: LibrosService,
    private httpC: HttpClient,
    private nativeHttp: HTTP,
    private plt: Platform,
    private loadingCtrl: LoadingController
  ) {

  }

  ngOnInit() {
    this.getLibros();
  }

  getLibros() {
    this._librosService.getLibros().subscribe(
      result => {
        console.log(<any>result);
        this.arrayBiblio = result['data'];

      },
      error => {
        console.log("errpr");
        console.log(<any>error);
      }
    );

  }

  doRefresh(event) {
    setTimeout(() => {
      this.getLibros();
      event.target.complete();
    }, 2000);
  }

  //Esto son pruebas

  async getDataStandard() {
    let loading = await this.loadingCtrl.create();
    await loading.present();

    this.httpC.get('http://localhost/ionic/iBibliotecaPhp/index.php').pipe(
      finalize(() => loading.dismiss())
    )
      .subscribe(data => {
        this.data = data['results'];
        console.log(this.data);
      }, err => {
        console.log('JS Call error: ', err);
      });
  }

  async getDataNativeHttp() {
    let loading = await this.loadingCtrl.create();
    await loading.present();

    // Returns a promise, need to convert with of() to Observable (if want)!
    from(this.nativeHttp.get('http://localhost/ionic/iBibliotecaPhp/index.php', {}, { 'Content-Type': 'application/json' })).pipe(
      finalize(() => loading.dismiss())
    ).subscribe(data => {
      let parsed = JSON.parse(data.data);
      this.data = parsed.results;
      console.log(this.data);
    }, err => {
      console.log('Native Call error: ', err);
    });
  }

  getDataEverywhere() {
    if (this.plt.is('cordova')) {
      this.getDataNativeHttp();
    } else {
      this.getDataStandard();
    }
  }

}
