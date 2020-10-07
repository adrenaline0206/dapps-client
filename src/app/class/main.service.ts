import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  allMains: Array<Main> = [];
  url = 'http://localhost:3000/quest';

  constructor(private httpClient: HttpClient) { }

  getAllMains(): Observable<Array<Main>> {
    return this.httpClient.get<Array<Main>>(this.url);
  }

  addMain(userName: string): any {
    const newMain = new Main();
    newMain.name = userName;
    return this.httpClient.post(this.url, newMain);
  }
}

export class Main {
  id: number;
  name: string;
}

export class Session {
  login: boolean;

  constructor() {
    this.login = false;
  }

  reset(): Session {
    this.login = false;
    return this;
  }
}


