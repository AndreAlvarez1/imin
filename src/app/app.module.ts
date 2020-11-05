import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventosComponent } from './components/eventos/eventos.component';
import { ConfigComponent } from './components/evento/config/config.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { RegistroComponent } from './components/registro/registro.component';
import { ResetComponent } from './components/reset/reset.component';
import { EventoComponent } from './components/evento/evento/evento.component';
import { LoadingComponent } from './shared/loading/loading.component';
import { MiseventosComponent } from './components/eventos/miseventos/miseventos.component';

@NgModule({
  declarations: [
    AppComponent,
    EventosComponent,
    ConfigComponent,
    NavbarComponent,
    HomeComponent,
    RegistroComponent,
    ResetComponent,
    EventoComponent,
    LoadingComponent,
    MiseventosComponent  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
