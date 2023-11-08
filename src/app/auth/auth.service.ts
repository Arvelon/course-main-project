import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  API_URL_SIGNUP =
    'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAJlcaGcEr2zh2qV68fZaE_RMdWN9bVvQA';
  API_URL_SIGNIN =
    'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAJlcaGcEr2zh2qV68fZaE_RMdWN9bVvQA';

  constructor(private http: HttpClient) {}

  signUp(email: string, password: string) {
    // Sign up/register user
    console.log(email, password);
    return this.http.post(this.API_URL_SIGNUP, { email, password, returnSecureToken: true });
  }

  signIn(email: string, password: string) {
    // Sign in/log in user
    console.log(email, password);
    return this.http.post(this.API_URL_SIGNIN, { email, password, returnSecureToken: true });
  }
}
