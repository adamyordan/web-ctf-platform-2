import { Component, Input } from '@angular/core';
import { AngularFire, FirebaseObjectObservable, FirebaseAuthState } from 'angularfire2';
import { User } from '../shared/user.model';
import { AuthService } from '../auth.service';

@Component({
  selector: 'profile-card',
  template: `
    <div class="profile-card">
      <div class="pr-card">
        <div class="prc-header">
          <h3>PROFILE</h3>
        </div>
        <div class="prc-content">
          <div class="form-group">
            <label>Username</label>
            <input class="form-control" [value]="(user|async)?.username" disabled>
          </div>
          <div class="form-group">
            <label>Fullname</label>
            <input class="form-control" [value]="(user|async)?.fullname" [(ngModel)]="newFullname">
          </div>
          <div class="form-group">
            <label>Email</label>
            <input class="form-control" [value]="(user|async)?.email" disabled>
          </div>
          <button class="btn btn-update" (click)="updateProfile()">Update</button>
        </div>
        <div class="prc-footer"></div>
      </div>
    </div>
  `,
  styles: [`
    .pr-card {
      margin: 0 auto;
      margin-top: 50px;
      width: 300px;
      min-height: 300px;
      background-color: #fff;
      text-align: center;
    }
    .prc-header {
      min-height: 50px;
      background-color: #2aa;
      text-align: center;
      padding: 10px;
    }
    .prc-header h3 {
      margin: 0;
      color: white;
      font-weight: bold;
    }
    .prc-content {
      min-height: 248px;
      padding: 20px;
    }
    .prc-content input {
      box-shadow: none;
      border-radius: 0;
      text-align: center;
    }
    .prc-footer {
      min-height: 2px;
      background-color: #2aa;
    }
    .btn-update {
      background-color: #2aa;
      color: white;
    }
  `]

})
export class ProfileComponent {
  user : FirebaseObjectObservable<User>;
  newFullname : string;

  constructor(
    private af: AngularFire,
    private authService: AuthService,
  ) {
    this.user = authService.user;
    this.user.subscribe((user: User) => {
      if (user) this.newFullname = user.fullname;
    })
  }

  updateProfile() {
    this.user.update({
      fullname: this.newFullname
    });
  }

}
