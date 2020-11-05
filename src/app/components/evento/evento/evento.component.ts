import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { interval } from 'rxjs';
import { EventoModel } from 'src/app/models/evento.model';
import { InscritoModel } from 'src/app/models/inscrito.model';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-evento',
  templateUrl: './evento.component.html',
  styleUrls: ['./evento.component.css']
})
export class EventoComponent implements OnInit {

  loading = true;
  id: string;
  modalImIn = false;
  evento = new EventoModel();
  bloqueo = false;

  user: any;
  editor = false;
  inscrito = new InscritoModel();
  inscritos = [];
  mujeres = [];
  hombres = [];
  waiting = [];
  women = true;

  estadoIncripcion = 'abierto';
  public ciclo = interval(120000);
  public tiempoLogout;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private api: ApiService,
              private auth: AuthService) {

                this.id = this.route.snapshot.paramMap.get('id');
                this.getEvento(this.id);

                if (localStorage.getItem('imin')){
                 this.user = JSON.parse(localStorage.getItem('imin'));
                }
              }

  ngOnInit(): void {
  }


info() {
  console.log('editor', this.editor);
  console.log('evento', this.evento);
  console.log('inscritos', this.evento);
  console.log('mujeres', this.mujeres);
  console.log('hombres', this.hombres);
  console.log('estadoIncripcion', this.estadoIncripcion);
}

timer() {
  this.tiempoLogout = this.ciclo.subscribe( (n) => {
  this.getEvento(this.id);
  });
}

getEvento(id) {
    this.api.getDatoFire(`evento/${id}`)
            .subscribe( resp => {
              this.evento = this.api.asociarEvento(resp);
              this.evento.id = this.id;
              console.log('traigo evento', this.evento);

              if (localStorage.getItem('imin')){
                this.checkEditor(resp['creatorId']);
              }

              if (this.evento.inscritos === 'vacio'){
                this.evento.inscritos = [];
              }

              if (this.evento.config.needPass) {
                this.validarPass('memoria');
              }

              this.calcGender();
              this.refreshEstado();

              this.loading = false;
            }, err => {
              console.log('error', err.error);
              this.loading = false;
            });
}

checkEditor(id){
  const admin = this.auth.estaAutenticado();
  if (this.user.id === id && admin === true){
    this.editor = true;
  }
}


editar() {
  this.router.navigateByUrl(`/config/${this.id}`);
}


imin(form: NgForm) {
  if (!form.valid){
    console.log('pon el nombre');
    return;
  }

  const day = new Date();

  if ( !this.women){
    this.inscrito.gender = 'men';
  } else {
    this.inscrito.gender = 'women';
  }

  this.inscrito.fecha = day.getFullYear()	+ '-' + (day.getMonth() + 1 ) + '-' + day.getDate();
  this.inscrito.hora = day.getHours()	+ ':' + day.getMinutes();

  console.log('imin!', this.inscrito);

  this.inscribir(this.inscrito);
}

inscribir(persona) {
  if ( this.buscarRepetido(persona)){
    this.errorRepetido('There is already someone with the same name');
    return;
  }

  if (this.evento.config.tipo === 'Limited'){ // Cupos Limitados

    if (this.evento.config.cupos > this.inscritos.length){ // Veo si hay cupos aun

      if (this.evento.config.diferenciado){ // Cupos por genero

        //  const mujeres = this.calcMujeres();
        //  const hombres = this.evento.inscritos.length - mujeres;
        //  console.log('hombres', hombres);

         if (this.evento.config.mujeres > this.mujeres.length && persona.gender === 'women'){
            persona.status = 1;
            this.evento.inscritos.push(persona);
            this.alertaOk('Welcome you are IN ');

          }

         if (this.evento.config.mujeres <= this.mujeres.length && persona.gender === 'women'){
          this.listaEspera(persona);
          }

         if (this.evento.config.hombres > this.hombres.length && persona.gender === 'men'){
            persona.status = 1;
            this.evento.inscritos.push(persona);
            this.alertaOk('Welcome you are IN ');

          }
         if (this.evento.config.hombres <= this.hombres.length && persona.gender === 'men'){
            this.listaEspera(persona);
          }


      } else{ // No se diferencia por genero y quedan cupos
        persona.status = 1;
        this.evento.inscritos.push(persona);
        this.alertaOk('Welcome you are IN' );

      }

    } else {  // No quedan Cupos
      this.listaEspera(persona);
    }

  } else {   // Cupos ilimitados
    persona.status = 1;
    this.evento.inscritos.push(persona);
    this.alertaOk('Welcome you are IN ');
  }

  console.log('inscritos', this.evento.inscritos);
  this.guardarInscrito();
}




listaEspera(persona){
  if (!this.evento.config.listaEspera){
    this.alertaEspera('Sorry, list is full check again later');
    return;
  }
  persona.status = 2;
  this.evento.inscritos.push(persona);
  this.alertaEspera('List is full but you are in waiting list, its something');


}

calcGender(){
  this.mujeres = [];
  this.hombres = [];
  this.waiting = [];

  this.mujeres   = this.evento.inscritos.filter( m => m.gender === 'women' && m.status === 1);
  this.hombres   = this.evento.inscritos.filter( m => m.gender === 'men'  && m.status === 1);
  this.waiting   = this.evento.inscritos.filter( m => m.status === 2);
  this.inscritos = this.evento.inscritos.filter( m => m.status === 1);
  console.log('mujeres', this.mujeres, this.mujeres.length);
  return this.mujeres.length;
}


buscarRepetido(persona){
  if (this.evento.inscritos.length < 1){
    return false;
  }

  const repetido = this.inscritos.find( p => p.name === persona.name);
  if (repetido){
    return true;
  } else {
    return false;
  }

}

guardarInscrito(){
      //  guardar
      console.log('guardo evento', this.evento);
      this.api.actualizarDato('/evento', this.id, this.evento)
              .subscribe( resp => {
                console.log('resp', resp);
                this.loading = false;
                this.getEvento(this.id);
              }, err => {
                this.loading = false;
                this.errorRepetido(err.error.error.message);
                console.log('error', err);
            });
}



refreshEstado(){

  if (this.evento.config.needPass) {
    this.validarPass('memoria');
  }

  if (this.evento.status === 0 ){ // Evento Cerrado
    this.estadoIncripcion = 'cerrado';
    return;
  }

  if (this.evento.config.tipo !== 'Limited'){ // Inscripciones ilimitadas
    this.estadoIncripcion = 'abierto';
    return;
  }

  if (this.evento.config.tipo === 'Limited'){

    if (this.evento.config.cupos > this.inscritos.length){ // Cupos disponibles
      this.estadoIncripcion = 'abierto';
      return;
    }

    if (this.evento.config.cupos <= this.inscritos.length){
      if (this.evento.config.listaEspera === true){ // Se acaron los cupos pero hay lista de espera
        this.estadoIncripcion = 'espera';
      } else {
        this.estadoIncripcion = 'cerrado'; // Se aaron los cupos y no hay lista de espera
      }
    }


  }

}



validarPass(value){

    console.log('1-pass', value);

    if (this.editor === true) {
        this.bloqueo = false;
        // 'bloqueo false, por que es editor'
        return;
    }

    if ( localStorage.getItem('iminpass')){
        const data = JSON.parse(localStorage.getItem('iminpass'));
        if ( this.id === data.id && this.evento.config.password === data.pass){
          // aca bloqueo false por local storage'
          this.bloqueo = false;
          return;
        } else {
          console.log('no coincide la info del localstorage');
        }
    }

    if (value === undefined) {
      console.log('indefinido');
      this.errorPass('Ingresa un password', value);
      return; }

    if (value === this.evento.config.password){
      // aca bloqueo false por que coincide la clave'
      this.bloqueo = false;
      const iminpass = {
                          id: this.id,
                          pass: value
                        };

      localStorage.setItem('iminpass', JSON.stringify(iminpass));
    } else {
      this.bloqueo = true;
      this.errorPass('Password no coincide', value);

    }
}



borrar(m){

  this.evento.inscritos = this.evento.inscritos.filter( p => p.name !== m.name);
  
  if (this.evento.inscritos.length === 0){
    this.evento.inscritos = 'vacio';
  }

  if ( this.evento.config.listaEspera === true && m.status === 1){
    console.log('corre la lista de espera');

    if ( this.evento.config.diferenciado === true && this.waiting.length > 0){
      for (const p of this.waiting){
        console.log('p', p);
        if ( p.gender === m.gender){
            p.status = 1;
            this.guardarInscrito();
            return;
        }
      }
    } else {
      if (this.waiting.length > 0){
        this.waiting[0].status = 1;
      }
    }
  }

  console.log('evento', this.evento);
  this.guardarInscrito();
}






//  =============================================  //
//  =============================================  //
//  =============================================  //
//  ================== compartir
//  =============================================  //
//  =============================================  //
//  =============================================  //

copyText(val: string){
  const link = 'http://www.andrealvarez.com/imin/#' + this.router.url;
  console.log('link', link);
  let selBox = document.createElement('textarea');
    selBox.value = link
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);

    this.alertaOk('link copiado');
  }








//  =============================================  //
//  =============================================  //
//  =============================================  //
//  ================== Warnings
//  =============================================  //
//  =============================================  //
//  =============================================  //

alertaOk(texto) {
  // this._gs.sonido('exito.mp3');
  Swal.fire({
    title: 'Excelente',
    icon: 'success',
    text: texto,
    confirmButtonColor: '#3085d6',
    timer: 3000,
    timerProgressBar: true
  });
  this.inscrito = new InscritoModel();
  this.modalImIn = false;
}

alertaEspera(error) {
  // this.conex.sonido('exito.mp3');
  Swal.fire({
    text: error,
    icon: 'warning',
    timer: 3000,
    timerProgressBar: true
  });
  this.modalImIn = false;
}

errorRepetido(error) {
  // this.conex.sonido('exito.mp3');
  Swal.fire({
    text: error,
    icon: 'error',
    timer: 3000,
    timerProgressBar: true
  });
}

errorPass(error, value) {
  if (value === 'memoria'){
    return;
  }
  // this.conex.sonido('exito.mp3');
  Swal.fire({
    text: error,
    icon: 'error',
    timer: 3000,
    timerProgressBar: true
  });
}

}
