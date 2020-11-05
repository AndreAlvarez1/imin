import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { EventoModel } from '../models/evento.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url = 'https://imin-4270f.firebaseio.com/';

  constructor(private http: HttpClient) { }

  getDatoFire(ruta) {
    return this.http.get(`${ this.url }/${ ruta }.json`);
  }

  getDatos(ruta) {
    console.log('ruta', this.url + '/' + ruta + '.json');
    return this.http.get(`${ this.url }/${ ruta }.json`)
    .pipe(
      map( resp => this.crearArreglo(resp))
      );
    }

    guardarDato(ruta: string, body: any) {
      return this.http.post(`${ this.url}/${ ruta }.json`, body)
                 .pipe(
                   map(( resp: any ) => {
                     body.id = resp.name;
                     return body;
                   })
                 );
     }
  
    public crearArreglo(dato: object) {
      const arreglo = [];
      Object.keys(dato).forEach( key => {
        const elemento = dato[key];
        elemento.id = key;
        arreglo.push( elemento );
      });
      return arreglo;
    }

    actualizarDato(ruta: string, id: string, body: any) {
      return this.http.put(`${ this.url}/${ruta}/${id}.json`, body);
     }



    //  =========================
    asociarEvento(data) {
      const evento = new EventoModel();

      evento.nombre    = data.nombre;
      evento.config    = {
                                tipo: data.config.tipo,
                                cupos: data.config.cupos,
                                diferenciado: data.config.diferenciado,
                                hombres: data.config.hombres,
                                mujeres: data.config.mujeres,
                                listaEspera: data.config.listaEspera,
                                needPass: data.config.needPass,
                                password: data.config.password
                            };
      evento.creadoPor  = data.creadoPor;
      evento.creatorId  = data.creatorId;
      evento.created_at = data.created_at;
      evento.detalle    = data.detalle;
      evento.fechas     = {
                                corte: false,
                                fechaEvento: data.fechas.fechaEvento,
                                fechaFin: data.fechas.fechaFin,
                                fechaIni: data.fechas.fechaIni,
                                hora: data.fechas.hora
                                };
      evento.address    = {
                                  lugar: data.address.lugar,
                                  direccion: data.address.direccion,
                                  lat: data.address.lat,
                                  lng: data.address.lng,
                                  id: data.address.id
                      };
      evento.inscritos = data.inscritos;
      evento.status = data.status;
      return evento;
    }
}
