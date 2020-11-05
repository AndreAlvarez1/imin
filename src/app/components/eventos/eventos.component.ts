import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  day = new Date();
  hoy = this.day.getFullYear()	+ '-' + (this.day.getMonth() + 1 ) + '-' + this.day.getDate();
  eventos: any[] = [];
  admin = false;
  loading = true;

  constructor(private api: ApiService,
              private auth: AuthService,
              private router: Router) {
              this.admin = this.auth.estaAutenticado();
               }

  ngOnInit(): void {
    this.getEventos();
  }

  info() {
    console.log('day', this.day);
    console.log('hoy', this.hoy);
    console.log('evento', this.eventos);
  }

  getEventos(){
    this.api.getDatos('evento')
        .subscribe( resp => {
          for (const evento of resp){
            // console.log('fecha modif', new Date(evento.fechas.fechaEvento));
            if (new Date(evento.fechas.fechaEvento) >= this.day){
            let total = 0;
            if (evento.inscritos !== 'vacio' ){
              const inscritos = this.api.crearArreglo(evento.inscritos);
              for ( const i of inscritos){
                if (i.status === 1) { total ++; }
              }
            }
            evento.cantInscritos = total;
            console.log('fecha futura');
            this.eventos.push(evento);
            } 

          }
          console.log('eventos', this.eventos);
          this.loading = false;
        });
  }

  selectEvento(e){
    this.router.navigateByUrl('/evento/' + e.id);
  }
}
