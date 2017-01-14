import { Component, Input} from '@angular/core';
import { AngularFire, AuthProviders, AuthMethods } from 'angularfire2';
import { AuthService } from '../auth.service';

@Component({
  selector: 'ctf-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(
    private af: AngularFire,
    private authService: AuthService,
  ) {}
}
