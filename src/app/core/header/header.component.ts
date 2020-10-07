import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/service/session.service';
import { Session } from 'src/app/class/main.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public login = false; // 変更

  constructor(public sessionService: SessionService) { }

  ngOnInit() {
    this.sessionService.sessionState.subscribe((session: Session) => { // 追加
      if (session) {
        this.login = session.login;
      }
    })
  }

  logout(): void {  // 追加
    this.sessionService.logout();
  }

}
