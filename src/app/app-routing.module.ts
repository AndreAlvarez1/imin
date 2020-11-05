import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigComponent } from './components/evento/config/config.component';
import { EventoComponent } from './components/evento/evento/evento.component';
import { EventosComponent } from './components/eventos/eventos.component';
import { MiseventosComponent } from './components/eventos/miseventos/miseventos.component';
import { HomeComponent } from './components/home/home.component';
import { RegistroComponent } from './components/registro/registro.component';
import { ResetComponent } from './components/reset/reset.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'registro', component: RegistroComponent},
  {path: 'reset', component: ResetComponent},
  {path: 'miseventos/:id', component: MiseventosComponent, canActivate: [AuthGuard]},
  {path: 'eventos', component: EventosComponent},
  {path: 'evento/:id', component: EventoComponent},
  {path: 'config/:id', component: ConfigComponent, canActivate: [AuthGuard] },

  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {path: '**', pathMatch: 'full', redirectTo: 'home'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
