import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com/v1';
  private apikey = 'AIzaSyDKPM9lWXLluJ9XdqsnWNY9sEB-6-tHk9M';
  userToken: string;

  constructor(private http: HttpClient,
              private router: Router) {
    this.leerToken();
  }


  public logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('imin');
    localStorage.removeItem('expira');
    this.router.navigateByUrl('home');

  }


  login(usuario) {
    
    const authData = {
                      email: usuario.email,
                      password: usuario.password,
                      returnSecureToken: true
                      };

    return this.http.post(`${this.url}/accounts:signInWithPassword?key=${this.apikey}`,
    authData).pipe(
        map(resp => {
          this.guardarToken( resp['idToken']);
          return resp;
        })
      );
  }


  nuevoUsuario(usuario) {

    const authData = {
      email: usuario.email,
      password: usuario.password,
      returnSecureToken: true
    };

    return this.http.post(`${this.url}/accounts:signUp?key=${this.apikey}`, authData
    ).pipe(
      map(resp => {
        this.guardarToken( resp['idToken']);
        return resp;
      })
    );
  }


  private guardarToken(idToken: string) {
    this.userToken = idToken;

    const usuario = 
    localStorage.setItem('idToken', idToken);
    localStorage.setItem('idToken', idToken);

    const hoy = new Date();
    hoy.setSeconds(3600);
    localStorage.setItem('expira', hoy.getTime().toString() );
  }


  leerToken(): string {
    if ( localStorage.getItem('idToken') ) {
      this.userToken = localStorage.getItem('idToken');
    } else {
      this.userToken = '';
    }
    return this.userToken;
  }

  estaAutenticado(): boolean {
    if ( this.userToken.length < 2 ) {
      return false;
    }

    const expira = Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if (expiraDate > new Date() ) {
      console.log('token aun valido');
      return true;
    } else {
      console.log('token caduco');
      return false;
    }
  }




  resetPass(body) {
    return this.http.post(`${this.url}/accounts:sendOobCode?key=${this.apikey}`, body);
  }

}
