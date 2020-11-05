import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  usuario: any;
  admin = false;
  loading: boolean;
    constructor(public auth: AuthService,
                public router: Router) {

    this.admin = this.auth.estaAutenticado();
    if (this.admin){
      this.usuario = JSON.parse(localStorage.getItem('imin'));
    }
   }



  ngOnInit(): void {
  }


  misEventos(){
    console.log('u', this.usuario);
    this.router.navigateByUrl(`/miseventos/${this.usuario.id}`);

  }
}
