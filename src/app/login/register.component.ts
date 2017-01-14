import { Component, Input} from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { AngularFire, FirebaseAuth } from 'angularfire2';

@Component({
  selector: 'ctf-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']

})
export class RegisterComponent {
  username: string;
  fullname: string;

  constructor(
    private af: AngularFire,
    private router: Router,
  ) { }

  continue() {
    this.af.auth.subscribe((auth) => {
      this.af.database.object('users').update({
        [auth.uid]: {
          username: this.username,
          fullname: this.fullname,
          email: auth.google.email
        }        
      });
      this.router.navigate(['']);
    })
  }

  logout() {
    this.af.auth.logout();
  }
}
