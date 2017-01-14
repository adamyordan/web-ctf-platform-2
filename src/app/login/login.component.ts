import { Component, Input} from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { AngularFire, FirebaseAuth } from 'angularfire2';
import { AuthService } from '../auth.service';

@Component({
  selector: 'ctf-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']

})
export class LoginComponent {
  constructor(
    private authService: AuthService,
  ) {
  }

  login() {
    this.authService.login();
  }

}
