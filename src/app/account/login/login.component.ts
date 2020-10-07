import { Component, OnInit } from '@angular/core';
import { SessionService } from 'src/app/service/session.service';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  
  constructor(private sessionService: SessionService) { }

  ngOnInit() {}

  submitLogin() {
    this.sessionService.login();
  }
}
