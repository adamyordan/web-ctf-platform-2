import { Component, Input, trigger, transition, style, animate} from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AngularFire, FirebaseAuth, FirebaseObjectObservable } from 'angularfire2';
import { AuthService } from '../auth.service';
import { User } from '../shared/user.model';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'ctf-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  showSplash: boolean = true;
  showDashboard: Observable<Boolean>;

  constructor(
    private authService: AuthService,
  ) {
    this.showDashboard = authService.authenticated;
    this.showDashboard.subscribe(() => this.showSplash = false);
  }

  logout() {
    this.authService.logout();
  }

}
  