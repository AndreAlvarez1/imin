import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {

  usuario = { name: '',
              email: '',
              password: ''
            };

  constructor(private auth: AuthService,
              private router: Router) { }

  ngOnInit(): void {
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
                  this.router.navigateByUrl('/home');
                }, err => {
                  console.log('error', err);
                  if (err.error.error.message === 'EMAIL_NOT_FOUND'){
                    this.error('El email que ingresaste no está registrado')
                  }
                });
  }
  

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
