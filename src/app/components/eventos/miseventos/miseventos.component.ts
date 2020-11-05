import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-miseventos',
  templateUrl: './miseventos.component.html',
  styleUrls: ['./miseventos.component.css']
})
export class MiseventosComponent implements OnInit {
  loading = true;

  id: string;
  eventos: any[] = [];
  admin = false;
  constructor(private api: ApiService,
              private router: Router,
              private route: ActivatedRoute,
              private auth: AuthService) {
              this.admin = this.auth.estaAutenticado();
              this.id = this.route.snapshot.paramMap.get('id');
              }

  ngOnInit(): void {
    this.getEventos();
  }

  getEventos(){
    this.api.getDatos('evento')
        .subscribe( resp => {
          for (const evento of resp){
            // console.log('fecha modif', new Date(evento.fechas.fechaEvento));
            if (evento.creatorId === this.id){
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
