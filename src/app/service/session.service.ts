import { Injectable } from '@angular/core';
import { Session } from '../class/main.service'
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  public session = new Session();
  public sessionSubject = new Subject<Session>();
  public sessionState = this.sessionSubject.asObservable();

  constructor(private router: Router) { }

  login(): void {
    this.session.login = true;
    this.sessionSubject.next(this.session);
    this.router.navigate(['/']);
  }

  logout(): void {
    this.sessionSubject.next(this.session.reset());
    this.router.navigate(['/account/login'])
  }
}
