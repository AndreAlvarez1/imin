import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventoModel } from 'src/app/models/evento.model';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})

export class ConfigComponent implements OnInit {

  loading = true;
  id: string;
  evento = new EventoModel();
  titulo = 'New Event';
  user = JSON.parse(localStorage.getItem('imin'));
  editor = false;


  day = new Date();
  hoy = this.day.getFullYear()	+ '-' + (this.day.getMonth() + 1 ) + '-' + this.day.getDate();
  time = this.day.getHours()	+ ':' + this.day.getMinutes();


  constructor(private route: ActivatedRoute,
              private router: Router,
              private api: ApiService,
              private auth: AuthService) {

    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id === 'nuevo') {
      this.nuevoEvento();
    } else {
      this.getEvento(this.id);
      this.titulo = 'Update Event';
    }
  }

  ngOnInit(): void {
  }

  info(){
    console.log('evento', this.evento);
  }


  nuevoEvento(){
    this.evento = new EventoModel();
    this.evento.fechas = {
                            corte: false,
                            fechaEvento: this.hoy,
                            fechaFin: this.hoy,
                            fechaIni: this.hoy,
                            hora: this.time
                          };
    this.evento.config = {
                          tipo: 'Limited',
                          cupos: 0,
                          diferenciado: false,
                          hombres: 0,
                          mujeres: 0,
                          listaEspera: true,
                          needPass: false,
                          password: ''
                          };
    this.evento.creadoPor = JSON.parse(localStorage.getItem('imin')).name;
    this.evento.creatorId = JSON.parse(localStorage.getItem('imin')).id;
    console.log('evento', this.evento);
    this.loading = false;
  }

  selectTipo(tipo){
    console.log('tipo', tipo);
  }

  selectGenero(genero){
    console.log('genero', genero);
    if (genero === 'true'){
      this.evento.config.diferenciado = true;
    } else {
      this.evento.config.diferenciado = false;
    }
    this.evento.config.mujeres = this.evento.config.cupos;
  }

  selectPass(status){
    if (status === 'true'){
      this.evento.config.needPass = true;
    } else {
      this.evento.config.needPass = false;
    }
  }
  selectEspera(status){
    if (status === 'true'){
      this.evento.config.listaEspera = true;
    } else {
      this.evento.config.listaEspera = false;
    }
  }

  

  refreshCupos() {
    if (this.evento.config.cupos < 0){
      this.error('Please choose a number greater than 0');
      this.evento.config.cupos  = 0;
      return;
    }

    if (this.evento.inscritos !== 'vacio'){
      if (this.evento.config.cupos < this.evento.inscritos.length){
        this.error('You already have, ' + this.evento.inscritos.length + ' people registered. Choose a bigger capacity');
        return;
      }

      if (this.evento.config.diferenciado === true ) {
        const inscritosHombres = this.evento.inscritos.filter( i => i.gender === 'men');
        console.log('inscritosHombres', inscritosHombres.length);
        console.log('this.evento.config.cupos ', this.evento.config.cupos );
        console.log('resta ', this.evento.config.cupos - inscritosHombres.length);

        
        this.evento.config.mujeres = this.evento.config.cupos - inscritosHombres.length;
        this.evento.config.hombres = this.evento.config.cupos - this.evento.config.mujeres;
      }

    } else {
      this.evento.config.mujeres = this.evento.config.cupos;
    }
  }

  calcularCupos() {
    console.log('cupos');
    if (this.evento.config.cupos === 0){
      this.evento.config.mujeres = 0;
      this.error('You must defined a general quota first');
      return;
    }

    if (this.evento.config.mujeres > this.evento.config.cupos){
      this.evento.config.mujeres = 0;
      this.error('You must choose a number equal to or less than the general quota');
      return;
    }

    this.evento.config.hombres = this.evento.config.cupos - this.evento.config.mujeres;

    console.log('mujeres', this.evento.config.mujeres);
    console.log('hombres', this.evento.config.hombres);
  }



  guardar(form: NgForm){
    if (!form.valid){
      this.error('Please complete all the fieds');
      return;
    }

    if (this.evento.config.tipo === 'Limited' && this.evento.config.cupos < 1){
      this.error('Registration should be greater than 0');
      return;
    }

    this.loading = true;
    if (this.evento.config.tipo === 'Infinite'){
      this.evento.config.listaEspera = false;
    }

    this.evento.created_at = new Date();
    console.log('evento', this.evento);

    if (this.id === 'nuevo'){
      this.api.guardarDato('/evento', this.evento)
              .subscribe( resp => {
                  console.log('resp', resp);
                  this.loading = false;
                  this.exito('Evento guardado con éxito');
                  this.router.navigateByUrl('/eventos');
                }, err => {
                  this.loading = false;
                  this.error(err.error.error.message);
                  console.log('error', err);
              });
    } else {
      this.api.actualizarDato('/evento', this.id, this.evento)
              .subscribe( resp => {
                console.log('resp', resp);
                this.loading = false;
                this.exito('Evento actualizado con éxito');
                this.router.navigateByUrl('/eventos');
              }, err => {
                this.loading = false;
                this.error(err.error.error.message);
                console.log('error', err);
            });
    }
  }






//  =============================================  //
//  =============================================  //
//  =============================================  //
//  ================== Traer Info
//  =============================================  //
//  =============================================  //
//  =============================================  //


getEvento(id) {
  this.api.getDatoFire(`evento/${id}`)
          .subscribe( resp => {
            this.evento = this.api.asociarEvento(resp);
            this.evento.id = this.id;

            this.evento.fechas.fechaIni = this.hoy,
            this.evento.fechas.fechaFin = this.hoy,

            console.log('evento', this.evento);
            this.checkEditor(resp['creatorId']);
            this.loading = false;
          });
}

checkEditor(id){
  const admin = this.auth.estaAutenticado();

  if (this.user.id === id && admin === true){
    this.editor = true;
    console.log('soy el editor');
  }

  this.loading = false;

}


  
//  =============================================  //
//  =============================================  //
//  =============================================  //
//  ================== Warnings
//  =============================================  //
//  =============================================  //
//  =============================================  //

exito(texto) {
  // this._gs.sonido('exito.mp3');
  Swal.fire({
    title: 'Excelente',
    icon: 'success',
    text: texto,
    confirmButtonColor: '#3085d6',
    timer: 3000,
    timerProgressBar: true
  });
}

error(error) {
  // this.conex.sonido('exito.mp3');
  Swal.fire({
    title: 'Cuec',
    text: error,
    icon: 'error',
    timer: 3000,
    timerProgressBar: true
  });
}


}
