import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  usuario       = { name: '',
                    email: '',
                    password: ''
                  };

  constructor(private auth: AuthService,
              private api: ApiService,
              private router: Router) { }

  ngOnInit(): void {
  }

  // =============================================================//

  guardarUsuario(form: NgForm) {
    if (form.invalid) { return; }
    this.usuario.email = this.usuario.email.toLowerCase();
    this.usuario.email.replace(' ', '');
    this.auth.nuevoUsuario(this.usuario)
        .subscribe( resp => {
                console.log(resp);
                this.guardarUsuarioBd();
                }, err => { 
                  this.error(err.error.error.message);
                  console.log('error', err.error.error.message);
              });
  }
  
  
  guardarUsuarioBd() {
    this.api.guardarDato('/usuarios', this.usuario)
              .subscribe( resp => {
                  console.log('resp', resp);
                  this.exito('Usuario guardado con éxito');
                  localStorage.setItem('iminEmail', this.usuario.email);
                  this.router.navigateByUrl('/home');
                }, err => {
                  this.error(err.error.error.message);
                  console.log('error', err);
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

}
