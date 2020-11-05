import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  modalLogin    = false;
  registrar     = false;
  logueado      = false;
  modalResetear = false;
  usuario       = { name: '',
                    email: '',
                    password: ''
                  };

  constructor(private auth: AuthService,
              private api: ApiService,
              private router: Router) { 

                if(localStorage.getItem('iminEmail')){
                  this.usuario.email = localStorage.getItem('iminEmail');
                }
              }

  ngOnInit(): void {
  }





validarUsuario(form: NgForm) {
  if (form.invalid) { return; }
  this.auth.login(this.usuario)
      .subscribe( resp => {
              console.log(resp);
              this.getCliente(resp['email']);
              this.exito('logueado con exito');
              }, err => { 
                console.log('error', err.error.error.message);
                this.error('Revisa si ingresaste bien tus datos');
               });
}


getCliente(email){
  this.api.getDatos(`usuarios`)
      .subscribe(resp => {
        console.log('usuarios', resp);
        const usuarios = resp;
        const existe = resp.find( u => u.email === email);
        if (existe){
          console.log('usuario', existe);
          localStorage.setItem('imin', JSON.stringify(existe));
          this.router.navigateByUrl('/eventos');
        } else {
          console.log('cuec');
        }
      });
}


enviarMail(form: NgForm) {
  if (form.invalid) { return; }

  const body = { email: this.usuario.email,
                 requestType: 'PASSWORD_RESET' };

  console.log('body', body);

  this.auth.resetPass(body)
            .subscribe( resp => {
                console.log('resp', resp);
                this.exito('Hemos enviado un correo a tu casilla para que renueves tu password');
                this.modalResetear = false;
              }, err => {
                console.log('error', err); 
                if (err.error.error.message === 'EMAIL_NOT_FOUND'){
                  this.error('El email que ingresaste no está registrado')
                }
              });
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

  autores() {
    Swal.fire({
      title: '🍺',
      text: 'Salud!',
      timer: 5000,
      imageUrl: './assets/images/mavis.png',
      imageHeight: 600,
      imageAlt: 'm&m'
    });
  }
}
